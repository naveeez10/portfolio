import type { SVGProps } from "react";

export function HeroGraphic(props: Readonly<SVGProps<SVGSVGElement>>) {
  return (
    <svg
      viewBox="0 0 900 900"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      {...props}
    >
      {/* Monogram outline (N) */}
      <g id="outline" className="hero-draw-outline">
        <path
          d="M260 720V180h120l200 360V180h120v540H580L380 360v360H260z"
          stroke="currentColor"
          strokeWidth="18"
          strokeLinejoin="round"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
      </g>

      {/* Subtle circuit traces */}
      <g id="traces" className="hero-draw-traces">
        <path
          d="M320 610h90v-80h120"
          stroke="currentColor"
          strokeWidth="10"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
        <path
          d="M360 420v-70h110"
          stroke="currentColor"
          strokeWidth="10"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
        <path
          d="M520 560h90v-110"
          stroke="currentColor"
          strokeWidth="10"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
        <path
          d="M540 320h70"
          stroke="currentColor"
          strokeWidth="10"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
      </g>

      {/* Nodes */}
      <g id="pads" className="hero-pads">
        <circle cx="320" cy="610" r="10" fill="currentColor" style={{ ["--i" as never]: 0 }} />
        <circle cx="410" cy="530" r="10" fill="currentColor" style={{ ["--i" as never]: 1 }} />
        <circle cx="530" cy="530" r="10" fill="currentColor" style={{ ["--i" as never]: 2 }} />
        <circle cx="360" cy="350" r="10" fill="currentColor" style={{ ["--i" as never]: 3 }} />
        <circle cx="470" cy="350" r="10" fill="currentColor" style={{ ["--i" as never]: 4 }} />
        <circle cx="520" cy="560" r="10" fill="currentColor" style={{ ["--i" as never]: 5 }} />
        <circle cx="610" cy="450" r="10" fill="currentColor" style={{ ["--i" as never]: 6 }} />
        <circle cx="610" cy="320" r="10" fill="currentColor" style={{ ["--i" as never]: 7 }} />
      </g>
    </svg>
  );
}


