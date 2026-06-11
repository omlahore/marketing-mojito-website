/** Email-safe signature HTML: tables + inline styles only. */

export type TemplateId = 'classic' | 'modern' | 'minimal' | 'bold';

export type FontSizeKey = 'small' | 'medium' | 'large';

export interface SignatureFormState {
  fullName: string;
  jobTitle: string;
  department: string;
  companyName: string;
  email: string;
  phone: string;
  mobilePhone: string;
  website: string;
  address: string;
  profilePhoto: string | null;
  companyLogo: string | null;
  linkedin: string;
  instagram: string;
  twitter: string;
  facebook: string;
  youtube: string;
  template: TemplateId;
  themeColor: string;
  textColor: string;
  linkColor: string;
  fontFamily: string;
  fontSize: FontSizeKey;
}

const FONT_PX: Record<FontSizeKey, number> = { small: 12, medium: 14, large: 16 };

function esc(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function hrefUrl(url: string): string {
  const t = url.trim();
  if (!t) return '#';
  if (/^https?:\/\//i.test(t)) return esc(t);
  if (t.includes('@') && !t.includes('/')) return esc(`mailto:${t}`);
  return esc(`https://${t.replace(/^\/+/, '')}`);
}

function svgIconDataUri(pathD: string, color: string): string {
  const fill = esc(color.startsWith('#') ? color : `#${color}`);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24"><path fill="${fill}" d="${pathD}"/></svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

function socialIconDataUri(network: string, color: string): string {
  const paths: Record<string, string> = {
    linkedin:
      'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z',
    instagram:
      'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069z',
    twitter:
      'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z',
    facebook:
      'M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z',
    youtube:
      'M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z',
  };
  return svgIconDataUri(paths[network] || paths.linkedin, color);
}

function socialRow(s: SignatureFormState): string {
  const items: { url: string; net: string }[] = [
    { url: s.linkedin, net: 'linkedin' },
    { url: s.instagram, net: 'instagram' },
    { url: s.twitter, net: 'twitter' },
    { url: s.facebook, net: 'facebook' },
    { url: s.youtube, net: 'youtube' },
  ].filter((x) => x.url.trim());

  if (!items.length) return '';

  const cells = items
    .map(
      (x) =>
        `<td style="padding:0 8px 0 0;vertical-align:middle;"><a href="${hrefUrl(
          x.url
        )}" style="text-decoration:none;" target="_blank" rel="noopener noreferrer"><img src="${socialIconDataUri(
          x.net,
          s.linkColor
        )}" width="22" height="22" alt="" style="display:block;border:0;" /></a></td>`
    )
    .join('');

  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin-top:10px;"><tr>${cells}</tr></table>`;
}

function detailsTable(s: SignatureFormState, fs: number, minimalBorders: boolean): string {
  const fc = esc(s.textColor);
  const lc = esc(s.linkColor);
  const ff = esc(s.fontFamily);
  const lh = `${Math.round(fs * 1.4)}px`;
  const pad = minimalBorders ? 'padding:6px 0;border-top:1px solid #eeeeee;' : 'padding:3px 0;';
  const rows: string[] = [];

  const line = (html: string) =>
    rows.push(
      `<tr><td style="font-family:${ff};font-size:${fs}px;line-height:${lh};color:${fc};${pad}">${html}</td></tr>`
    );

  if (s.jobTitle.trim()) line(esc(s.jobTitle));
  if (s.department.trim()) line(esc(s.department));
  if (s.companyName.trim()) line(esc(s.companyName));
  if (s.email.trim()) {
    line(
      `<a href="mailto:${esc(s.email)}" style="color:${lc};text-decoration:none;">${esc(s.email)}</a>`
    );
  }
  if (s.phone.trim()) line(esc(s.phone));
  if (s.mobilePhone.trim()) line(esc(s.mobilePhone));
  if (s.website.trim()) {
    line(
      `<a href="${hrefUrl(s.website)}" style="color:${lc};text-decoration:none;">${esc(s.website)}</a>`
    );
  }
  if (s.address.trim()) line(esc(s.address));

  return rows.length ? `<table role="presentation" cellpadding="0" cellspacing="0" border="0">${rows.join('')}</table>` : '';
}

export function buildSignatureHtml(s: SignatureFormState): string {
  const fs = FONT_PX[s.fontSize];
  const fsName = fs + 4;
  const tc = esc(s.themeColor);
  const fc = esc(s.textColor);
  const ff = esc(s.fontFamily);
  const name = s.fullName.trim() || 'Your Name';
  const social = socialRow(s);
  const details = detailsTable(s, fs, false);
  const detailsMinimal = detailsTable(s, fs, true);

  if (s.template === 'classic') {
    const photoTd = s.profilePhoto
      ? `<td style="padding:0 16px 0 0;vertical-align:top;width:120px;"><img src="${s.profilePhoto}" width="120" height="120" alt="" style="display:block;border-radius:6px;width:120px;height:120px;object-fit:cover;border:0;" /></td>`
      : '';

    const logoRow = s.companyLogo
      ? `<tr><td colspan="2" style="padding-bottom:10px;"><img src="${s.companyLogo}" height="40" alt="" style="display:block;max-height:40px;width:auto;border:0;" /></td></tr>`
      : '';

    return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="font-family:${ff};max-width:520px;"><tr>${photoTd}<td style="vertical-align:top;"><table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">${logoRow}<tr><td><p style="margin:0 0 8px 0;padding:0;font-family:${ff};font-size:${fsName}px;font-weight:700;color:${tc};line-height:1.2;">${esc(name)}</p>${details}${social}</td></tr></table></td></tr></table>`;
  }

  if (s.template === 'modern') {
    const logo = s.companyLogo
      ? `<tr><td align="center" style="padding-bottom:12px;"><img src="${s.companyLogo}" height="48" alt="" style="display:block;margin:0 auto;max-height:48px;width:auto;border:0;" /></td></tr>`
      : '';
    const photo = s.profilePhoto
      ? `<tr><td align="center" style="padding-bottom:10px;"><img src="${s.profilePhoto}" width="100" height="100" alt="" style="display:block;margin:0 auto;border-radius:50%;width:100px;height:100px;object-fit:cover;border:0;" /></td></tr>`
      : '';

    return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="font-family:${ff};max-width:480px;"><tr><td align="center">${logo}${photo}<p style="margin:0 0 8px 0;padding:0;font-family:${ff};font-size:${fsName + 2}px;font-weight:700;color:${tc};text-align:center;">${esc(name)}</p><table role="presentation" cellpadding="0" cellspacing="0" border="0" align="center"><tr><td align="center">${details}</td></tr><tr><td align="center">${social}</td></tr></table></td></tr></table>`;
  }

  if (s.template === 'minimal') {
    const borderTop = `border-top:2px solid ${tc};`;
    const borderBot = `border-bottom:2px solid ${tc};`;
    return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="font-family:${ff};max-width:480px;${borderTop}${borderBot}"><tr><td style="padding:14px 0;"><p style="margin:0 0 10px 0;padding:0;font-family:${ff};font-size:${fsName}px;font-weight:600;color:${fc};">${esc(name)}</p>${detailsMinimal}${social}</td></tr></table>`;
  }

  /* bold */
  const bar = `<tr><td style="background-color:${tc};height:6px;line-height:6px;font-size:0;">&nbsp;</td></tr>`;
  const nameBlock = `<p style="margin:0 0 8px 0;padding:0;font-family:${ff};font-size:${fsName + 4}px;font-weight:800;color:${tc};letter-spacing:-0.02em;line-height:1.1;">${esc(name)}</p>`;
  const body = `${nameBlock}${details}${social}`;
  const logoRow = s.companyLogo
    ? `<tr><td style="padding:12px 16px 0 16px;background-color:#fafafa;"><img src="${s.companyLogo}" height="36" alt="" style="display:block;max-height:36px;width:auto;border:0;" /></td></tr>`
    : '';

  if (s.profilePhoto) {
    return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="font-family:${ff};max-width:520px;">${bar}<tr><td style="padding:0;background-color:#fafafa;"><table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%"><tr><td style="width:108px;vertical-align:top;padding:14px 0 14px 16px;"><img src="${s.profilePhoto}" width="88" height="88" alt="" style="display:block;border-radius:4px;width:88px;height:88px;object-fit:cover;border:0;" /></td><td style="vertical-align:top;padding:14px 16px 14px 0;">${body}</td></tr></table></td></tr></table>`;
  }

  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="font-family:${ff};max-width:520px;">${bar}${logoRow}<tr><td style="padding:14px 16px;background-color:#fafafa;">${body}</td></tr></table>`;
}
