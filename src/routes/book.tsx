import { createFileRoute } from "@tanstack/react-router";
import { BookScreen } from "@/components/yacht/hospitality";

export const Route = createFileRoute("/book")({
  component: BookScreen,
});
