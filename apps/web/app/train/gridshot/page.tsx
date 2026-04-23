import type { Metadata } from "next";
import { GridshotClient } from "./GridshotClient";

export const metadata: Metadata = {
  title: "Gridshot — AimOS",
  description:
    "3-ball gridshot trainer. Hit a target, it respawns instantly. 60 seconds. Graded by hits per second.",
};

export default function GridshotPage() {
  return <GridshotClient />;
}
