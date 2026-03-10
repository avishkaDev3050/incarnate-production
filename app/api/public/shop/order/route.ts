import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16" as any,
});

export async function POST(req: Request) {
  try {
    // We expect JSON from your frontend handleStripeCheckout function
    const body = await req.json();
    const { pdf_url, name, price, quantity, shipping, teacherEmail } = body;

    // 1. Calculate Prices
    // Removes any currency symbols like "$" or "," to ensure it's a number
    const unitAmount = parseFloat(price.toString().replace(/[^0-9.-]+/g, ""));
    const qty = quantity || 1;
    const totalPrice = unitAmount * qty;

    // 2. Database Save (Matches your HeidiSQL table columns)
    const [result]: any = await db.execute(
      `INSERT INTO orders (
        pdf_url,
        product_name, 
        quantity, 
        price_per_unit, 
        total_price, 
        full_name, 
        address, 
        zip_code, 
        mobile, 
        status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        pdf_url || name,
        name,                          
        qty,                           
        unitAmount,                    
        totalPrice,                    
        shipping?.fullName || "N/A",   
        shipping?.address || "Digital",
        shipping?.zipCode || "N/A",    
        shipping?.mobile || "N/A",     
        'pending'                      
      ]
    );

    const orderId = result.insertId;

    // 3. Initialize Stripe Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "gbp", // Set your preferred currency
            product_data: { 
              name: name,
              description: `Order ID: ${orderId}` 
            },
            unit_amount: Math.round(unitAmount * 100), // Stripe uses cents/pence
          },
          quantity: qty,
        },
      ],
      mode: "payment",
      metadata: {
        order_id: orderId.toString(),
        teacher_email: teacherEmail || ""
      },
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success?orderId=${orderId}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/shop`,
    });

    // 4. Update the Stripe Session ID in your table
    await db.execute(
      "UPDATE orders SET stripe_session_id = ? WHERE id = ?",
      [session.id, orderId]
    );

    return NextResponse.json({ 
      success: true, 
      id: session.id, 
      url: session.url 
    });

  } catch (error: any) {
    console.error("Order Save Error:", error);
    return NextResponse.json(
      { success: false, error: error.message }, 
      { status: 500 }
    );
  }
}