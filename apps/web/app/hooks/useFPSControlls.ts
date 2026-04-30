import { useFrame, useThree } from "@react-three/fiber"
import { useEffect, useRef } from "react";
import * as THREE from 'three';

export const useFPSControls = () => {

    const { camera, gl } = useThree();

    const yaw = useRef(0);
    const pitch = useRef(0);

    useEffect(() => {
        
        if(document.pointerLockElement !== gl.domElement) return;

        const handleMouseMove = (e: MouseEvent) => {
            yaw.current -= e.movementX * 0.002;
            pitch.current -= e.movementY * 0.002;

            pitch.current = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, pitch.current));
        }

        window.addEventListener("mousemove", handleMouseMove);
        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
        }

    }, [gl.domElement])

    useFrame(() => {
        camera.quaternion.setFromEuler(new THREE.Euler(pitch.current, yaw.current, 0, "YXZ"));
    })
}