import { NextResponse } from "next/server";
import crypto from "crypto";
import { createClient } from "@supabase/supabase-js";

const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET!;

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const body = await req.text();
    const signature = req.headers.get("x-razorpay-signature");

    if (!webhookSecret) {
      console.error("Missing RAZORPAY_WEBHOOK_SECRET");
      return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
    }

    if (!signature) {
        return NextResponse.json({ error: "Missing signature" }, { status: 400 });
    }

    // Verify Signature
    const shasum = crypto.createHmac("sha256", webhookSecret);
    shasum.update(body);
    const digest = shasum.digest("hex");

    if (digest !== signature) {
      console.error("Invalid Razorpay Signature");
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    // Parse Event
    const event = JSON.parse(body);

    if (event.event === "order.paid") {
      const payment = event.payload.payment.entity;
      const order = event.payload.order.entity;
      
      // Notes are attached to the order or payment. Check both preferably.
      const resumeId = order.notes?.resumeId || payment.notes?.resumeId;

      if (resumeId) {
        console.log(`✅ Payment received for Resume ID: ${resumeId}`);

        const { error } = await supabase
          .from("resumes")
          .update({ is_paid: true })
          .eq("id", resumeId);

        if (error) {
          console.error("Supabase Update Error:", error);
          return NextResponse.json({ error: "Database update failed" }, { status: 500 });
        }
      } else {
          console.warn("⚠️ No resumeId found in Razorpay order notes");
      }
    }

    return NextResponse.json({ status: "ok" });
  } catch (err: any) {
    console.error("Webhook Error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
