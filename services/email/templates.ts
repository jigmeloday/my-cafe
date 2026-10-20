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

const layout = (title: string, body: string) => `<!doctype html>
<html><body style="margin:0;background:#f6f6f6;font-family:Helvetica,Arial,sans-serif;color:#211a1c">
  <div style="max-width:480px;margin:0 auto;padding:32px 16px">
    <p style="font-size:20px;font-weight:700;color:#7f1d3a;margin:0 0 24px">${APP_NAME}</p>
    <div style="background:#ffffff;border-radius:16px;padding:28px">
      <h1 style="font-size:20px;margin:0 0 12px">${escapeHtml(title)}</h1>
      ${body}
    </div>
    <p style="font-size:12px;color:#756b6e;margin:16px 4px 0">You got this email because of activity on your ${APP_NAME} account. If that wasn't you, you can ignore it.</p>
  </div>
</body></html>`;

const button = (url: string, label: string) =>
  `<p style="margin:24px 0"><a href="${safeUrl(url)}" style="background:#7f1d3a;color:#ffffff;text-decoration:none;font-weight:600;padding:12px 20px;border-radius:10px;display:inline-block">${escapeHtml(label)}</a></p>`;

export function verificationEmail(input: { name: string; url: string; expiresInMinutes: number }): EmailContent {
  const { name, url, expiresInMinutes } = input;
  return {
    subject: `Verify your email for ${APP_NAME}`,
    text: `Hi ${name},\n\nConfirm your email address to finish setting up your ${APP_NAME} account:\n\n${url}\n\nThis link works for ${expiresInMinutes} minutes. If you didn't create an account, you can ignore this email.`,
    html: layout(
      "Confirm your email",
      `<p style="margin:0 0 8px">Hi ${escapeHtml(name)},</p>
       <p style="margin:0">Confirm your email address to finish setting up your account.</p>
       ${button(url, "Verify my email")}
       <p style="font-size:13px;color:#756b6e;margin:0">This link works for ${expiresInMinutes} minutes. Or copy this address into your browser:<br><span style="word-break:break-all">${escapeHtml(url)}</span></p>`
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
      `<p style="margin:0 0 8px">Hi ${escapeHtml(name)},</p>
       <p style="margin:0">Someone tried to create a ${APP_NAME} account with this email address, but you already have one.</p>
       ${button(loginUrl, "Log in")}
       <p style="font-size:13px;color:#756b6e;margin:0">Forgot your password? Use “Forgot password” on the login page.</p>`
    ),
  };
}

/** A message from the Contact page, sent to the team. Everything the sender wrote is escaped. */
export function contactNotificationEmail(input: { name: string; email: string; topic: string; message: string }): EmailContent {
  const { name, email, topic, message } = input;
  return {
    subject: `Contact: ${topic} — ${name}`.slice(0, 120),
    text: `From: ${name} <${email}>\nAbout: ${topic}\n\n${message}\n\nReply to this email to answer them.`,
    html: `<!doctype html><html><body style="font-family:Helvetica,Arial,sans-serif;color:#211a1c;max-width:560px;margin:0 auto;padding:24px">
  <p style="margin:0 0 4px"><strong>${escapeHtml(name)}</strong> &lt;${escapeHtml(email)}&gt;</p>
  <p style="margin:0 0 16px;color:#756b6e">About: ${escapeHtml(topic)}</p>
  <div style="white-space:pre-wrap;background:#f6f6f6;border-radius:12px;padding:16px">${escapeHtml(message)}</div>
  <p style="color:#756b6e;font-size:13px;margin-top:16px">Reply to this email to answer them.</p>
</body></html>`,
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
      `<p style="margin:0 0 8px">Hi ${escapeHtml(name)},</p>
       <p style="margin:0">Someone asked to reset the password for your account. To choose a new one, press the button.</p>
       ${button(url, "Choose a new password")}
       <p style="font-size:13px;color:#756b6e;margin:0">The link works for ${expiresInMinutes} minutes and can be used once. If you didn't ask for this, ignore this email and your password won't change.</p>`
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
      `<p style="margin:0 0 8px">Hi ${escapeHtml(name)},</p>
       <p style="margin:0">The password for your account was just changed, and you were signed out on all devices.</p>
       <p style="margin:16px 0 0">If this was you, there's nothing to do. If it wasn't, contact us right away.</p>
       ${button(contactUrl, "Contact us")}`
    ),
  };
}
