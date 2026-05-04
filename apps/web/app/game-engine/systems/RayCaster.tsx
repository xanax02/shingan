// import { useThree } from "@react-three/fiber";
// import { useEffect } from "react";
import * as THREE from 'three';
// import { useTargetStore } from "../store/targetStore";

// export default function RayCaster() {

//     const { camera, scene } = useThree();

//     const { spawnTarget, destroyTarget } = useTargetStore();


//     //TODO: spike => optimization with useFrame instead of useEffect
//     useEffect(() => {

//         const raycaster = new THREE.Raycaster();

//         const handleClick = (e: MouseEvent) => {
//             raycaster.setFromCamera(new THREE.Vector2(0, 0), camera);

//             const intersects = raycaster.intersectObjects(scene.children, true);

//             if (intersects.length === 0) return;

//             const hit = intersects[0]?.object;

//             if (hit && hit.userData?.type === "target") {
//                 destroyTarget(hit.userData.id);
//                 spawnTarget();
//             }
//         }

//         window.addEventListener("click", handleClick);

//         return () => {
//             window.removeEventListener("click", handleClick);
//         }

//     }, [camera, scene])

//     return null;
// }

// inside GameScene.tsx
import { useThree } from "@react-three/fiber";
import { Raycaster, Vector2 } from "three";
import { useEffect } from "react";
import { TargetManager } from "./TargetManager";

const raycaster = new Raycaster();
const pointer = new Vector2(0, 0); // center

export function useShooting(targetManager: TargetManager | null) {
    const { camera } = useThree();

    useEffect(() => {
        if (!targetManager) return;

        function handleClick() {
            raycaster.setFromCamera(pointer, camera);

            const intersects = raycaster.intersectObjects(
                Array.from(targetManager!.getTargets())
            );

            if (intersects.length > 0) {
                const hit = intersects[0]?.object;
                targetManager!.destroy(hit as THREE.Mesh);
            }
        }

        window.addEventListener("click", handleClick);
        return () => window.removeEventListener("click", handleClick);
    }, [camera, targetManager]);
}