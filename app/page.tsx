import { Link } from "@nextui-org/link";
import { Snippet } from "@nextui-org/snippet";
import { Code } from "@nextui-org/code";
import { button as buttonStyles } from "@nextui-org/theme";

import { siteConfig } from "@/config/site";
import { title, subtitle } from "@/components/primitives";
import { GithubIcon } from "@/components/icons";

import { Featured } from '@/components/featured';
import { FiltreHomeSearch } from '@/components/filtresearchhome';
import { AboutHome } from '@/components/abouthome';

export default function Home() {
  return (
    <section className="flex flex-col">
      <Featured />
      <FiltreHomeSearch />
      <AboutHome />
    </section>
  );
}
