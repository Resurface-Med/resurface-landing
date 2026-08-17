import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { shell } from "./_shell.js";

const dir = dirname(fileURLToPath(import.meta.url));

// Confirmation + recovery must include {{ .Token }} and must NOT include
// {{ .ConfirmationURL }}. Links get burned when a mail app opens them in the
// wrong browser; codes do not. Magic-link stays code-shaped too in case
// anything still triggers it, but the product path is password + these two.

const codeBlock = `
  <div class="rs-code-wrap" style="margin:10px 0 2px;padding:18px 12px;background-color:#f3f6fe;border-radius:16px;text-align:center;" bgcolor="#f3f6fe">
    <div class="rs-code" style="font-family:Poppins,Arial,Helvetica,sans-serif;font-size:34px;font-weight:700;letter-spacing:0.22em;color:#0f1b3d;font-variant-numeric:tabular-nums;line-height:1.2;">
      {{ .Token }}
    </div>
  </div>
`.trim();

const templates = {
  confirmation: {
    subject: "Your Resurface code: {{ .Token }}",
    file: "confirmation.html",
    html: shell({
      title: "Confirm your email",
      preheader: "{{ .Token }} is your Resurface confirmation code.",
      heading: "Confirm your email",
      bodyHtml: `
        <p style="margin:0 0 16px;">Enter this code in Resurface to confirm your account. It expires shortly.</p>
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
      preheader: "{{ .Token }} is your Resurface code.",
      heading: "Your sign-in code",
      bodyHtml: `
        <p style="margin:0 0 16px;">Enter this code in Resurface. It expires shortly and only works once.</p>
        ${codeBlock}
      `.trim(),
      noteHtml: `If you didn't ask for this, you can ignore the email.`,
      hideCta: true,
    }),
  },

  recovery: {
    subject: "Your Resurface reset code: {{ .Token }}",
    file: "recovery.html",
    html: shell({
      title: "Reset your password",
      preheader: "{{ .Token }} is your Resurface reset code.",
      heading: "Reset your password",
      bodyHtml: `
        <p style="margin:0 0 16px;">Enter this code in Resurface to choose a new password for <strong style="color:#0f1b3d;font-weight:600;">{{ .Email }}</strong>.</p>
        ${codeBlock}
      `.trim(),
      noteHtml: `Didn't ask for a reset? You can ignore this email. Your password stays the same.`,
      hideCta: true,
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
