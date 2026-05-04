"use client";

import { Canvas } from '@react-three/fiber'
import { PerspectiveCamera } from '@react-three/drei';
import Room from './Room';
import FPSCamera from '../../components/FPSCamera';
import { useEffect, useRef } from 'react';
import { Crosshair } from '../../game-engine/Crosshair';
import GameScene from '../../game-engine/components/GameScene';
import CountdownOverlay from '../../game-engine/components/CountdownOverlay';
import GridshotHUD from '../../game-engine/components/GridshotHUD';
import ResultsOverlay from '../../game-engine/components/ResultsOverlay';
import { useGameStore } from '../../store/gameStore';

export default function GridshotClientR3F() {

    const pointerLockRef = useRef<Element | null>(null);
    const phase = useGameStore((s) => s.phase);
    const startCountdown = useGameStore((s) => s.startCountdown);
    const reset = useGameStore((s) => s.reset);

    // Start the countdown on mount, cleanup on unmount
    useEffect(() => {
        startCountdown();
        return () => reset();
    }, []);

    const handleClick = (e: React.MouseEvent) => {
        pointerLockRef.current = e.currentTarget;
        //sending pointerLockRef to FPSController as e.currentRef
        // and doc.pointerLock element are different
        // so i'll directly check if this ref contain any lock element or not
        e.currentTarget.requestPointerLock();
    }

    // Only show crosshair during gameplay
    const showCrosshair = phase === 'playing';

    return (
        <div className='h-[100vh] w-[100vw]' style={{ position: 'relative' }}>
            {showCrosshair && <Crosshair />}
            <GridshotHUD />
            <CountdownOverlay />
            <ResultsOverlay />
            <Canvas onClick={handleClick}>
                <PerspectiveCamera
                    makeDefault
                    fov={75}
                    position={[0, -3, 15]}
                />
                <ambientLight intensity={1} />
                <directionalLight position={[0, 8, 0]} intensity={1.5} />
                <Room />
                <FPSCamera lockTarget={pointerLockRef} />
                <GameScene />
            </Canvas>
        </div>
    );
} 