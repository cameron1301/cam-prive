import { createFileRoute } from "@tanstack/react-router";
import { ExploreScreen } from "@/components/yacht/hospitality";

export const Route = createFileRoute("/explore")({
  component: ExploreScreen,
});
