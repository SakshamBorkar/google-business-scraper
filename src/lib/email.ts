import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL =
  process.env.FROM_EMAIL || "BizFinder <noreply@yourdomain.com>";

export async function sendOtpEmail(
  email: string,
  name: string,
  otp: string
): Promise<boolean> {
  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: "Your BizFinder verification code",
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          </head>
          <body style="margin:0;padding:0;background:#0a0a0f;font-family:'Inter',sans-serif;">
            <table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0f;min-height:100vh;">
              <tr>
                <td align="center" style="padding:48px 24px;">
                  <table width="480" cellpadding="0" cellspacing="0" style="background:#13131a;border:1px solid #1e1e2e;border-radius:16px;overflow:hidden;">
                    <tr>
                      <td style="padding:32px 40px 24px;border-bottom:1px solid #1e1e2e;">
                        <div style="display:flex;align-items:center;gap:10px;">
                          <span style="font-size:22px;font-weight:700;color:#e2e8f0;letter-spacing:-0.5px;">
                            Biz<span style="color:#f59e0b;">Finder</span>
                          </span>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding:40px;">
                        <p style="margin:0 0 8px;font-size:13px;color:#64748b;text-transform:uppercase;letter-spacing:1px;">Verification Code</p>
                        <h1 style="margin:0 0 24px;font-size:28px;font-weight:600;color:#f1f5f9;line-height:1.2;">
                          Hi ${name}, here's your code
                        </h1>
                        <div style="background:#0a0a0f;border:1px solid #1e1e2e;border-radius:12px;padding:28px;text-align:center;margin:0 0 28px;">
                          <span style="font-size:42px;font-weight:700;letter-spacing:10px;color:#f59e0b;font-family:monospace;">${otp}</span>
                        </div>
                        <p style="margin:0 0 16px;font-size:14px;color:#64748b;line-height:1.6;">
                          This code expires in <strong style="color:#94a3b8;">10 minutes</strong>. If you didn't request this, you can safely ignore this email.
                        </p>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding:20px 40px;border-top:1px solid #1e1e2e;">
                        <p style="margin:0;font-size:12px;color:#334155;">
                          © ${new Date().getFullYear()} BizFinder. Built to help you find businesses faster.
                        </p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </body>
        </html>
      `,
    });
    return true;
  } catch (error) {
    console.error("Failed to send OTP email:", error);
    return false;
  }
}

export async function sendCsvEmail(
  email: string,
  name: string,
  csvContent: string,
  filename: string
): Promise<boolean> {
  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: `Your exported business leads: ${filename.replace(".csv", "")}`,
      attachments: [
        {
          filename: filename,
          content: Buffer.from(csvContent),
        },
      ],
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          </head>
          <body style="margin:0;padding:0;background:#0a0a0f;font-family:'Inter',sans-serif;">
            <table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0f;min-height:100vh;">
              <tr>
                <td align="center" style="padding:48px 24px;">
                  <table width="480" cellpadding="0" cellspacing="0" style="background:#13131a;border:1px solid #1e1e2e;border-radius:16px;overflow:hidden;">
                    <tr>
                      <td style="padding:32px 40px 24px;border-bottom:1px solid #1e1e2e;">
                        <div style="display:flex;align-items:center;gap:10px;">
                          <span style="font-size:22px;font-weight:700;color:#e2e8f0;letter-spacing:-0.5px;">
                            Biz<span style="color:#f59e0b;">Finder</span>
                          </span>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding:40px;">
                        <p style="margin:0 0 8px;font-size:13px;color:#64748b;text-transform:uppercase;letter-spacing:1px;">Leads Export</p>
                        <h1 style="margin:0 0 24px;font-size:28px;font-weight:600;color:#f1f5f9;line-height:1.2;">
                          Your leads are ready!
                        </h1>
                        <p style="margin:0 0 16px;font-size:14px;color:#94a3b8;line-height:1.6;">
                          Hi ${name},
                        </p>
                        <p style="margin:0 0 24px;font-size:14px;color:#64748b;line-height:1.6;">
                          We have attached your requested business leads CSV file: <strong style="color:#f1f5f9;">${filename}</strong>.
                        </p>
                        <p style="margin:0;font-size:14px;color:#64748b;line-height:1.6;">
                          Thank you for using BizFinder!
                        </p>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding:20px 40px;border-top:1px solid #1e1e2e;">
                        <p style="margin:0;font-size:12px;color:#334155;">
                          © ${new Date().getFullYear()} BizFinder. Built to help you find businesses faster.
                        </p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </body>
        </html>
      `,
    });
    return true;
  } catch (error) {
    console.error("Failed to send CSV email:", error);
    return false;
  }
}

