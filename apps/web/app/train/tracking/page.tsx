import type { Metadata } from "next";
import { TrackingClient } from "./TrackingClient";

export const metadata: Metadata = {
  title: "Tracking — AimOS",
  description:
    "Tracking arena trainer. Follow a smoothly moving target for 30 seconds. Graded by time-on-target percentage.",
};

export default function TrackingPage() {
  return <TrackingClient />;
}
