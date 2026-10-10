import { createFileRoute } from "@tanstack/react-router";
import { ProfileScreen } from "@/components/yacht/hospitality";

export const Route = createFileRoute("/profile")({
  component: ProfileScreen,
});
