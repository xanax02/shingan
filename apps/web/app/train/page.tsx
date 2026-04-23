import type { Metadata } from "next";
import { TrainClient } from "./TrainClient";

export const metadata: Metadata = {
  title: "Train — AimOS",
  description:
    "Enter the training arena. Build muscle memory, sharpen flick shots, and track reaction time in real time.",
};

/**
 * /train — Server Component shell.
 *
 * This page exists only to attach metadata and render the client component.
 * ALL game logic lives in TrainClient → @repo/game-engine. Never add
 * gameplay, state, or Phaser imports directly to this file.
 */
export default function TrainPage() {
  return <TrainClient />;
}
