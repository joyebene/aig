import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "../models/User";
import Payment from "../models/Payment";
import dotenv from "dotenv";

dotenv.config();

const MONGO_URI = process.env.MONGODB_URI;

if (!MONGO_URI) {
    throw new Error("MONGO_URI is not defined");
}

// =====================================================
// ACELINE PAID PARTICIPANTS
// =====================================================

const participants = [
    {
        fullName: "Shad Daiyk",
        email: "shaddaiyk@gmail.com",
        phone: "08147702462",
        attendance: "In-Person",
        amount: 50000,
    },

    {
        fullName: "Stephen Isenyo",
        email: "stephenisenyo@gmail.com",
        phone: "08125098440",
        attendance: "In-Person",
        amount: 50000,
    },

    {
        fullName: "Peter Nenpoji Gochuk",
        email: "nenpojipeter13@gmail.com",
        phone: "07049923811",
        attendance: "In-Person",
        amount: 25000,
    },

    {
        fullName: "Ugochukwu Emmanuel",
        email: "ugochukwuemmanuel329@gmail.com",
        phone: "09036703505",
        attendance: "In-Person",
        amount: 20000,
    },

    {
        fullName: "Dogara Ajegena Ablaba",
        email: "dogaraablaba@gmail.com",
        phone: "08060729177",
        attendance: "In-Person",
        amount: 20000,
    },

    {
        fullName: "John Akila Japhet",
        email: "japhshishiri@gmail.com",
        phone: "09065207071",
        attendance: "In-Person",
        amount: 20000,
    },

    {
        fullName: "Simeon Tyokumba",
        email: "simekltd1@gmail.com",
        phone: "09137149063",
        attendance: "In-Person",
        amount: 10000,
    },

    {
        fullName: "Amos Obe",
        email: "obeamos300@gmail.com",
        phone: "07014384332",
        attendance: "Online",
        amount: 50000,
    },

    {
        fullName: "Mmeli Mtungwa",
        email: "mmelimtungwa20@gmail.com",
        phone: "07183435029",
        attendance: "Online",
        amount: 50000,
    },

    {
        fullName: "Egeneonu Chidera",
        email: "donjacobz360@gmail.com",
        phone: "08142230648",
        attendance: "Online",
        amount: 20000,
    },

    {
        fullName: "Oko-Oboh Destiny",
        email: "destinymeek83@gmail.com",
        phone: "09079973926",
        attendance: "Online",
        amount: 10000,
    },

    {
        fullName: "ABDULMUIID ANOZE",
        email: "iambaezqk08@gmail.com",
        phone: "08137864196",
        attendance: "Online",
        amount: 10000,
    },

    {
        fullName: "Dammy Omotayo",
        email: "dammyomotayo064@gmail.com",
        phone: "08100366117",
        attendance: "Online",
        amount: 10000,
    },
];

// =====================================================
// SEED
// =====================================================

async function seedParticipants() {
    try {
        console.log("Connecting to MongoDB...");

        await mongoose.connect(MONGO_URI!);

        console.log("MongoDB connected.");

        // -------------------------------------------------
        // Default password
        // -------------------------------------------------

        const hashedPassword = await bcrypt.hash(
            "123456789",
            12
        );

        let createdUsers = 0;
        let existingUsers = 0;
        let createdPayments = 0;

        // -------------------------------------------------
        // Process participants
        // -------------------------------------------------

        for (let i = 0; i < participants.length; i++) {
            const participant = participants[i];

            const email =
                participant.email
                    .trim()
                    .toLowerCase();

            // ---------------------------------------------
            // Generate username
            // ---------------------------------------------

            let username =
                email
                    .split("@")[0]
                    .toLowerCase()
                    .replace(/[^a-z0-9]/g, "");

            // ---------------------------------------------
            // Check existing email
            // ---------------------------------------------

            let user = await User.findOne({
                email,
            });

            if (user) {
                console.log(
                    `⚠️ User already exists: ${email}`
                );

                existingUsers++;
            } else {
                // -----------------------------------------
                // Make username unique
                // -----------------------------------------

                const originalUsername = username;

                let usernameCounter = 1;

                while (
                    await User.findOne({
                        username,
                    })
                ) {
                    username =
                        `${originalUsername}${usernameCounter}`;

                    usernameCounter++;
                }

                // -----------------------------------------
                // Create user
                // -----------------------------------------

                user = await User.create({
                    fullName:
                        participant.fullName.trim(),

                    username,

                    email,

                    phone:
                        participant.phone,

                    password:
                        hashedPassword,

                    role: "student",

                    hasAccess: true,

                    accessGrantedAt:
                        new Date(),
                });

                createdUsers++;

                console.log(
                    `✅ User created: ${email}`
                );

                console.log(
                    `   Username: ${username}`
                );
            }

            // -------------------------------------------------
            // Create payment record
            // -------------------------------------------------

            const reference =
                `ACELINE_SEED_${String(i + 1).padStart(3, "0")}`;

            // Prevent duplicate payment reference
            const existingPayment =
                await Payment.findOne({
                    reference,
                });

            if (existingPayment) {
                console.log(
                    `⚠️ Payment already exists: ${reference}`
                );

                continue;
            }

            const payment =
                await Payment.create({
                    reference,

                    email,

                    amount:
                        participant.amount,

                    status: "success",

                    paidAt: new Date(),

                    usedForRegistration: true,

                    user: user._id,
                });

            createdPayments++;

            console.log(
                `💰 Payment created: ${reference} - ₦${participant.amount.toLocaleString()}`
            );
        }

        // -------------------------------------------------
        // Summary
        // -------------------------------------------------

        console.log("\n====================================");
        console.log("ACELINE SEED COMPLETED");
        console.log("====================================");

        console.log(
            `Users created: ${createdUsers}`
        );

        console.log(
            `Existing users: ${existingUsers}`
        );

        console.log(
            `Payments created: ${createdPayments}`
        );

        console.log(
            "Default password: 123456789"
        );

        console.log("====================================\n");

    } catch (error) {
        console.error(
            "❌ Seed failed:",
            error
        );
    } finally {
        await mongoose.disconnect();

        console.log(
            "MongoDB connection closed."
        );
    }
}

seedParticipants();