import type { Metadata } from "next";
import { ReactionClient } from "./ReactionClient";

export const metadata: Metadata = {
  title: "Reaction Trainer — AimOS",
  description:
    "Train your reaction time. 10 rounds of precision timing. Track your best, worst, and average response with real-time metrics.",
};

/**
 * /train/reaction — Server Component shell.
 *
 * Attaches metadata and renders the client boundary.
 * No game logic lives here.
 */
export default function ReactionPage() {
  return <ReactionClient />;
}
