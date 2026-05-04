// GameScene.tsx
"use client";

import { useEffect, useState } from "react";
import { useThree } from "@react-three/fiber";
import { TargetManager } from "../systems/TargetManager";
import { useShooting } from "../systems/RayCaster";

export default function GameScene() {

    const { scene, camera } = useThree();

    //using useState for manager because on intial render the manger will be null
    // when effect runs manger will get value and due to useState it will 
    // rerender and get the new value in useShooting 
    // with ref no rerender was there and useShotting will never get the new value
    const [manager, setManager] = useState<TargetManager | null>(null);

    useEffect(() => {

        if (!scene || !camera) return;

        const mgr = new TargetManager(scene, camera);
        mgr.spawnInitial(3);

        setManager(mgr);

        return () => {
            mgr.destroyAll();
            setManager(null);
        }
    }, [scene, camera]);

    useShooting(manager);

    return null;
}