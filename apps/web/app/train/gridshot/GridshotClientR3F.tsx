"use client";

import { Canvas } from '@react-three/fiber'
import { PerspectiveCamera } from '@react-three/drei';
import Room from './Room';
import FPSCamera from '../../components/FPSCamera';
import { useRef } from 'react';
import InitGame from '../../game-engine/InitGame';
import Targets from '../../game-engine/Targets';

export default function GridshotClientR3F() {

    const pointerLockRef = useRef<Element | null>(null);


    const handleClick = (e: React.MouseEvent) => {
        pointerLockRef.current = e.currentTarget;
        //sending pointerLockRef to FPSController as e.currentRef
        // and doc.pointerLock element are different
        // so i'll directly check if this ref contain any lock element or not
        e.currentTarget.requestPointerLock();
    }


    return (
        <div className='h-[100vh] w-[100vw]'>
            <Canvas onClick={handleClick}>
                <PerspectiveCamera
                    makeDefault
                    fov={90}
                    position={[0, 0, 20]}
                />
                <ambientLight intensity={1} />
                <directionalLight position={[0, 8, 0]} intensity={1.5} />
                <Room />
                <FPSCamera lockTarget={pointerLockRef} />
                <InitGame />
                <Targets />
            </Canvas>
        </div>
    );
} 