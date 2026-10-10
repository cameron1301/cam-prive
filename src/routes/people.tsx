import { createFileRoute } from "@tanstack/react-router";
import { PeopleScreen } from "@/components/yacht/owner";

export const Route = createFileRoute("/people")({
  component: PeopleScreen,
});
