import type { ReactNode } from "react";
import { Frame } from "@/components/yacht/frame";
import { YachtProvider } from "@/lib/yacht/store";

export function Shell({ children }: { children: ReactNode }) {
  return (
    <YachtProvider>
      <Frame>{children}</Frame>
    </YachtProvider>
  );
}
