import {create} from 'zustand';
import * as THREE from 'three';

export type Target = {
    id: string;
    position: THREE.Vector3;
}

const MAX_TARGET = 3;

export type TargetState = {
    targets: Target[],
    maxTarget: number;
    spawnTarget: () => void; //creating single new target
    destroyTarget: (id: string) => void; //destorying when hit
    initTargets: () => void; // creating n initail targets when game loads
}

const GRID_W = 40;
const GRID_H = 16;
const GRID_D = 60;


function generateTargetPosition(): THREE.Vector3 {
    return new THREE.Vector3(
        (Math.random() - 0.5) * GRID_W,
        (Math.random() - 0.5) * GRID_H,
        (Math.random() - 0.5) * GRID_D
    )
}

export const useTargetStore = create<TargetState>((set, get) => ({
    targets: [],
    maxTarget: 3,
    
    spawnTarget: () => {
        const newTarget = {
            id: crypto.randomUUID(),
            position: generateTargetPosition(),
        }
        set((state: TargetState) => ({targets: [...state.targets, newTarget]}));
    },

    destroyTarget: (id: string) => {
        set((state: TargetState) => ({targets: state.targets.filter((target: Target) => target.id !== id)}));
    },

    initTargets: () => {
        const {maxTarget, spawnTarget} = get();
        for(let i = 0; i < maxTarget; i++) {
            spawnTarget();
        }
    }
}))
