import { createFileRoute } from "@tanstack/react-router";
import { GuideScreen } from "@/components/yacht/hospitality";

export const Route = createFileRoute("/guide")({
  component: GuideScreen,
});
