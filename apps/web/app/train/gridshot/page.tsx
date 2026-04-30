import type { Metadata } from "next";
import GridshotClientR3F from "./GridshotClientR3F";

export const metadata: Metadata = {
  title: "Gridshot — AimOS",
  description:
    "3-ball gridshot trainer. Hit a target, it respawns instantly. 60 seconds. Graded by hits per second.",
};

export default function GridshotPage() {
  return <GridshotClientR3F />;
}
