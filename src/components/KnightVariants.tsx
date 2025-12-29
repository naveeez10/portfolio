import type { SVGProps } from "react";

type Variant = "A" | "B" | "C";

export function KnightVariant({
  variant,
  ...props
}: Readonly<{ variant: Variant } & SVGProps<SVGSVGElement>>) {
  switch (variant) {
    case "A":
      return <KnightA {...props} />;
    case "B":
      return <KnightB {...props} />;
    case "C":
      return <KnightC {...props} />;
  }
}

function SvgBase({
  children,
  ...props
}: Readonly<SVGProps<SVGSVGElement> & { children: React.ReactNode }>) {
  return (
    <svg
      viewBox="0 0 900 900"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      {...props}
    >
      {children}
    </svg>
  );
}

/**
 * Variant A — outline knight + PCB traces inside.
 */
function KnightA(props: Readonly<SVGProps<SVGSVGElement>>) {
  return (
    <SvgBase {...props}>
      <path
        d="M300 735h360v-64c0-44-20-76-58-96l-72-38c-17-9-26-23-26-42v-62c0-42 18-78 54-108l40-33c24-20 36-46 36-78 0-33-14-62-42-86l-14-12c-19-16-29-37-29-62V120h-74c-32 0-58 11-78 34-18 20-27 45-27 75v40l-80 55c-33 22-50 53-50 92 0 37 12 70 36 98l40 46c15 17 22 36 22 58V735z"
        stroke="currentColor"
        strokeWidth="10"
        strokeLinejoin="round"
      />

      {/* Circuit traces */}
      <path
        d="M360 660v-96h90v-72h110v-70"
        stroke="currentColor"
        strokeWidth="8"
        strokeLinecap="round"
      />
      <path
        d="M378 610h80v58"
        stroke="currentColor"
        strokeWidth="8"
        strokeLinecap="round"
      />
      <path
        d="M440 520v-84h-64"
        stroke="currentColor"
        strokeWidth="8"
        strokeLinecap="round"
      />
      <path
        d="M520 585h88v-54"
        stroke="currentColor"
        strokeWidth="8"
        strokeLinecap="round"
      />
      <path
        d="M510 352h96v-56"
        stroke="currentColor"
        strokeWidth="8"
        strokeLinecap="round"
      />
      <path
        d="M332 440h92v-62"
        stroke="currentColor"
        strokeWidth="8"
        strokeLinecap="round"
      />

      {/* Pads */}
      <circle cx="360" cy="564" r="10" fill="currentColor" />
      <circle cx="450" cy="564" r="10" fill="currentColor" />
      <circle cx="450" cy="492" r="10" fill="currentColor" />
      <circle cx="560" cy="422" r="10" fill="currentColor" />
      <circle cx="608" cy="296" r="10" fill="currentColor" />
      <circle cx="608" cy="531" r="10" fill="currentColor" />
      <circle cx="458" cy="668" r="10" fill="currentColor" />
    </SvgBase>
  );
}

/**
 * Variant B — knight formed mostly by connected traces (more brutal).
 */
function KnightB(props: Readonly<SVGProps<SVGSVGElement>>) {
  return (
    <SvgBase {...props}>
      <path
        d="M300 735h360"
        stroke="currentColor"
        strokeWidth="10"
        strokeLinecap="round"
      />
      <path
        d="M318 735v-96c0-48 18-86 54-112l66-48v-72c0-42 18-78 54-108l40-33c24-20 36-46 36-78 0-33-14-62-42-86l-14-12c-19-16-29-37-29-62V120"
        stroke="currentColor"
        strokeWidth="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M513 120h-74c-32 0-58 11-78 34-18 20-27 45-27 75v40l-80 55c-33 22-50 53-50 92 0 37 12 70 36 98l40 46c15 17 22 36 22 58V735"
        stroke="currentColor"
        strokeWidth="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* PCB nodes + connecting traces */}
      <path
        d="M260 354h120v-74h150v-64h110"
        stroke="currentColor"
        strokeWidth="8"
        strokeLinecap="round"
      />
      <path
        d="M290 500h140v-58h120v110h110"
        stroke="currentColor"
        strokeWidth="8"
        strokeLinecap="round"
      />
      <path
        d="M340 650h170v-70h120"
        stroke="currentColor"
        strokeWidth="8"
        strokeLinecap="round"
      />
      <circle cx="260" cy="354" r="11" fill="currentColor" />
      <circle cx="380" cy="280" r="11" fill="currentColor" />
      <circle cx="530" cy="216" r="11" fill="currentColor" />
      <circle cx="640" cy="216" r="11" fill="currentColor" />
      <circle cx="290" cy="500" r="11" fill="currentColor" />
      <circle cx="430" cy="442" r="11" fill="currentColor" />
      <circle cx="550" cy="552" r="11" fill="currentColor" />
      <circle cx="660" cy="552" r="11" fill="currentColor" />
      <circle cx="340" cy="650" r="11" fill="currentColor" />
      <circle cx="510" cy="580" r="11" fill="currentColor" />
      <circle cx="630" cy="580" r="11" fill="currentColor" />
    </SvgBase>
  );
}

/**
 * Variant C — outline knight + faint board grid behind + tiny coordinates.
 */
function KnightC(props: Readonly<SVGProps<SVGSVGElement>>) {
  return (
    <SvgBase {...props}>
      {/* Board grid */}
      <g opacity="0.18" stroke="currentColor" strokeWidth="3">
        {Array.from({ length: 9 }).map((_, i) => {
          const x = 220 + i * 60;
          const y = 240 + i * 60;
          return (
            <g key={i}>
              <path d={`M${x} 240V720`} />
              <path d={`M220 ${y}H700`} />
            </g>
          );
        })}
      </g>

      {/* Coordinates */}
      <g opacity="0.35" fill="currentColor">
        <text x="216" y="748" fontSize="20" fontFamily="var(--font-geist-mono)">
          a1
        </text>
        <text x="680" y="748" fontSize="20" fontFamily="var(--font-geist-mono)">
          h1
        </text>
        <text x="216" y="230" fontSize="20" fontFamily="var(--font-geist-mono)">
          a8
        </text>
        <text x="680" y="230" fontSize="20" fontFamily="var(--font-geist-mono)">
          h8
        </text>
      </g>

      {/* Knight */}
      <path
        d="M300 735h360v-64c0-44-20-76-58-96l-72-38c-17-9-26-23-26-42v-62c0-42 18-78 54-108l40-33c24-20 36-46 36-78 0-33-14-62-42-86l-14-12c-19-16-29-37-29-62V120h-74c-32 0-58 11-78 34-18 20-27 45-27 75v40l-80 55c-33 22-50 53-50 92 0 37 12 70 36 98l40 46c15 17 22 36 22 58V735z"
        stroke="currentColor"
        strokeWidth="10"
        strokeLinejoin="round"
      />

      {/* A couple of PCB traces */}
      <path
        d="M360 640v-92h98v-66h118"
        stroke="currentColor"
        strokeWidth="8"
        strokeLinecap="round"
      />
      <circle cx="360" cy="548" r="10" fill="currentColor" />
      <circle cx="458" cy="548" r="10" fill="currentColor" />
      <circle cx="576" cy="482" r="10" fill="currentColor" />
    </SvgBase>
  );
}


