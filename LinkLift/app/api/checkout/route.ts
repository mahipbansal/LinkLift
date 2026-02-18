import { NextResponse } from "next/server";
import Razorpay from "razorpay";

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID!,
    key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(req: Request) {
    try {
        const { resumeId } = await req.json(); // We don't need returnUrl for Razorpay modal flow typically, but good to have if we redirected

        if (!resumeId) {
            return NextResponse.json({ error: "Missing resumeId" }, { status: 400 });
        }

        const amount = 100 * 100; // 100 INR in paisa
        const currency = "INR";

        const options = {
            amount: amount,
            currency: currency,
            receipt: `receipt_${resumeId.slice(0, 10)}`,
            notes: {
                resumeId: resumeId, // Store resumeId in notes to retrieve in webhook
            },
        };

        const order = await razorpay.orders.create(options);

        return NextResponse.json({
            orderId: order.id,
            amount: amount,
            currency: currency,
            key: process.env.RAZORPAY_KEY_ID // Send public key to frontend
        });
    } catch (err: any) {
        console.error("Razorpay Order Error:", err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
