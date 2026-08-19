import {
    Request,
    Response,
    NextFunction,
} from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
    throw new Error(
        "JWT_SECRET is not defined in environment variables"
    );
}

export interface AuthenticatedRequest
    extends Request {
    user?: {
        userId: string;
        role: "student" | "admin";
    };
}

// ==========================================
// Authenticate User
// ==========================================

export const authenticate = (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const authHeader =
            req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({
                success: false,
                message: "Authentication required",
                data: null,
            });
        }

        if (
            !authHeader.startsWith("Bearer ")
        ) {
            return res.status(401).json({
                success: false,
                message:
                    "Invalid authorization format",
                data: null,
            });
        }

        const token =
            authHeader.split(" ")[1];

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Authentication token missing",
                data: null,
            });
        }

        const decoded = jwt.verify(
            token,
            JWT_SECRET
        ) as {
            userId: string;
            role: "student" | "admin";
        };

        req.user = {
            userId: decoded.userId,
            role: decoded.role,
        };

        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Invalid or expired token",
            data: null,
        });
    }
};