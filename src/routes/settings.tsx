import { createFileRoute } from "@tanstack/react-router";
import { SettingsScreen } from "@/components/yacht/owner";

export const Route = createFileRoute("/settings")({
  component: SettingsScreen,
});
