import { createFileRoute } from "@tanstack/react-router";
import { MaintenanceScreen } from "@/components/yacht/owner";

export const Route = createFileRoute("/maintenance")({
  component: MaintenanceScreen,
});
