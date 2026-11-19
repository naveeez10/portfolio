import Image from "next/image";
import { LongJ } from "@/components/pixel/LongJ";
import { profile } from "@/content/profile";

export function Hero() {
  return (
    <section className="mx-auto w-full max-w-[960px] px-5 pt-28 sm:pt-36">
      {/* SVG filter that turns the black ink drawing into accent blue on a transparent ground. */}
      <svg width="0" height="0" className="absolute" aria-hidden="true">
        <filter id="ink-to-blue" x="0" y="0" width="100%" height="100%" colorInterpolationFilters="sRGB">
          <feColorMatrix type="matrix" values="0 0 0 0 0.176  0 0 0 0 0.408  0 0 0 0 1  -0.36 -0.36 -0.36 1 0" />
        </filter>
      </svg>

      {/* Name and intro on the left, Sisyphus on the right once there's room for both. */}
      <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-14">
        <div>
          <h1 className="pixel rise text-[clamp(56px,13vw,88px)] leading-[0.9] tracking-[-0.01em] text-[var(--strong)]">
            {profile.first} <LongJ word={profile.last} />
          </h1>

          <p className="rise d1 mt-6 max-w-[500px] text-[16.5px] leading-[1.5]">
            Hi, I&apos;m a <strong>software engineer</strong> and <strong>tech lead</strong> at{" "}
            <a href="https://www.adora-app.com" target="_blank" rel="noreferrer" className="link">Adora</a>, working across{" "}
            <strong>mobile</strong>, <strong>backend</strong> and <strong>AI</strong>. In my free time I&apos;m building{" "}
            <a href="https://oen-app.com" target="_blank" rel="noreferrer" className="link">Oen</a>.
          </p>
        </div>

        <figure className="rise d2 w-full max-w-[480px] lg:max-w-none">
          <Image
            src="/sisyphus.gif"
            alt="Line drawing of Sisyphus pushing a boulder up a hill"
            width={498}
            height={294}
            unoptimized
            priority
            className="h-auto w-full"
            style={{ filter: "url(#ink-to-blue)" }}
          />
          <figcaption className="mono mt-2 text-[12px] text-[var(--faint)]">built on repeats.</figcaption>
        </figure>
      </div>
    </section>
  );
}
