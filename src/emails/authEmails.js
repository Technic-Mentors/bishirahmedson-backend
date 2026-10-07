import { sendEmail } from '../config/mailer.js';

const BRAND = {
  name: 'Bashir Ahmed & Sons',
  gold: '#92722a',
  goldDark: '#7a5f22',
  ink: '#1c1917',
  muted: '#78716c',
  border: '#e7e5e4',
  bg: '#faf8f4',
  address: 'Gujranwala, Punjab, Pakistan',
  phone: '+92 3076441350',
};

function layout({ heading, bodyHtml, ctaText, ctaLink, footnote }) {
  return `
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width,initial-scale=1" />
      <title>${BRAND.name}</title>
    </head>
    <body style="margin:0;padding:0;background:${BRAND.bg};">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${BRAND.bg};padding:32px 16px;">
        <tr>
          <td align="center">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0"
              style="max-width:520px;background:#ffffff;border:1px solid ${BRAND.border};border-radius:12px;overflow:hidden;font-family:Arial,Helvetica,sans-serif;color:${BRAND.ink};">
              <!-- Header -->
              <tr>
                <td style="padding:24px 28px;border-bottom:1px solid ${BRAND.border};">
                  <div style="font-size:20px;font-weight:700;letter-spacing:0.3px;color:${BRAND.gold};">
                    ${BRAND.name}
                  </div>
                  <div style="font-size:12px;color:${BRAND.muted};margin-top:4px;">
                    Timeless elegance, crafted with care.
                  </div>
                </td>
              </tr>

              <!-- Body -->
              <tr>
                <td style="padding:28px;">
                  <h1 style="margin:0 0 12px;font-size:20px;line-height:1.35;color:${BRAND.ink};">
                    ${heading}
                  </h1>
                  <div style="font-size:14px;line-height:1.65;color:#3f3f46;">
                    ${bodyHtml}
                  </div>

                  ${
                    ctaText && ctaLink
                      ? `
                  <div style="margin:28px 0 8px;">
                    <a href="${ctaLink}"
                       style="display:inline-block;background:${BRAND.gold};color:#ffffff;text-decoration:none;
                              font-weight:600;font-size:14px;padding:12px 24px;border-radius:6px;">
                      ${ctaText}
                    </a>
                  </div>
                  <div style="font-size:12px;color:${BRAND.muted};word-break:break-all;margin-top:8px;">
                    Or copy this link into your browser:<br/>
                    <span style="color:${BRAND.goldDark};">${ctaLink}</span>
                  </div>
                  `
                      : ''
                  }

                  ${
                    footnote
                      ? `
                  <div style="margin-top:24px;padding-top:16px;border-top:1px solid ${BRAND.border};
                              font-size:12px;color:${BRAND.muted};line-height:1.6;">
                    ${footnote}
                  </div>
                  `
                      : ''
                  }
                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="padding:18px 28px;background:${BRAND.bg};border-top:1px solid ${BRAND.border};
                           font-size:11px;color:${BRAND.muted};line-height:1.6;text-align:center;">
                  ${BRAND.name} · ${BRAND.address} · ${BRAND.phone}<br/>
                  You're receiving this email because you have an account with us.
                </td>
              </tr>
            </table>

            <div style="font-size:11px;color:${BRAND.muted};margin-top:16px;">
              © ${new Date().getFullYear()} ${BRAND.name}. All rights reserved.
            </div>
          </td>
        </tr>
      </table>
    </body>
  </html>
  `;
}

export async function sendVerificationEmail(to, link) {
  await sendEmail({
    to,
    subject: `Verify your email — ${BRAND.name}`,
    html: layout({
      heading: 'Welcome to Bashir Ahmed & Sons',
      bodyHtml: `
        <p style="margin:0 0 12px;">Thank you for creating an account with us. To unlock your full account experience — order tracking, wishlist, and faster checkout — please confirm your email address.</p>
        <p style="margin:0;">This verification link is valid for <strong>24 hours</strong>.</p>
      `,
      ctaText: 'Verify My Email',
      ctaLink: link,
      footnote: `If you didn't create an account, you can safely ignore this email — no action will be taken.`,
    }),
  });
}

export async function sendPasswordResetEmail(to, link) {
  await sendEmail({
    to,
    subject: `Reset your password — ${BRAND.name}`,
    html: layout({
      heading: 'Reset your password',
      bodyHtml: `
        <p style="margin:0 0 12px;">We received a request to reset the password for your account. Click the button below to choose a new one.</p>
        <p style="margin:0;">For your security, this link expires in <strong>1 hour</strong> and can only be used once.</p>
      `,
      ctaText: 'Reset Password',
      ctaLink: link,
      footnote: `Didn't request a password reset? No worries — your password is still safe. You can ignore this email and nothing will change.`,
    }),
  });
}