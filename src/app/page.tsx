import { Hero } from "@/components/home/Hero";
import { NowStrip } from "@/components/home/NowStrip";
import { WorkList } from "@/components/home/WorkList";

export default function Home() {
  return (
    <main>
      <Hero />
      <NowStrip />
      <WorkList />
    </main>
  );
}
