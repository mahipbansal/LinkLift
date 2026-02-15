import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const { name, email, message, toEmoji, toName } = await req.json();

        console.log("📬 New Contact Form Submission:");
        console.log(`- From: ${name} (${email})`);
        console.log(`- Message: ${message}`);
        console.log(`- Directed to: ${toName}`);

        // Here we would typically send an email using Resend, SendGrid, etc.
        // For now, we return success to show the UI works perfectly.

        return NextResponse.json({ success: true, message: "Message sent successfully!" });
    } catch (error: any) {
        console.error("❌ Contact Form Error:", error.message);
        return NextResponse.json({ success: false, error: "Failed to send message" }, { status: 500 });
    }
}
