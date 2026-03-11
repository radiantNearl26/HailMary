import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(request: Request) {
  try {
    const { subscriptions, threshold } = (await request.json()) as {
      subscriptions: {
        name: string;
        amount: string;
        renewalDate: string;
        frequency: string;
      }[];
      threshold: string;
    };

    // Create an Ethereal test account on the fly
    const testAccount = await nodemailer.createTestAccount();

    const transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });

    const subscriptionRows = subscriptions
      .map(
        (s) => `
        <tr>
          <td style="padding: 10px 16px; border-bottom: 1px solid #e5e7eb; font-weight: 500;">${s.name}</td>
          <td style="padding: 10px 16px; border-bottom: 1px solid #e5e7eb; color: #6b7280;">${s.frequency}</td>
          <td style="padding: 10px 16px; border-bottom: 1px solid #e5e7eb; font-weight: 600; color: #16a34a;">${s.amount}</td>
          <td style="padding: 10px 16px; border-bottom: 1px solid #e5e7eb; color: #6b7280;">${s.renewalDate}</td>
        </tr>`,
      )
      .join("");

    const totalMonthly = subscriptions
      .reduce((sum, s) => {
        const raw = parseFloat(s.amount.replace(/[^0-9.]/g, ""));
        return sum + (s.frequency === "Yearly" ? raw / 12 : raw);
      }, 0)
      .toFixed(2);

    const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    </head>
    <body style="margin: 0; padding: 0; background-color: #f3f4f6; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
      <div style="max-width: 600px; margin: 40px auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #2563eb, #7c3aed); padding: 32px 24px; text-align: center;">
          <h1 style="margin: 0; color: #ffffff; font-size: 22px; font-weight: 700;">🔔 Subscription Reminder</h1>
          <p style="margin: 8px 0 0; color: rgba(255,255,255,0.85); font-size: 14px;">
            You have <strong>${subscriptions.length}</strong> subscription${subscriptions.length !== 1 ? "s" : ""} with alerts enabled
          </p>
        </div>

        <!-- Body -->
        <div style="padding: 24px;">
          <p style="margin: 0 0 4px; font-size: 14px; color: #6b7280;">Reminder threshold</p>
          <p style="margin: 0 0 20px; font-size: 16px; font-weight: 600; color: #111827;">
            ${threshold} day${threshold !== "1" ? "s" : ""} before renewal
          </p>

          <!-- Table -->
          <table style="width: 100%; border-collapse: collapse; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden;">
            <thead>
              <tr style="background-color: #f9fafb;">
                <th style="padding: 10px 16px; text-align: left; font-size: 12px; font-weight: 600; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em;">Name</th>
                <th style="padding: 10px 16px; text-align: left; font-size: 12px; font-weight: 600; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em;">Frequency</th>
                <th style="padding: 10px 16px; text-align: left; font-size: 12px; font-weight: 600; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em;">Amount</th>
                <th style="padding: 10px 16px; text-align: left; font-size: 12px; font-weight: 600; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em;">Renewal</th>
              </tr>
            </thead>
            <tbody>
              ${subscriptionRows}
            </tbody>
          </table>

          <!-- Summary -->
          <div style="margin-top: 20px; padding: 16px; background: #f0fdf4; border-radius: 8px; border: 1px solid #bbf7d0;">
            <p style="margin: 0; font-size: 14px; color: #166534;">
              Estimated monthly total: <strong>$${totalMonthly}</strong>
            </p>
          </div>
        </div>

        <!-- Footer -->
        <div style="padding: 16px 24px; background-color: #f9fafb; border-top: 1px solid #e5e7eb; text-align: center;">
          <p style="margin: 0; font-size: 12px; color: #9ca3af;">
            This is a demo reminder from <strong>Sub Manager</strong>. Sent via Ethereal.
          </p>
        </div>
      </div>
    </body>
    </html>`;

    const info = await transporter.sendMail({
      from: `"Sub Manager" <${testAccount.user}>`,
      to: "user@example.com",
      subject: `🔔 Subscription Reminder — ${subscriptions.length} upcoming renewal${subscriptions.length !== 1 ? "s" : ""}`,
      html,
    });

    const previewUrl = nodemailer.getTestMessageUrl(info);

    return NextResponse.json({ success: true, previewUrl });
  } catch (error) {
    console.error("Email send error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to send demo email" },
      { status: 500 },
    );
  }
}
