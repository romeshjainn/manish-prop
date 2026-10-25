import { Building2, Handshake, House, KeyRound, Map, Tag, TrendingUp, type LucideProps } from "lucide-react";
import type { ServiceIcon as IconName } from "@/lib/types";

const icons = {
  key: KeyRound,
  home: House,
  building: Building2,
  map: Map,
  trending: TrendingUp,
  handshake: Handshake,
  tag: Tag,
} satisfies Record<IconName, unknown>;

export function ServiceIcon({ name, ...props }: { name: IconName } & LucideProps) {
  const Icon = icons[name];
  return <Icon aria-hidden strokeWidth={1.4} {...props} />;
}
