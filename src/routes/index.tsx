import { createFileRoute } from "@tanstack/react-router";
import { PriveHome } from "@/components/yacht/prive";
import { CleanScreen, OwnerHome } from "@/components/yacht/owner";
import { useYacht } from "@/lib/yacht/store";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  const { me } = useYacht();
  if (me.role === "owner" || me.role === "admin") return <OwnerHome />;
  if (me.role === "cleaner") return <CleanScreen />;
  return <PriveHome />;
}
