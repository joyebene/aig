import { Router } from "express";
import authRoutes from "./auth.routes";
import paymentRoutes from "./payment.routes";
import dashboardRoutes from "./dashboard.routes";

const router = Router();

// Authentication routes
router.use("/auth", authRoutes);

// Payments
router.use("/payment", paymentRoutes);

// Dashboard
router.use("/dashboard", dashboardRoutes);

// Root API route
router.get("/", (_req, res) => {
    res.status(200).json({
        success: true,
        message: "ACELINE backend is running",
    });
});

export default router;