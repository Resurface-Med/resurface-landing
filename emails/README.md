# Auth email templates

Branded Supabase Auth emails. Voice and visual grammar match the landing:
white card on the blue field, Poppins, plain English.

Auth is passwordless. Sign-in and confirm emails show a **6-digit
`{{ .Token }}`**. Do **not** put `{{ .ConfirmationURL }}` in those templates —
Supabase treats that as a magic link, and mail apps that prefetch links burn
the session in the wrong browser.

## Subjects

| Template | Subject |
| --- | --- |
| Confirm sign up | Your Resurface confirmation code |
| Magic link (OTP) | Your Resurface sign-in code |
| Reset password | Reset is now a sign-in code |

## Edit / rebuild

```bash
node emails/auth/build.mjs
```

`_shell.js` holds the shared chrome. `build.mjs` writes the three HTML
files and `subjects.json`.

## Apply to production

```bash
export SUPABASE_ACCESS_TOKEN=…   # https://supabase.com/dashboard/account/tokens
export PROJECT_REF=uhqpljteohitvytwfadp
node emails/auth/apply.mjs
```

Or paste into
[Email Templates](https://supabase.com/dashboard/project/uhqpljteohitvytwfadp/auth/templates).

## Resend

Delivery goes through Resend as `hello@tryresurface.com`. Click tracking
should stay off so any remaining links are not rewritten.
