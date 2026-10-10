import { createFileRoute } from "@tanstack/react-router";
import { EscapePage } from "@/components/yacht/prive";

export const Route = createFileRoute("/escape")({
  component: EscapePage,
});
