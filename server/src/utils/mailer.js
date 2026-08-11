import nodemailer from 'nodemailer'

let transporter = null

function getTransporter() {
  if (!process.env.SMTP_HOST) return null
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: Number(process.env.SMTP_PORT || 587) === 465,
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    })
  }
  return transporter
}

/**
 * ارسال ایمیل — در نبود تنظیمات SMTP، فقط در لاگ ثبت می‌شود
 * تا سایتِ نمایشی بدون خرابی کار کند.
 */
export async function sendMail({ to, subject, text, html }) {
  const t = getTransporter()
  if (!t) {
    console.log(`[mailer:dry-run] to=${to} subject=${subject}`)
    return { dryRun: true }
  }
  await t.sendMail({
    from: process.env.MAIL_FROM || process.env.SMTP_USER,
    to,
    subject,
    text,
    html,
  })
  return { sent: true }
}
