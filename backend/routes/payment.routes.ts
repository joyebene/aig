import { Router } from "express";

import {
    initializePaymentController,
    verifyPaymentController,
} from "../controllers/payment.controller";

const router = Router();

// ==========================================
// Initialize Paystack payment
// ==========================================

router.post(
    "/initialize",
    initializePaymentController
);

// ==========================================
// Verify Paystack payment
// ==========================================

router.get(
    "/verify/:reference",
    verifyPaymentController
);

export default router;