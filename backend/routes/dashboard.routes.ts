import { Router } from "express";

import {
    getDashboardUser,
} from "../controllers/dashboard.controller";

import {
    authenticate,
} from "../middleware/auth.middleware";

const router = Router();

// ==========================================
// Current logged-in user
// ==========================================

router.get(
    "/me",
    authenticate,
    getDashboardUser
);

export default router;