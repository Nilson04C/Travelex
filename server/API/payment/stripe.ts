import express from "express";
import Stripe from "stripe";
import dotenv from "dotenv";
dotenv.config();

const stripeApiKey = process.env.StripeSecretKey;

if (!stripeApiKey) {
  throw new Error("StripeSecretKey is not defined in environment variables");
}

const router = express.Router();
const stripe = new Stripe(stripeApiKey, { apiVersion: "2025-04-30.basil" });

router.post("/create-payment-intent", async (req, res) => {
  const { amount, currency } = req.body;

  try {
    // Create a PaymentIntent with the specified amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
      amount, // Amount in the smallest currency unit (e.g., cents for USD)
      currency, // e.g., "usd"
    });

    res.status(200).json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error("Error creating payment intent:", error);
    res.status(500).json({ error: "Failed to create payment intent" });
  }
});

export default router;