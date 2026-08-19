import User from "../models/User";

// ==========================================
// Get Current Logged-In User
// ==========================================

export const getCurrentUser = async (
    userId: string
) => {
    const user = await User.findById(userId);

    if (!user) {
        const error = new Error(
            "User account no longer exists"
        );

        (
            error as Error & {
                statusCode?: number;
            }
        ).statusCode = 404;

        throw error;
    }

    // Never return password
    return {
        id: user._id,
        fullName: user.fullName,
        username: user.username,
        email: user.email,
        role: user.role,
        hasAccess: user.hasAccess,
        accessGrantedAt: user.accessGrantedAt,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
    };
};