import {
    Request,
    Response,
    NextFunction,
} from "express";

import {
    initializePayment,
    verifyPayment,
} from "../services/paystack.service";

// ==========================================
// Initialize Payment
// ==========================================

export const initializePaymentController =
    async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const { email } = req.body;

            if (!email) {
                return res.status(400).json({
                    success: false,
                    message: "Email is required",
                    data: null,
                });
            }

            const result =
                await initializePayment(email);

            return res.status(200).json({
                success: true,
                message:
                    "Payment initialized successfully",
                data: result,
            });
        } catch (error) {
            next(error);
        }
    };

// ==========================================
// Verify Payment
// ==========================================

export const verifyPaymentController =
    async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const { reference } = req.params;

            if (!reference) {
                return res.status(400).json({
                    success: false,
                    message:
                        "Payment reference is required",
                    data: null,
                });
            }

            const result =
                await verifyPayment(reference as string);

            return res.status(200).json({
                success: result.success,
                message: result.message,
                data: result,
            });
        } catch (error) {
            next(error);
        }
    };