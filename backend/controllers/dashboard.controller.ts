import {
    Response,
    NextFunction,
} from "express";

import {
    AuthenticatedRequest,
} from "../middleware/auth.middleware";

import {
    getCurrentUser,
} from "../services/dashboard.service";

// ==========================================
// Get Dashboard User
// ==========================================

export const getDashboardUser = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "Authentication required",
                data: null,
            });
        }

        const user =
            await getCurrentUser(
                req.user.userId
            );

        return res.status(200).json({
            success: true,
            message:
                "Current user retrieved successfully",
            data: user,
        });
    } catch (error) {
        next(error);
    }
};