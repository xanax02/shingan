import { useFrame, useThree } from "@react-three/fiber"
import { useEffect, useRef } from "react";
import * as THREE from 'three';

//TODO : remove os pointer acceleration

export const useFPSControls = (lockTarget: React.RefObject<Element | null>) => {

    const { camera, gl } = useThree();

    const yaw = useRef(0);
    const pitch = useRef(0);

    useEffect(() => {

        //for now if user clicks on escape or remove pointerLockElement
        // by any means this lockTarget should be null so that 
        // camera won't move after exitting the pointer lock
        const handlePointerLockChange = () => {
            if (document.pointerLockElement === null) {
                lockTarget.current = null;
            }
        }

        const handleMouseMove = (e: MouseEvent) => {
            if (!lockTarget?.current) return;


            yaw.current -= e.movementX * 0.002;
            pitch.current -= e.movementY * 0.002;

            pitch.current = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, pitch.current));
        }

        window.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("pointerlockchange", handlePointerLockChange)
        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("pointerlockchange", handlePointerLockChange)
        }

    }, [gl.domElement])

    useFrame(() => {
        camera.quaternion.setFromEuler(new THREE.Euler(pitch.current, yaw.current, 0, "YXZ"));
    })
}