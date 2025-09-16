import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function GET() {
    try {
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
