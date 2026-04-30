"use client";

import { Canvas } from '@react-three/fiber'
import { PerspectiveCamera } from '@react-three/drei';
import Room from './Room';
import FPSCamera from '../../components/FPSCamera';

export default function GridshotClientR3F() {



    return (
        <div className='h-[100vh] w-[100vw]'>
            <Canvas onClick={e => e.currentTarget.requestPointerLock()}>
                <PerspectiveCamera
                    makeDefault
                    fov={90}
                    position={[0, 0, 20]}
                />
                <ambientLight intensity={1} />
                <directionalLight position={[0, 8, 0]} intensity={1.5} />
                <Room />
                <FPSCamera />
            </Canvas>
        </div>
    );
} 