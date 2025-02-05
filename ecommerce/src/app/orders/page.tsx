"use client";

import { loadStripe } from "@stripe/stripe-js";

const asyncStripe = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string);

const OrderPage = ({ amount = 1 }) => {
  const handler = async () => {
    try {
      const stripe = await asyncStripe;
      const res = await fetch("/api/payment", {
        method: "POST",
        body: JSON.stringify({ amount }),
        headers: { "Content-Type": "application/json" },
      });
      const { sessionId } = await res.json();

      console.log(stripe, "kjnknknkn");
      

      if (!stripe) {
        throw new Error("Stripe failed to load");
      }

      const { error } = await stripe.redirectToCheckout({ sessionId });
      console.log(error);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <button
      onClick={handler}
      className="bg-blue-700 hover:bg-blue-800 duration-200 px-8 py-4 text-white"
    >
      Checkout
    </button>
  );
};

export default OrderPage;
