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
import ClickToPlayOverlay from '../../game-engine/components/ClickToPlayOverlay';

export default function GridshotClientR3F() {

    const phase = useGameStore((s) => s.phase);
    const reset = useGameStore((s) => s.reset);
    const gameCanvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        return () => reset();
    }, []);

    const handleClick = () => {
        gameCanvasRef.current?.requestPointerLock();
    }

    // Only show crosshair during gameplay
    const showCrosshair = phase === 'playing';

    return (
        <div className='h-[100vh] w-[100vw]' style={{ position: 'relative' }}>
            {showCrosshair && <Crosshair />}
            <GridshotHUD />
            <CountdownOverlay />
            <ClickToPlayOverlay onClick={handleClick} />
            <ResultsOverlay />
            <Canvas ref={gameCanvasRef}>
                <PerspectiveCamera
                    makeDefault
                    fov={75}
                    position={[0, -3, 15]}
                />
                <ambientLight intensity={1} />
                <directionalLight position={[0, 8, 0]} intensity={1.5} />
                <Room />
                <FPSCamera />
                <GameScene />
            </Canvas>
        </div>
    );
} 