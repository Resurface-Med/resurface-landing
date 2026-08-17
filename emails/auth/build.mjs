import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { shell } from "./_shell.js";

const dir = dirname(fileURLToPath(import.meta.url));

// OTP emails must include {{ .Token }} and must NOT include
// {{ .ConfirmationURL }}. Supabase treats ConfirmationURL as a magic link;
// including it is what made mail apps burn the session in the wrong browser.

const codeBlock = `
  <div style="margin:8px 0 4px;padding:18px 16px;background:#f3f6fe;border-radius:18px;text-align:center;">
    <div style="font-family:Poppins,Arial,Helvetica,sans-serif;font-size:36px;font-weight:700;letter-spacing:0.28em;color:#0f1b3d;font-variant-numeric:tabular-nums;">
      {{ .Token }}
    </div>
  </div>
`.trim();

const templates = {
  confirmation: {
    subject: "Your Resurface confirmation code",
    file: "confirmation.html",
    html: shell({
      title: "Confirm your email",
      preheader: "Your 6-digit confirmation code.",
      heading: "Confirm your email",
      bodyHtml: `
        <p style="margin:0 0 16px;">Enter this code in Resurface to confirm your email. It expires shortly.</p>
        ${codeBlock}
      `.trim(),
      // No link CTA — code-only. Dummy href kept off; use note instead.
      ctaLabel: "",
      ctaHref: "",
      noteHtml: `Didn't create a Resurface account? You can ignore this email.`,
      hideCta: true,
    }),
  },

  magic_link: {
    subject: "Your Resurface sign-in code",
    file: "magic_link.html",
    html: shell({
      title: "Your sign-in code",
      preheader: "Your 6-digit Resurface code.",
      heading: "Your sign-in code",
      bodyHtml: `
        <p style="margin:0 0 16px;">Enter this code in Resurface to sign in. It expires shortly and only works once.</p>
        ${codeBlock}
      `.trim(),
      ctaLabel: "",
      ctaHref: "",
      noteHtml: `If you didn't ask for this, you can ignore the email.`,
      hideCta: true,
    }),
  },

  recovery: {
    subject: "Reset is now a sign-in code",
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
