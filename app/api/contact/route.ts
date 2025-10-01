import { NextResponse } from "next/server";
import Mailjet from "node-mailjet";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const escapeHtml = (value: string) =>
  value.replace(/[&<>"']/g, (char) => {
    switch (char) {
      case "&":
        return "&amp;";
      case "<":
        return "&lt;";
      case ">":
        return "&gt;";
      case '"':
        return "&quot;";
      case "'":
        return "&#39;";
      default:
        return char;
    }
  });

const extractNameAndEmail = (raw: string) => {
  const trimmed = raw.trim();
  const match = trimmed.match(/^(.*)<([^<>]+)>$/);

  if (match) {
    const name = match[1].trim();
    const email = match[2].trim();
    return {
      email,
      name: name.length ? name : undefined,
    };
  }

  return {
    email: trimmed,
    name: undefined,
  };
};

export async function POST(request: Request) {
  const mailjetApiKey = process.env.MAILJET_API_KEY;
  const mailjetApiSecret = process.env.MAILJET_API_SECRET;

  if (!mailjetApiKey || !mailjetApiSecret) {
    console.error("Missing Mailjet credentials");
    return NextResponse.json(
      { message: "Email service is not configured." },
      { status: 500 }
    );
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch (error) {
    console.error("Failed to parse contact form payload", error);
    return NextResponse.json(
      { message: "Invalid request body." },
      { status: 400 }
    );
  }

  const safeFullName =
    typeof (payload as { fullName?: unknown }).fullName === "string"
      ? (payload as { fullName: string }).fullName
      : "";
  const safeEmail =
    typeof (payload as { email?: unknown }).email === "string"
      ? (payload as { email: string }).email
      : "";
  const safeMessage =
    typeof (payload as { message?: unknown }).message === "string"
      ? (payload as { message: string }).message
      : "";

  const trimmedFullName = safeFullName.trim();
  const trimmedEmail = safeEmail.trim();
  const normalizedMessage = safeMessage.replace(/\r\n/g, "\n");
  const trimmedMessage = normalizedMessage.trim();

  if (!trimmedFullName || !trimmedEmail || !trimmedMessage) {
    return NextResponse.json(
      { message: "Please complete every field before submitting." },
      { status: 400 }
    );
  }

  if (!emailPattern.test(trimmedEmail)) {
    return NextResponse.json(
      { message: "Please enter a valid email address." },
      { status: 400 }
    );
  }

  const toAddress = process.env.CONTACT_FORM_TO_EMAIL ?? "sepehr.sharafi.123@gmail.com";
  const fromAddressRaw =
    process.env.CONTACT_FORM_FROM_EMAIL ?? "Forgewrite Contact <no-reply@forgewrite.com>";

  const sender = extractNameAndEmail(fromAddressRaw);

  if (!emailPattern.test(sender.email)) {
    console.error("Invalid CONTACT_FORM_FROM_EMAIL provided");
    return NextResponse.json(
      { message: "Email service is misconfigured." },
      { status: 500 }
    );
  }

  const toEntry = extractNameAndEmail(toAddress);

  const mailjet = Mailjet.apiConnect(mailjetApiKey, mailjetApiSecret);

  const messagePayload = {
    Messages: [
      {
        From: {
          Email: sender.email,
          Name: sender.name,
        },
        To: [
          {
            Email: toEntry.email,
            Name: toEntry.name,
          },
        ],
        ReplyTo: {
          Email: trimmedEmail,
          Name: trimmedFullName,
        },
        Subject: `New contact request from ${trimmedFullName}`,
        TextPart: `Name: ${trimmedFullName}\nEmail: ${trimmedEmail}\n\nMessage:\n${trimmedMessage}`,
        HTMLPart: `
          <div>
            <p><strong>Name:</strong> ${escapeHtml(trimmedFullName)}</p>
            <p><strong>Email:</strong> ${escapeHtml(trimmedEmail)}</p>
            <p><strong>Message:</strong></p>
            <p>${escapeHtml(trimmedMessage).replace(/\n/g, "<br />")}</p>
          </div>
        `,
      },
    ],
  };

  try {
    const response = await mailjet.post("send", { version: "v3.1" }).request(messagePayload);
    console.log("Mailjet email queued", response.body?.Messages?.[0]?.To?.[0]?.MessageUUID ?? response.body);
  } catch (error) {
    console.error("Failed to send contact form email via Mailjet", error);
    return NextResponse.json(
      { message: "We could not send your message. Please try again soon." },
      { status: 502 }
    );
  }

  return NextResponse.json({ message: "Message sent." }, { status: 200 });
}
