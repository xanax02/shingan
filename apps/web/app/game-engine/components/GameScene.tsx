// GameScene.tsx
"use client";

import { useEffect, useState, useRef } from "react";
import { useThree } from "@react-three/fiber";
import { TargetManager } from "../systems/TargetManager";
import { useShooting } from "../systems/RayCaster";
import { useGameStore } from "../../store/gameStore";

export default function GameScene() {

    const { scene, camera } = useThree();
    const phase = useGameStore((s) => s.phase);

    //using useState for manager because on intial render the manger will be null
    // when effect runs manger will get value and due to useState it will 
    // rerender and get the new value in useShooting 
    // with ref no rerender was there and useShotting will never get the new value
    const [manager, setManager] = useState<TargetManager | null>(null);

    // Keep a ref so cleanup can access the latest manager
    const managerRef = useRef<TargetManager | null>(null);

    // Create TargetManager once (scene/camera won't change)
    useEffect(() => {
        if (!scene || !camera) return;

        const mgr = new TargetManager(scene, camera);
        managerRef.current = mgr;
        setManager(mgr);

        return () => {
            mgr.destroyAll();
            managerRef.current = null;
            setManager(null);
        };
    }, [scene, camera]);

    // Spawn targets when playing starts, destroy when leaving playing
    useEffect(() => {
        const mgr = managerRef.current;
        if (!mgr) return;

        if (phase === "playing") {
            mgr.destroyAll();
            mgr.spawnInitial(3);
        }

        if (phase === "finished" || phase === "idle") {
            mgr.destroyAll();
        }
    }, [phase]);

    useShooting(manager);

    return null;
}