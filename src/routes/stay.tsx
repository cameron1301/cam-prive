import { createFileRoute } from "@tanstack/react-router";
import { StayScreen } from "@/components/yacht/hospitality";

export const Route = createFileRoute("/stay")({
  component: StayScreen,
});
