import mongoose, {
    Document,
    Schema,
    Types,
} from "mongoose";

export type PaymentStatus =
    | "pending"
    | "success"
    | "failed";

export interface IPayment extends Document {
    user?: Types.ObjectId;
    email: string;
    reference: string;
    amount: number;
    currency: string;
    status: PaymentStatus;
    paystackTransactionId?: number;
    paidAt?: Date;
    usedForRegistration: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const paymentSchema = new Schema<IPayment>(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
        },

        email: {
            type: String,
            required: true,
            trim: true,
            lowercase: true,
        },

        reference: {
            type: String,
            required: true,
            unique: true,
            index: true
        },

        amount: {
            type: Number,
            required: true,
        },

        currency: {
            type: String,
            default: "NGN",
        },

        status: {
            type: String,
            enum: ["pending", "success", "failed"],
            default: "pending",
        },

        paystackTransactionId: {
            type: Number,
        },

        paidAt: {
            type: Date,
        },
        usedForRegistration: {
            type: Boolean,
            default: false,
        }
    },
    {
        timestamps: true,
    }
);

const Payment = mongoose.model<IPayment>(
    "Payment",
    paymentSchema
);

export default Payment;