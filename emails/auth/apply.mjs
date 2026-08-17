#!/usr/bin/env node
/**
 * Push built auth email templates to a hosted Supabase project.
 *
 * Requires:
 *   SUPABASE_ACCESS_TOKEN  personal access token from
 *                          https://supabase.com/dashboard/account/tokens
 *   PROJECT_REF            defaults to uhqpljteohitvytwfadp
 */
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const dir = dirname(fileURLToPath(import.meta.url));
const token = process.env.SUPABASE_ACCESS_TOKEN;
const ref = process.env.PROJECT_REF || "uhqpljteohitvytwfadp";

if (!token) {
  console.error("Set SUPABASE_ACCESS_TOKEN (dashboard → Account → Access Tokens).");
  process.exit(1);
}

const subjects = JSON.parse(readFileSync(join(dir, "subjects.json"), "utf8"));

const body = {
  mailer_otp_length: 6,
  mailer_subjects_confirmation: subjects.confirmation.subject,
  mailer_templates_confirmation_content: readFileSync(join(dir, subjects.confirmation.file), "utf8"),
  mailer_subjects_magic_link: subjects.magic_link.subject,
  mailer_templates_magic_link_content: readFileSync(join(dir, subjects.magic_link.file), "utf8"),
  mailer_subjects_recovery: subjects.recovery.subject,
  mailer_templates_recovery_content: readFileSync(join(dir, subjects.recovery.file), "utf8"),
};

const res = await fetch(`https://api.supabase.com/v1/projects/${ref}/config/auth`, {
  method: "PATCH",
  headers: {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify(body),
});

const text = await res.text();
if (!res.ok) {
  console.error(`PATCH failed (${res.status}): ${text}`);
  process.exit(1);
}

console.log(`Updated confirmation, magic_link, and recovery on ${ref}.`);
