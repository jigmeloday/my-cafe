export interface EmailContent {
  subject: string;
  text: string;
  html: string;
}

export const APP_NAME = "Nook";

/** Names and addresses come from people, so they are escaped before going into HTML. */
export const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

/** Only web addresses may become links, so a bad value can never turn into script. */
const safeUrl = (url: string) => (/^https?:\/\//i.test(url) ? escapeHtml(url) : "#");

const BRAND = { maroon: "#7f1d3a", maroonSoft: "#f5e8ec", gold: "#d9a441", ink: "#211a1c", muted: "#756b6e", page: "#f4efee" };
const FONT = "-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif";

/** Shared frame: brand header, white card, quiet footer. Tables and inline styles, because email apps ignore most CSS. */
const layout = (title: string, body: string, preheader = "") => `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="light"><title>${escapeHtml(title)}</title></head>
<body style="margin:0;padding:0;background:${BRAND.page};font-family:${FONT};color:${BRAND.ink}">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent">${escapeHtml(preheader)}</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${BRAND.page}"><tr><td align="center" style="padding:32px 16px">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px">
      <tr><td style="padding:0 4px 20px;font-size:22px;font-weight:800;letter-spacing:-0.3px;color:${BRAND.maroon}">${APP_NAME}<span style="color:${BRAND.gold}">.</span></td></tr>
      <tr><td style="background:#ffffff;border-radius:20px;border-top:4px solid ${BRAND.maroon};padding:36px 32px;font-size:16px;line-height:1.6">
        <h1 style="font-size:24px;line-height:1.3;margin:0 0 20px;color:${BRAND.ink}">${escapeHtml(title)}</h1>
        ${body}
      </td></tr>
      <tr><td style="padding:20px 8px 0;font-size:12px;line-height:1.6;color:${BRAND.muted};text-align:center">
        You got this email because of activity on your ${APP_NAME} account. If that wasn't you, you can safely ignore it.<br>&copy; ${new Date().getFullYear()} ${APP_NAME}
      </td></tr>
    </table>
  </td></tr></table>
</body></html>`;

const greeting = (name: string) => `<p style="margin:0 0 12px">Hi ${escapeHtml(name)},</p>`;

const note = (html: string) => `<p style="font-size:13px;line-height:1.6;color:${BRAND.muted};margin:0">${html}</p>`;

/** A button that stays a button in Outlook too: the link sits inside a coloured table cell. */
const button = (url: string, label: string) =>
  `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:28px 0"><tr><td style="background:${BRAND.maroon};border-radius:12px"><a href="${safeUrl(url)}" style="display:inline-block;padding:14px 28px;font-size:16px;font-weight:700;color:#ffffff;text-decoration:none;border-radius:12px">${escapeHtml(label)}</a></td></tr></table>`;

/** The raw link, for people whose email app hides buttons. */
const fallbackLink = (url: string) =>
  `<div style="margin-top:16px;padding:12px 14px;background:${BRAND.maroonSoft};border-radius:10px;font-size:12px;line-height:1.5;color:${BRAND.muted};word-break:break-all">Button not working? Copy this address into your browser:<br><a href="${safeUrl(url)}" style="color:${BRAND.maroon}">${escapeHtml(url)}</a></div>`;

export function verificationEmail(input: { name: string; url: string; expiresInMinutes: number }): EmailContent {
  const { name, url, expiresInMinutes } = input;
  return {
    subject: `Verify your email for ${APP_NAME}`,
    text: `Hi ${name},\n\nConfirm your email address to finish setting up your ${APP_NAME} account:\n\n${url}\n\nThis link works for ${expiresInMinutes} minutes. If you didn't create an account, you can ignore this email.`,
    html: layout(
      "Confirm your email",
      `${greeting(name)}
       <p style="margin:0">Confirm your email address to finish setting up your account.</p>
       ${button(url, "Verify my email")}
       ${note(`This link works for ${expiresInMinutes} minutes.`)}
       ${fallbackLink(url)}`,
      "Confirm your email to finish setting up your account."
    ),
  };
}

/** Sent when someone tries to sign up with an address that already has an account (instead of telling them on screen). */
export function accountExistsEmail(input: { name: string; loginUrl: string }): EmailContent {
  const { name, loginUrl } = input;
  return {
    subject: `You already have a ${APP_NAME} account`,
    text: `Hi ${name},\n\nSomeone tried to create a ${APP_NAME} account with this email address, but you already have one. You can log in here:\n\n${loginUrl}\n\nForgot your password? Use "Forgot password" on the login page. If this wasn't you, you can ignore this email.`,
    html: layout(
      "You already have an account",
      `${greeting(name)}
       <p style="margin:0">Someone tried to create a ${APP_NAME} account with this email address, but you already have one.</p>
       ${button(loginUrl, "Log in")}
       ${note("Forgot your password? Use “Forgot password” on the login page.")}`,
      "Someone tried to sign up with your email address."
    ),
  };
}

/** A message from the Contact page, sent to the team. Everything the sender wrote is escaped. */
export function contactNotificationEmail(input: { name: string; email: string; topic: string; message: string }): EmailContent {
  const { name, email, topic, message } = input;
  return {
    subject: `Contact: ${topic} — ${name}`.slice(0, 120),
    text: `From: ${name} <${email}>\nAbout: ${topic}\n\n${message}\n\nReply to this email to answer them.`,
    html: layout(
      `New message: ${topic}`,
      `<p style="margin:0 0 4px"><strong>${escapeHtml(name)}</strong> &lt;${escapeHtml(email)}&gt;</p>
       <p style="margin:0 0 16px;color:${BRAND.muted}">About: ${escapeHtml(topic)}</p>
       <div style="white-space:pre-wrap;background:${BRAND.maroonSoft};border-radius:12px;padding:16px">${escapeHtml(message)}</div>
       ${note("Reply to this email to answer them.")}`,
      `${name} wrote to you about ${topic}.`
    ),
  };
}

/** The link to choose a new password. Only sent to an address that has an account. */
export function passwordResetEmail(input: { name: string; url: string; expiresInMinutes: number }): EmailContent {
  const { name, url, expiresInMinutes } = input;
  return {
    subject: `Reset your ${APP_NAME} password`,
    text: `Hi ${name},\n\nSomeone asked to reset the password for your ${APP_NAME} account. To choose a new one, open this link:\n\n${url}\n\nThe link works for ${expiresInMinutes} minutes and can be used once. If you didn't ask for this, you can ignore this email: your password won't change.`,
    html: layout(
      "Reset your password",
      `${greeting(name)}
       <p style="margin:0">Someone asked to reset the password for your account. To choose a new one, press the button.</p>
       ${button(url, "Choose a new password")}
       ${note(`The link works for ${expiresInMinutes} minutes and can be used once. If you didn't ask for this, ignore this email and your password won't change.`)}
       ${fallbackLink(url)}`,
      "Use this link to choose a new password."
    ),
  };
}

/** Sent after a password was changed through the reset link, so the owner notices if it wasn't them. */
export function passwordChangedEmail(input: { name: string; contactUrl: string }): EmailContent {
  const { name, contactUrl } = input;
  return {
    subject: `Your ${APP_NAME} password was changed`,
    text: `Hi ${name},\n\nThe password for your ${APP_NAME} account was just changed, and you were signed out on all devices.\n\nIf this was you, there's nothing to do. If it wasn't, contact us right away:\n\n${contactUrl}`,
    html: layout(
      "Your password was changed",
      `${greeting(name)}
       <p style="margin:0">The password for your account was just changed, and you were signed out on all devices.</p>
       <p style="margin:16px 0 0">If this was you, there's nothing to do. If it wasn't, contact us right away.</p>
       ${button(contactUrl, "Contact us")}`,
      "Your password was just changed."
    ),
  };
}
