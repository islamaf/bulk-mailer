import { NextRequest, NextResponse } from "next/server";
import { createTransport } from "nodemailer";

const nodemailer = (email: string, password: string) => {
  return createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: email,
      pass: password,
    },
  });
};

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const mailer = nodemailer(data.userData.email, data.userData.password);

    if (data.message === "" || !data.message) {
      throw new Error("Email message can't be empty.");
    }

    if (data.emails.length === 0) {
      throw new Error("You didn't add any recipient emails.");
    }

    if (!data.userData.email || !data.userData.password) {
      throw new Error("Email or password is missing.");
    }

    for (const email of data.emails) {
      await mailer.sendMail({
        subject: data.subject,
        to: email,
        from: data.userData.sendAs,
        text: data.message,
      });
    }

    return NextResponse.json({ message: "Emails sent!" }, { status: 200 });
  } catch (e) {
    if (e instanceof Error) {
      return NextResponse.json({ error: e.message }, { status: 500 });
    }

    return NextResponse.json(
      { error: "Error sending emails." },
      { status: 500 }
    );
  }
}
