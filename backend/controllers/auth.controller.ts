import { Request, Response, NextFunction } from "express";
import {
    registerUser,
    loginUser,
} from "../services/auth.service";

// ==========================================
// Register
// ==========================================

export const register = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const {
            fullName,
            username,
            email,
            phone,
            password,
            paymentReference
        } = req.body;

        // Basic validation
        if (!fullName || !username || !email || !password) {
            return res.status(400).json({
                success: false,
                message:
                    "Full name, username, email and password are required",
                data: null,
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message:
                    "Password must be at least 6 characters",
                data: null,
            });
        }

        const user = await registerUser({
            fullName,
            username,
            email,
            phone,
            password,
            paymentReference,
        });

        return res.status(201).json({
            success: true,
            message: "Registration successful",
            data: user,
        });
    } catch (error) {
        next(error);
    }
};

// ==========================================
// Login
// ==========================================

export const login = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const {
            usernameOrEmail,
            password,
        } = req.body;

        if (!usernameOrEmail || !password) {
            return res.status(400).json({
                success: false,
                message:
                    "Username/email and password are required",
                data: null,
            });
        }

        const result = await loginUser({
            usernameOrEmail,
            password,
        });

        return res.status(200).json({
            success: true,
            message: "Login successful",
            data: result,
        });
    } catch (error) {
        console.error("Login error:", error);

        const statusCode =
            (error as Error & {
                statusCode?: number;
            }).statusCode || 500;

        res.status(statusCode).json({
            success: false,
            message:
                error instanceof Error
                    ? error.message
                    : "Login failed",
            data: null,
        });
    }
};