"use client";
// TODO: Refactore this code
// TODO: make changes to room dimension (close to gridshot scene size)


const ROOM_W = 80;   // total width  (left ↔ right)
const ROOM_H = 25;   // total height (floor ↔ ceiling)
const ROOM_D = 60;   // total depth  (camera ↔ front wall)


const hw = ROOM_W / 2;
const hh = ROOM_H / 2;
const hd = ROOM_D / 2;

export default function Room() {

    return (
        <>
            <mesh
                position={[0, 0, -hd]}
                rotation={[0, 0, 0]}
            >
                <planeGeometry args={[ROOM_W, ROOM_H]} />
                <meshStandardMaterial color={"#b0b8c1"} />
            </mesh>
            <mesh
                position={[-hw, 0, 0]}
                rotation={[0, Math.PI / 2, 0]}
            >
                <planeGeometry args={[ROOM_D, ROOM_H]} />
                <meshStandardMaterial color={"#8c9ba8"} />
            </mesh>
            <mesh
                position={[hw, 0, 0]}
                rotation={[0, -Math.PI / 2, 0]}
            >
                <planeGeometry args={[ROOM_D, ROOM_H]} />
                <meshStandardMaterial color={"#8c9ba8"} />
            </mesh>
            <mesh
                position={[0, hh, 0]}
                rotation={[Math.PI / 2, 0, 0]}
            >
                <planeGeometry args={[ROOM_W, ROOM_D]} />
                <meshStandardMaterial color={"#b0b8c1"} />
            </mesh>
            <mesh
                position={[0, -hh, 0]}
                rotation={[-Math.PI / 2, 0, 0]}
            >
                <planeGeometry args={[ROOM_W, ROOM_D]} />
                <meshStandardMaterial color={"#b0b8c1"} />
            </mesh>
            <mesh
                position={[0, 0, hd]}
                rotation={[0, 0, 0]}
            >
                <planeGeometry args={[ROOM_W, ROOM_H]} />
                <meshStandardMaterial color={"#b0b8c1"} />
            </mesh>
        </>
    );
}