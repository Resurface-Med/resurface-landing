# Auth email templates

Branded Supabase Auth emails. Voice and visual grammar match the landing:
white card on the blue field, Poppins, plain English.

Day-to-day sign-in is **email + password**. These templates cover the two
places that need a code instead of a clickable link:

| Template | When | Subject |
| --- | --- | --- |
| Confirm sign up | New account | `Your Resurface code: {{ .Token }}` |
| Reset password | Forgot password | `Your Resurface reset code: {{ .Token }}` |
| Magic link | Unused by the app path; kept code-shaped | `Your Resurface code: {{ .Token }}` |

Do **not** put `{{ .ConfirmationURL }}` in confirmation or recovery —
Supabase treats that as a magic link, and mail apps that prefetch links
burn the session in the wrong browser.

`apply.mjs` also forces `mailer_otp_length: 6`.

## Edit / rebuild

```bash
node emails/auth/build.mjs
```

## Apply to production

```bash
export SUPABASE_ACCESS_TOKEN=…   # https://supabase.com/dashboard/account/tokens
export PROJECT_REF=uhqpljteohitvytwfadp
node emails/auth/apply.mjs
```
