import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User";
import Payment from "../models/Payment";

interface RegisterData {
    fullName: string;
    username: string;
    email: string;
    phone: string;
    password: string;
    paymentReference: string;
}

interface LoginData {
    usernameOrEmail: string;
    password: string;
}

const JWT_SECRET = process.env.JWT_SECRET;


if (!JWT_SECRET) {
    throw new Error(
        "JWT_SECRET is not defined in environment variables"
    );
}

// ==========================================
// Register User
// Payment MUST be successful before account
// creation.
// ==========================================

export const registerUser = async (
    data: RegisterData
) => {
    const {
        fullName,
        username,
        email,
        phone,
        password,
        paymentReference,
    } = data;

    // Normalize values
    const normalizedUsername =
        username.trim().toLowerCase();

    const normalizedEmail =
        email.trim().toLowerCase();

    const normalizedReference =
        paymentReference.trim();

    // ==========================================
    // 1. Validate payment reference
    // ==========================================

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

    // ==========================================
    // 2. Find payment
    // ==========================================

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
        ).statusCode = 400;

        throw error;
    }

    // ==========================================
    // 3. Payment must be successful
    // ==========================================

    if (payment.status !== "success") {
        const error = new Error(
            "Payment has not been completed successfully"
        );

        (
            error as Error & {
                statusCode?: number;
            }
        ).statusCode = 400;

        throw error;
    }

    // ==========================================
    // 4. Payment must not already be used
    // ==========================================

    if (payment.usedForRegistration) {
        const error = new Error(
            "This payment has already been used for registration"
        );

        (
            error as Error & {
                statusCode?: number;
            }
        ).statusCode = 409;

        throw error;
    }

    // ==========================================
    // 5. Payment email must match registration
    // ==========================================

    if (
        payment.email.toLowerCase() !==
        normalizedEmail
    ) {
        const error = new Error(
            "The payment email does not match the registration email"
        );

        (
            error as Error & {
                statusCode?: number;
            }
        ).statusCode = 400;

        throw error;
    }

    // ==========================================
    // 6. Check username
    // ==========================================

    const existingUsername =
        await User.findOne({
            username: normalizedUsername,
        });

    if (existingUsername) {
        const error = new Error(
            "Username is already taken"
        );

        (
            error as Error & {
                statusCode?: number;
            }
        ).statusCode = 409;

        throw error;
    }

    // ==========================================
    // 7. Check email
    // ==========================================

    const existingEmail =
        await User.findOne({
            email: normalizedEmail,
        });

    if (existingEmail) {
        const error = new Error(
            "Email is already registered"
        );

        (
            error as Error & {
                statusCode?: number;
            }
        ).statusCode = 409;

        throw error;
    }

    // ==========================================
    // 8. Hash password
    // ==========================================

    const hashedPassword =
        await bcrypt.hash(password, 12);

    // ==========================================
    // 9. Create student account
    // ==========================================

    const user = await User.create({
        fullName: fullName.trim(),
        username: normalizedUsername,
        email: normalizedEmail,
        phone,
        password: hashedPassword,

        // NEVER accept role from public registration
        role: "student",

        // Payment was already verified
        hasAccess: true,
        accessGrantedAt:
            payment.paidAt || new Date(),
    });

    // ==========================================
    // 10. Attach payment to user
    // ==========================================

    payment.user = user._id;
    payment.usedForRegistration = true;

    await payment.save();

    // ==========================================
    // 11. Generate JWT
    // ==========================================

    const token = jwt.sign(
        {
            userId: user._id.toString(),
            role: user.role,
        },
        JWT_SECRET,
        {
            expiresIn: "7d",
        }
    );

    // ==========================================
    // 12. Safe user response
    // ==========================================

    const safeUser = {
        id: user._id,
        fullName: user.fullName,
        username: user.username,
        email: user.email,
        role: user.role,
        hasAccess: user.hasAccess,
        accessGrantedAt:
            user.accessGrantedAt,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
    };

    return {
        token,
        user: safeUser,
    };
};

// ==========================================
// Login User
// ==========================================

export const loginUser = async (
    data: LoginData
) => {
    const {
        usernameOrEmail,
        password,
    } = data;

    const loginValue =
        usernameOrEmail.trim().toLowerCase();

    const user = await User.findOne({
        $or: [
            {
                username: loginValue,
            },
            {
                email: loginValue,
            },
        ],
    }).select("+password");

    if (!user) {
        const error = new Error(
            "Invalid username/email or password"
        );

        (
            error as Error & {
                statusCode?: number;
            }
        ).statusCode = 401;

        throw error;
    }

    const passwordMatches =
        await bcrypt.compare(
            password,
            user.password
        );

    if (!passwordMatches) {
        const error = new Error(
            "Invalid username/email or password"
        );

        (
            error as Error & {
                statusCode?: number;
            }
        ).statusCode = 401;

        throw error;
    }

    const token = jwt.sign(
        {
            userId: user._id.toString(),
            role: user.role,
        },
        JWT_SECRET,
        {
            expiresIn: "7d",
        }
    );

    const safeUser = {
        id: user._id,
        fullName: user.fullName,
        username: user.username,
        email: user.email,
        role: user.role,
        hasAccess: user.hasAccess,
        accessGrantedAt:
            user.accessGrantedAt,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
    };

    return {
        token,
        user: safeUser,
    };
};