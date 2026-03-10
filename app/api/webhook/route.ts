import { NextResponse } from "next/server";
import Stripe from "stripe";
import { Resend } from "resend";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16" as any,
});

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature") as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  // Payment එක සාර්ථක වූ විට
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    // Customer ගේ විස්තර ලබා ගැනීම
    const customerEmail = session.customer_details?.email;
    const customerName = session.customer_details?.name;
    const totalAmount = (session.amount_total! / 100).toFixed(2);

    if (customerEmail) {
      try {
        await resend.emails.send({
          from: "Incarnet <onboarding@resend.dev>", // පසුව ඔයාගේ domain එකට මාරු කරන්න
          to: customerEmail,
          subject: "Payment Successful - Your Incarnet Receipt",
          html: `
            <div style="font-family: sans-serif; padding: 20px; color: #333;">
              <h1 style="color: #0056b3;">Payment Successful!</h1>
              <p>Hi ${customerName},</p>
              <p>Thank you for your purchase from <strong>Incarnet</strong>. Your payment of <strong>£${totalAmount}</strong> has been processed successfully.</p>
              <p>You can view and download your official invoice using the link below:</p>
              <a href="${process.env.NEXT_PUBLIC_APP_URL}/success?session_id=${session.id}" 
                 style="background: #0056b3; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; display: inline-block; margin-top: 10px;">
                 View Digital Invoice
              </a>
              <br/><br/>
              <p>If you have any questions, feel free to reply to this email.</p>
              <p>Best Regards,<br/>Team Incarnet</p>
            </div>
          `,
        });
      } catch (error) {
        console.error("Email sending failed:", error);
      }
    }
  }

  return NextResponse.json({ received: true });
}