/* Pixelify's "j" sits on the baseline like a small cap; redraw it on the font's own pixel grid
   (1u ≈ 0.0915em) with a dot and a two-pixel descender so it reads as a proper lowercase j. The hook tucks
   under the previous letter, so the box starts one pixel later than the font's glyph. */
export function LongJ({ word }: { word: string }) {
  const i = word.indexOf("j");
  if (i < 0) return <>{word}</>;
  return (
    <span className="whitespace-nowrap">
      {word.slice(0, i)}
      <span className="sr-only">j</span>
      <svg
        aria-hidden="true"
        viewBox="0 -7 4.4 9"
        width="0.403em"
        height="0.824em"
        fill="currentColor"
        shapeRendering="crispEdges"
        overflow="visible"
        className="inline-block align-[-0.183em]"
      >
        <rect x="2.65" y="-7" width="1.05" height="1" />
        <rect x="2.65" y="-5" width="1.05" height="6" />
        <rect x="0.65" y="1" width="2" height="1" />
        <rect x="-0.35" y="0" width="1" height="1" />
      </svg>
      {word.slice(i + 1)}
    </span>
  );
}
