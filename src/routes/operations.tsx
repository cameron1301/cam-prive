import { createFileRoute } from "@tanstack/react-router";
import { OperationsScreen } from "@/components/yacht/owner";

export const Route = createFileRoute("/operations")({
  component: OperationsScreen,
});
