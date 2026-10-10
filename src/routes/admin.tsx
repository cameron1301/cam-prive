import { createFileRoute } from "@tanstack/react-router";
import { AdminBookings } from "@/components/yacht/owner";

export const Route = createFileRoute("/admin")({
  component: AdminBookings,
});
