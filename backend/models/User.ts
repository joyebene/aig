import mongoose, { Document, Schema } from "mongoose";

export type UserRole = "student" | "admin";

export interface IUser extends Document {
    fullName: string;
    username: string;
    email: string;
    phone: string;
    password: string;
    role: UserRole;
    hasAccess: boolean;
    accessGrantedAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}

const userSchema = new Schema<IUser>(
    {
        fullName: {
            type: String,
            required: true,
            trim: true,
            minlength: 2,
            maxlength: 100,
        },

        username: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true,
            minlength: 3,
            maxlength: 30,
        },

        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true,
        },

        phone: {
            type: String,
            required: true,
            trim: true,
        },

        password: {
            type: String,
            required: true,
            minlength: 6,
        },

        role: {
            type: String,
            enum: ["student", "admin"],
            default: "student",
        },

        hasAccess: {
            type: Boolean,
            default: false,
        },

        accessGrantedAt: {
            type: Date,
        },
    },
    {
        timestamps: true,
    }
);

const User = mongoose.model<IUser>("User", userSchema);

export default User;