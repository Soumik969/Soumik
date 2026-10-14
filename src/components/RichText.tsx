/** Render `_x` and `_{xy}` in content strings as subscripts (e.g. k_z → kz with z lowered). */
export function RichText({ text }: { text: string }) {
  return (
    <>
      {text
        .split(/(_\{[^}]*\}|_[A-Za-z0-9])/)
        .map((part, i) => (part.startsWith("_") && part.length > 1 ? <sub key={i}>{part.replace(/^_\{?|\}$/g, "")}</sub> : <span key={i}>{part}</span>))}
    </>
  );
}
