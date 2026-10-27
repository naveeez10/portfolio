type Props = {
  bitmap: readonly string[];
  /** Size of one pixel in CSS px. */
  scale?: number;
  className?: string;
  fill?: string;
  title?: string;
};

/** Crisp pixel-art icon. Outline uses currentColor so it follows text colour. */
export function PixelIcon({ bitmap, scale = 2, className = "", fill = "#fff", title }: Readonly<Props>) {
  const w = Math.max(...bitmap.map((r) => r.length));
  const h = bitmap.length;
  const rects: { x: number; y: number; c: string }[] = [];
  bitmap.forEach((row, y) => {
    [...row].forEach((ch, x) => {
      if (ch === "o") rects.push({ x, y, c: "currentColor" });
      else if (ch === "w") rects.push({ x, y, c: fill });
    });
  });
  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      width={w * scale}
      height={h * scale}
      shapeRendering="crispEdges"
      className={className}
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
    >
      {rects.map((r) => (
        <rect key={`${r.x}-${r.y}`} x={r.x} y={r.y} width={1.02} height={1.02} fill={r.c} />
      ))}
    </svg>
  );
}
