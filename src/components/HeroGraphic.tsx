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
      {/* Abstract outline */}
      <g id="outline" className="hero-draw-outline">
        <path
          d="M260 520c0-120 70-220 200-220 90 0 160 44 200 120 28 54 74 80 120 80v120c-92 0-162-38-210-118-26-44-60-72-110-72-70 0-120 52-120 130 0 86 60 140 150 140 78 0 134-34 190-100l86 72c-78 94-172 148-286 148-154 0-270-92-270-300z"
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
          d="M308 610h120v-70h140"
          stroke="currentColor"
          strokeWidth="10"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
        <path
          d="M360 430v-90h170"
          stroke="currentColor"
          strokeWidth="10"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
        <path
          d="M520 580h120v-140"
          stroke="currentColor"
          strokeWidth="10"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
        <path
          d="M520 330h110"
          stroke="currentColor"
          strokeWidth="10"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
        <path
          d="M440 700h120"
          stroke="currentColor"
          strokeWidth="10"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
      </g>

      {/* Nodes */}
      <g id="pads" className="hero-pads">
        <circle
          cx="308"
          cy="610"
          r="10"
          fill="currentColor"
          style={{ ["--i" as never]: 0 }}
        />
        <circle
          cx="428"
          cy="540"
          r="10"
          fill="currentColor"
          style={{ ["--i" as never]: 1 }}
        />
        <circle
          cx="568"
          cy="540"
          r="10"
          fill="currentColor"
          style={{ ["--i" as never]: 2 }}
        />
        <circle
          cx="360"
          cy="340"
          r="10"
          fill="currentColor"
          style={{ ["--i" as never]: 3 }}
        />
        <circle
          cx="530"
          cy="340"
          r="10"
          fill="currentColor"
          style={{ ["--i" as never]: 4 }}
        />
        <circle
          cx="520"
          cy="580"
          r="10"
          fill="currentColor"
          style={{ ["--i" as never]: 5 }}
        />
        <circle
          cx="640"
          cy="440"
          r="10"
          fill="currentColor"
          style={{ ["--i" as never]: 6 }}
        />
        <circle
          cx="560"
          cy="700"
          r="10"
          fill="currentColor"
          style={{ ["--i" as never]: 7 }}
        />
      </g>
    </svg>
  );
}


