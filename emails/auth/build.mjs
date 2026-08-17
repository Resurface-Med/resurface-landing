import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { shell } from "./_shell.js";

const dir = dirname(fileURLToPath(import.meta.url));

// CRITICAL: magic_link / confirmation must include {{ .Token }} and must NOT
// include {{ .ConfirmationURL }}. If ConfirmationURL is present, GoTrue sends
// a clickable magic link instead of an OTP — which is exactly the mail-app
// cross-browser bug we are trying to kill.
//
// Keep the code block close to the top of the HTML body so the Token variable
// is unmistakable to GoTrue's template scanner.

const codeBlock = `
  <div style="margin:8px 0 4px;padding:22px 16px;background:#f3f6fe;border-radius:18px;text-align:center;">
    <div style="font-family:Poppins,Arial,Helvetica,sans-serif;font-size:40px;font-weight:700;letter-spacing:0.28em;color:#0f1b3d;font-variant-numeric:tabular-nums;">
      {{ .Token }}
    </div>
  </div>
`.trim();

const templates = {
  confirmation: {
    subject: "Your Resurface code: {{ .Token }}",
    file: "confirmation.html",
    html: shell({
      title: "Your confirmation code",
      preheader: "{{ .Token }} is your Resurface confirmation code.",
      heading: "Your confirmation code",
      bodyHtml: `
        <p style="margin:0 0 16px;">Enter this code in Resurface to confirm your email. It expires shortly.</p>
        ${codeBlock}
      `.trim(),
      noteHtml: `Didn't create a Resurface account? You can ignore this email.`,
      hideCta: true,
    }),
  },

  magic_link: {
    subject: "Your Resurface code: {{ .Token }}",
    file: "magic_link.html",
    html: shell({
      title: "Your sign-in code",
      preheader: "{{ .Token }} is your Resurface sign-in code.",
      heading: "Your sign-in code",
      bodyHtml: `
        <p style="margin:0 0 16px;">Enter this code in Resurface to sign in. It expires shortly and only works once.</p>
        ${codeBlock}
      `.trim(),
      noteHtml: `If you didn't ask for this, you can ignore the email.`,
      hideCta: true,
    }),
  },

  recovery: {
    subject: "Use a sign-in code on Resurface",
    file: "recovery.html",
    html: shell({
      title: "Use a sign-in code instead",
      preheader: "Resurface no longer uses password reset links.",
      heading: "Use a sign-in code instead",
      bodyHtml: `
        <p style="margin:0 0 12px;">Resurface accounts no longer use passwords. Open the app, enter <strong style="color:#0f1b3d;font-weight:600;">{{ .Email }}</strong>, and we'll email you a 6-digit code.</p>
        <p style="margin:0;">If you didn't ask for this, you can ignore the email.</p>
      `.trim(),
      ctaLabel: "Open Resurface →",
      ctaHref: "https://app.tryresurface.com",
      noteHtml: "",
    }),
  },
};

const manifest = {};

for (const [key, t] of Object.entries(templates)) {
  writeFileSync(join(dir, t.file), t.html + "\n", "utf8");
  manifest[key] = { subject: t.subject, file: t.file };
  console.log(`wrote ${t.file}`);
}

writeFileSync(join(dir, "subjects.json"), JSON.stringify(manifest, null, 2) + "\n", "utf8");
console.log("wrote subjects.json");
