// Shared chrome for Resurface auth emails.
// Blue field, white floating card, Poppins, landing voice.
// Email clients strip most CSS — keep styles inline and layout tabular.

const LOGO = "https://tryresurface.com/logo-lockup.png";
const SITE = "https://tryresurface.com";
const APP = "https://app.tryresurface.com";

/**
 * @param {{ title: string, preheader: string, heading: string, bodyHtml: string, ctaLabel?: string, ctaHref?: string, noteHtml?: string, hideCta?: boolean }} opts
 */
export function shell({ title, preheader, heading, bodyHtml, ctaLabel = "", ctaHref = "", noteHtml = "", hideCta = false }) {
  const ctaRow = hideCta || !ctaLabel || !ctaHref ? "" : `<tr>
                  <td align="left" style="padding-bottom:8px;">
                    <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td align="center" bgcolor="#3562f5" style="border-radius:999px;background-color:#3562f5;">
                          <a href="${ctaHref}" style="display:inline-block;padding:13px 26px;font-family:Poppins,Arial,Helvetica,sans-serif;font-size:15px;font-weight:600;line-height:1;color:#ffffff;text-decoration:none;border-radius:999px;">
                            ${ctaLabel}
                          </a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="color-scheme" content="light">
  <meta name="supported-color-schemes" content="light">
  <title>${title}</title>
  <!--[if mso]>
  <style type="text/css">
    body, table, td { font-family: Arial, sans-serif !important; }
  </style>
  <![endif]-->
</head>
<body style="margin:0;padding:0;background-color:#3562f5;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;">
  <div style="display:none;max-height:0;overflow:hidden;mso-hide:all;font-size:1px;line-height:1px;color:#3562f5;opacity:0;">
    ${preheader}
  </div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#3562f5;width:100%;">
    <tr>
      <td align="center" style="padding:40px 16px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:520px;width:100%;">
          <tr>
            <td style="background-color:#ffffff;border-radius:28px;padding:36px 32px 32px;box-shadow:0 22px 48px rgba(15,27,61,0.18);">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td align="left" style="padding-bottom:28px;">
                    <a href="${SITE}" style="text-decoration:none;color:#3562f5;">
                      <img src="${LOGO}" width="168" height="39" alt="Resurface" style="display:block;width:168px;max-width:168px;height:auto;border:0;outline:none;">
                    </a>
                    <!-- Text fallback when the client blocks remote images -->
                    <div style="display:none;font-family:Poppins,Arial,Helvetica,sans-serif;font-size:18px;font-weight:700;letter-spacing:-0.4px;color:#3562f5;mso-hide:all;">
                      Resurface
                    </div>
                  </td>
                </tr>
                <tr>
                  <td style="font-family:Poppins,Arial,Helvetica,sans-serif;font-size:26px;font-weight:600;line-height:1.2;letter-spacing:-0.6px;color:#0f1b3d;padding-bottom:12px;">
                    ${heading}
                  </td>
                </tr>
                <tr>
                  <td style="font-family:Poppins,Arial,Helvetica,sans-serif;font-size:15px;font-weight:400;line-height:1.55;color:#5a6485;padding-bottom:${hideCta ? "8" : "28"}px;">
                    ${bodyHtml}
                  </td>
                </tr>
                ${ctaRow}
                ${noteHtml ? `<tr>
                  <td style="font-family:Poppins,Arial,Helvetica,sans-serif;font-size:13px;line-height:1.5;color:#8a93ae;padding-top:24px;">
                    ${noteHtml}
                  </td>
                </tr>` : ""}
              </table>
            </td>
          </tr>
          <tr>
            <td align="center" style="padding:22px 8px 0;font-family:Poppins,Arial,Helvetica,sans-serif;font-size:12px;line-height:1.5;color:rgba(255,255,255,0.72);">
              Built for UK medical students.<br>
              <a href="${APP}" style="color:#ffffff;text-decoration:underline;">app.tryresurface.com</a>
              &nbsp;·&nbsp;
              <a href="${SITE}" style="color:#ffffff;text-decoration:underline;">tryresurface.com</a>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}
