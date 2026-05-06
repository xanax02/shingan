import { useFrame, useThree } from "@react-three/fiber"
import { useEffect, useRef } from "react";
import * as THREE from 'three';

//TODO : remove os pointer acceleration
export const useFPSControls = () => {

    const { camera, gl } = useThree();

    const yaw = useRef(0);
    const pitch = useRef(0);

    useEffect(() => {

        const handleMouseMove = (e: MouseEvent) => {
            if (!document.pointerLockElement) return;

            if(document.pointerLockElement !== gl.domElement) return;


            yaw.current -= e.movementX * 0.002;
            pitch.current -= e.movementY * 0.002;

            pitch.current = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, pitch.current));
        }

        window.addEventListener("mousemove", handleMouseMove);
        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
        }

    }, [gl.domElement])


    const _euler = new THREE.Euler(0, 0, 0, "YXZ");

    useFrame(() => {
        _euler.set(pitch.current, yaw.current, 0);
        camera.quaternion.setFromEuler(_euler);
    })
}