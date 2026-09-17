// -----------------------------------------------------------------------------
// ResumeDownloadButton.tsx — link/button for downloading the résumé PDF.
// Author: Bill Chen
//
// Lives at the top level of /components (not under /about) because this is a
// shared UI element — the About page uses it today, but any page (Home,
// Contact, Footer) can drop it in the same way.
//
// Concepts introduced here:
//   • Optional props with default values. Both `label` and `fileName` are
//     marked optional in the type and given defaults in the destructuring,
//     so `<ResumeDownloadButton />` alone works, and any caller can override
//     one field without repeating the others.
//   • Centralising a URL-building pattern. The `import.meta.env.BASE_URL`
//     prefix used to live inline in AboutHero. Moving it here means the
//     next caller does not have to remember the pattern — they just render
//     the component.
// -----------------------------------------------------------------------------

type ResumeDownloadButtonProps = {
  // The visible link text. Defaults to a reasonable label; override if a
  // specific page needs different wording (e.g. "Grab my résumé").
  label?: string;
  // File name relative to the /public folder. Defaults to "resume.pdf".
  // Exposed as a prop in case we ever host a dated copy (e.g. "resume-2026.pdf")
  // and want to link to it without editing this component.
  fileName?: string;
  // Extra classes appended to the base "btn" class — lets a caller apply
  // page-specific spacing/alignment without duplicating the component.
  className?: string;
};

export default function ResumeDownloadButton({
  label = 'Download Résumé (PDF)',
  fileName = 'resume.pdf',
  className
}: ResumeDownloadButtonProps) {
  // `import.meta.env.BASE_URL` already ends with a slash, so do not add
  // another one before the file name.
  const href = `${import.meta.env.BASE_URL}${fileName}`;

  // Compose the class string. A caller may pass `className="align-self-end"`
  // (for example) and we append it to the base "btn". Filtering out falsy
  // values keeps a stray trailing space out of the output when no extra
  // class is passed.
  const classes = ['btn', className].filter(Boolean).join(' ');

  return (
    // target="_blank" opens in a new tab; rel="noopener noreferrer" is a
    // security best-practice for external tabs; `download` hints to the
    // browser that this should be saved-as instead of previewed.
    <a
      className={classes}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      download
    >
      {label}
    </a>
  );
}
