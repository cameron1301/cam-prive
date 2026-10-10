import { createFileRoute } from "@tanstack/react-router";
import { Financials } from "@/components/yacht/owner";

export const Route = createFileRoute("/financials")({
  component: Financials,
});
