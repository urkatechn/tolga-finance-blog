import { NextResponse } from "next/server";
import { Resend } from "resend";

export async function GET() {
    try {
        const apiKey = process.env.RESEND_API_KEY;
        if (!apiKey) {
            return NextResponse.json({ error: "RESEND_API_KEY is not configured" }, { status: 500 });
        }
        const resend = new Resend(apiKey);
        const { data, error } = await resend.emails.send({
            from: "info@notifications.tolgatanagardigil.com",
            to: ["gorkem.tanagardigil@urkatech.com"],
            subject: "Hello from Resend",
            html: "<h1>Hello from Resend</h1>",
        });

    if (error) {
        return NextResponse.json({ error: error }, { status: 500 })
    }

    return NextResponse.json({ data: data }, { status: 200 })
} catch (error) {
    return NextResponse.json({ error: error }, { status: 500 })
}
}
