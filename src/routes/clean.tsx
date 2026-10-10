import { createFileRoute } from "@tanstack/react-router";
import { CleanScreen } from "@/components/yacht/owner";

export const Route = createFileRoute("/clean")({
  component: CleanScreen,
});
