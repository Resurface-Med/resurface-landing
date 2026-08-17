// Shared chrome for Resurface auth emails.
// Blue field, white floating card, Poppins, landing voice.
// Email clients strip most CSS — keep styles inline and layout tabular.
//
// Mobile + dark mode are the two places this usually falls apart:
// Gmail/iOS invert the blue field into lavender and the white card into
// charcoal, which also kills the blue lockup. We (1) ask for light-only,
// (2) paint every cell with bgcolor= so inversions have less to grab,
// (3) put the white lockup on the field above the card, and (4) tighten
// padding under 600px.

const LOGO = "https://app.tryresurface.com/logo-lockup-white.png";
const SITE = "https://tryresurface.com";
const APP = "https://app.tryresurface.com";
const BLUE = "#3562f5";
const WHITE = "#ffffff";
const INK = "#0f1b3d";
const INK_SOFT = "#5a6485";
const INK_FAINT = "#8a93ae";

/**
 * @param {{ title: string, preheader: string, heading: string, bodyHtml: string, ctaLabel?: string, ctaHref?: string, noteHtml?: string, hideCta?: boolean }} opts
 */
export function shell({ title, preheader, heading, bodyHtml, ctaLabel = "", ctaHref = "", noteHtml = "", hideCta = false }) {
  const ctaRow = hideCta || !ctaLabel || !ctaHref ? "" : `<tr>
                  <td align="left" style="padding-bottom:8px;">
                    <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td align="center" bgcolor="${BLUE}" style="border-radius:999px;background-color:${BLUE};">
                          <!--[if mso]>
                          <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" href="${ctaHref}" style="height:44px;v-text-anchor:middle;width:200px;" arcsize="50%" fillcolor="${BLUE}" stroke="f">
                          <center style="color:#ffffff;font-family:Arial,sans-serif;font-size:15px;font-weight:bold;">${ctaLabel}</center>
                          </v:roundrect>
                          <![endif]-->
                          <!--[if !mso]><!-- -->
                          <a href="${ctaHref}" style="display:inline-block;padding:13px 26px;font-family:Poppins,Arial,Helvetica,sans-serif;font-size:15px;font-weight:600;line-height:1;color:${WHITE};text-decoration:none;border-radius:999px;">
                            ${ctaLabel}
                          </a>
                          <!--<![endif]-->
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>`;

  return `<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="color-scheme" content="light only">
  <meta name="supported-color-schemes" content="light only">
  <meta name="x-apple-disable-message-reformatting">
  <title>${title}</title>
  <style type="text/css">
    :root { color-scheme: light only; supported-color-schemes: light only; }
    body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-collapse: collapse; }
    img { -ms-interpolation-mode: bicubic; border: 0; outline: none; text-decoration: none; display: block; }
    /* Ask clients that honour this to keep our colours. */
    @media (prefers-color-scheme: dark) {
      .rs-body, .rs-body-table { background-color: ${BLUE} !important; }
      .rs-card, .rs-card-inner { background-color: ${WHITE} !important; }
      .rs-ink { color: ${INK} !important; }
      .rs-soft { color: ${INK_SOFT} !important; }
      .rs-faint { color: ${INK_FAINT} !important; }
      .rs-code-wrap { background-color: #f3f6fe !important; }
      .rs-code { color: ${INK} !important; }
      .rs-foot, .rs-foot a { color: #ffffff !important; }
    }
    @media only screen and (max-width: 620px) {
      .rs-outer { padding: 20px 12px !important; }
      .rs-card { padding: 26px 18px 22px !important; border-radius: 20px !important; }
      .rs-logo { width: 148px !important; height: auto !important; }
      .rs-h { font-size: 22px !important; letter-spacing: -0.4px !important; }
      .rs-code { font-size: 28px !important; letter-spacing: 0.18em !important; }
      .rs-code-wrap { padding: 16px 10px !important; }
      .rs-body-copy { font-size: 14px !important; }
      .rs-foot { font-size: 11px !important; padding-top: 16px !important; }
    }
  </style>
  <!--[if mso]>
  <style type="text/css">
    body, table, td { font-family: Arial, sans-serif !important; }
  </style>
  <![endif]-->
</head>
<body class="rs-body" bgcolor="${BLUE}" style="margin:0;padding:0;background-color:${BLUE};-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;">
  <div style="display:none;max-height:0;overflow:hidden;mso-hide:all;font-size:1px;line-height:1px;color:${BLUE};opacity:0;">
    ${preheader}
  </div>
  <table role="presentation" class="rs-body-table" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${BLUE}" style="background-color:${BLUE};width:100%;">
    <tr>
      <td align="center" class="rs-outer" style="padding:36px 14px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:480px;width:100%;">
          <!-- White lockup sits on the field, not inside the card — dark-mode
               inversions that charcoal the card then can't hide the wordmark. -->
          <tr>
            <td align="center" style="padding:0 0 18px;">
              <a href="${SITE}" style="text-decoration:none;">
                <img class="rs-logo" src="${LOGO}" width="168" height="44" alt="Resurface" style="display:block;width:168px;max-width:70%;height:auto;margin:0 auto;border:0;">
              </a>
            </td>
          </tr>
          <tr>
            <td class="rs-card" bgcolor="${WHITE}" style="background-color:${WHITE};border-radius:24px;padding:32px 28px 28px;">
              <!-- Nested table + bgcolor: Gmail dark mode often leaves these alone. -->
              <table role="presentation" class="rs-card-inner" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${WHITE}" style="background-color:${WHITE};">
                <tr>
                  <td class="rs-h rs-ink" style="font-family:Poppins,Arial,Helvetica,sans-serif;font-size:24px;font-weight:600;line-height:1.25;letter-spacing:-0.5px;color:${INK};padding-bottom:10px;">
                    ${heading}
                  </td>
                </tr>
                <tr>
                  <td class="rs-body-copy rs-soft" style="font-family:Poppins,Arial,Helvetica,sans-serif;font-size:15px;font-weight:400;line-height:1.55;color:${INK_SOFT};padding-bottom:${hideCta ? "6" : "24"}px;">
                    ${bodyHtml}
                  </td>
                </tr>
                ${ctaRow}
                ${noteHtml ? `<tr>
                  <td class="rs-faint" style="font-family:Poppins,Arial,Helvetica,sans-serif;font-size:13px;line-height:1.5;color:${INK_FAINT};padding-top:20px;">
                    ${noteHtml}
                  </td>
                </tr>` : ""}
              </table>
            </td>
          </tr>
          <tr>
            <td align="center" class="rs-foot" style="padding:18px 8px 0;font-family:Poppins,Arial,Helvetica,sans-serif;font-size:12px;line-height:1.5;color:#ffffff;">
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
