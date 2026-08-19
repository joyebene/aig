import Payment from "../models/Payment";

const PAYSTACK_SECRET_KEY =
    process.env.PAYSTACK_SECRET_KEY;

if (!PAYSTACK_SECRET_KEY) {
    throw new Error(
        "PAYSTACK_SECRET_KEY is not defined in environment variables"
    );
}

// ==========================================
// Configuration
// ==========================================

// ₦50,000
// Paystack expects amount in kobo
const COURSE_AMOUNT_NAIRA = 50000;
const COURSE_AMOUNT_KOBO = COURSE_AMOUNT_NAIRA * 100;

const PAYSTACK_BASE_URL =
    "https://api.paystack.co";

// ==========================================
// Generate Payment Reference
// ==========================================

const generateReference = (): string => {
    return `ACELINE_${Date.now()}_${Math.random()
        .toString(36)
        .substring(2, 10)
        .toUpperCase()}`;
};

// ==========================================
// Initialize Payment
// ==========================================

export const initializePayment = async (
    email: string
) => {
    const normalizedEmail =
        email.trim().toLowerCase();

    if (!normalizedEmail) {
        const error = new Error(
            "Email is required"
        );

        (
            error as Error & {
                statusCode?: number;
            }
        ).statusCode = 400;

        throw error;
    }

    const reference = generateReference();

    // ------------------------------------------
    // Initialize transaction with Paystack
    // ------------------------------------------

    const response = await fetch(
        `${PAYSTACK_BASE_URL}/transaction/initialize`,
        {
            method: "POST",
            headers: {
                Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email: normalizedEmail,

                // Paystack uses kobo
                amount: COURSE_AMOUNT_KOBO.toString(),

                currency: "NGN",
                callback_url:
                    process.env.FRONTEND_URL ||
                    "http://localhost:5500/index.html",

                reference,

                metadata: {
                    product: "ACELINE Income Generator Blueprint",
                    email: normalizedEmail,
                },
            }),
        }
    );

    const result = await response.json();

    if (!response.ok || !result.status) {
        const error = new Error(
            result.message ||
            "Unable to initialize payment"
        );

        (
            error as Error & {
                statusCode?: number;
            }
        ).statusCode = 400;

        throw error;
    }

    // ------------------------------------------
    // Save pending payment
    // ------------------------------------------

    const payment = await Payment.create({
        email: normalizedEmail,
        reference,
        amount: COURSE_AMOUNT_NAIRA,
        currency: "NGN",
        status: "pending",
        usedForRegistration: false,
    });

    return {
        paymentId: payment._id,
        reference,
        amount: COURSE_AMOUNT_NAIRA,
        currency: "NGN",

        authorizationUrl:
            result.data.authorization_url,

        accessCode:
            result.data.access_code,
    };
};

// ==========================================
// Verify Payment
// ==========================================

export const verifyPayment = async (
    reference: string
) => {
    const normalizedReference =
        reference.trim();

    if (!normalizedReference) {
        const error = new Error(
            "Payment reference is required"
        );

        (
            error as Error & {
                statusCode?: number;
            }
        ).statusCode = 400;

        throw error;
    }

    // ------------------------------------------
    // Find our payment record
    // ------------------------------------------

    const payment = await Payment.findOne({
        reference: normalizedReference,
    });

    if (!payment) {
        const error = new Error(
            "Payment record not found"
        );

        (
            error as Error & {
                statusCode?: number;
            }
        ).statusCode = 404;

        throw error;
    }

    // ------------------------------------------
    // Ask Paystack for the real transaction status
    // ------------------------------------------

    const response = await fetch(
        `${PAYSTACK_BASE_URL}/transaction/verify/${encodeURIComponent(
            normalizedReference
        )}`,
        {
            method: "GET",
            headers: {
                Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
            },
        }
    );

    const result = await response.json();

    if (!response.ok || !result.status) {
        const error = new Error(
            result.message ||
            "Unable to verify payment"
        );

        (
            error as Error & {
                statusCode?: number;
            }
        ).statusCode = 400;

        throw error;
    }

    const transaction = result.data;

    // ------------------------------------------
    // Verify reference
    // ------------------------------------------

    if (
        transaction.reference !==
        payment.reference
    ) {
        const error = new Error(
            "Payment reference mismatch"
        );

        (
            error as Error & {
                statusCode?: number;
            }
        ).statusCode = 400;

        throw error;
    }

    // ------------------------------------------
    // Verify email
    // ------------------------------------------

    const transactionEmail =
        transaction.customer?.email
            ?.trim()
            .toLowerCase();

    if (
        !transactionEmail ||
        transactionEmail !== payment.email
    ) {
        const error = new Error(
            "Payment email does not match"
        );

        (
            error as Error & {
                statusCode?: number;
            }
        ).statusCode = 400;

        throw error;
    }

    // ------------------------------------------
    // Verify amount
    // ------------------------------------------

    if (
        transaction.amount !==
        COURSE_AMOUNT_KOBO
    ) {
        const error = new Error(
            "Payment amount is incorrect"
        );

        (
            error as Error & {
                statusCode?: number;
            }
        ).statusCode = 400;

        throw error;
    }

    // ------------------------------------------
    // Verify currency
    // ------------------------------------------

    if (
        transaction.currency !== "NGN"
    ) {
        const error = new Error(
            "Payment currency is incorrect"
        );

        (
            error as Error & {
                statusCode?: number;
            }
        ).statusCode = 400;

        throw error;
    }

    // ------------------------------------------
    // Check transaction status
    // ------------------------------------------

    if (
        transaction.status !== "success"
    ) {
        payment.status = "failed";

        await payment.save();

        return {
            success: false,
            status: transaction.status,
            message:
                "Payment has not been completed successfully",
            reference: payment.reference,
        };
    }

    // ------------------------------------------
    // Payment successful
    // ------------------------------------------

    payment.status = "success";

    payment.paystackTransactionId =
        transaction.id;

    payment.paidAt = transaction.paid_at
        ? new Date(transaction.paid_at)
        : new Date();

    await payment.save();

    return {
        success: true,
        status: "success",
        message: "Payment verified successfully",
        reference: payment.reference,
        email: payment.email,
        amount: payment.amount,
        currency: payment.currency,
        paidAt: payment.paidAt,
        paymentId: payment._id,
    };
};