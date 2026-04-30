"use client";

import { useEffect, useRef, useState } from "react";
import { DoubleSide } from "three";

// ─── Room dimensions ──────────────────────────────────────────────────────────
const ROOM_W = 40;   // total width  (left ↔ right)
const ROOM_H = 16;   // total height (floor ↔ ceiling)
const ROOM_D = 60;   // total depth  (camera ↔ front wall)

// Half-extents
const hw = ROOM_W / 2;
const hh = ROOM_H / 2;
const hd = ROOM_D / 2;

// ─── Surface definitions ──────────────────────────────────────────────────────
// Each surface is a flat plane positioned & rotated so all 5 faces of the room
// are visible from the camera at z = +20 looking toward –z.
// Perspective projection naturally turns rectangles into trapezoids. 🎉
interface SurfaceDef {
    position: [number, number, number];
    rotation: [number, number, number]; // radians
    size: [number, number];             // [width, height] of the plane
    color: string;
}

const SURFACES: Record<string, SurfaceDef> = {
    "Front Wall": {
        position: [0, 0, -hd],         // far end of the tunnel
        rotation: [0, 0, 0],
        size: [ROOM_W, ROOM_H],
        color: "#b0b8c1",
    },
    "Back Wall": {
        position: [0, 0, hd],          // behind the camera
        rotation: [0, Math.PI, 0],
        size: [ROOM_W, ROOM_H],
        color: "#9aa3ab",
    },
    "Left Wall": {
        position: [-hw, 0, 0],
        rotation: [0, Math.PI / 2, 0],
        size: [ROOM_D, ROOM_H],
        color: "#8c9ba8",
    },
    "Right Wall": {
        position: [hw, 0, 0],
        rotation: [0, -Math.PI / 2, 0],
        size: [ROOM_D, ROOM_H],
        color: "#8c9ba8",
    },
    "Ceiling": {
        position: [0, hh, 0],
        rotation: [Math.PI / 2, 0, 0],
        size: [ROOM_W, ROOM_D],
        color: "#c8cfd6",
    },
    "Floor": {
        position: [0, -hh, 0],
        rotation: [-Math.PI / 2, 0, 0],
        size: [ROOM_W, ROOM_D],
        color: "#6b7a87",
    },
};

// ─── Runtime tweak state (mirrors SurfaceDef but flat for lil-gui) ────────────
interface SurfaceState {
    posX: number; posY: number; posZ: number;
    rotX: number; rotY: number; rotZ: number;   // stored in degrees for GUI
    width: number; height: number;
    color: string;
    visible: boolean;
}

function defToState(d: SurfaceDef): SurfaceState {
    const r2d = (r: number) => (r * 180) / Math.PI;
    return {
        posX: d.position[0], posY: d.position[1], posZ: d.position[2],
        rotX: r2d(d.rotation[0]), rotY: r2d(d.rotation[1]), rotZ: r2d(d.rotation[2]),
        width: d.size[0], height: d.size[1],
        color: d.color,
        visible: true,
    };
}

// ─── Single wall mesh ─────────────────────────────────────────────────────────
function Wall({ s }: { s: SurfaceState }) {
    const d2r = (deg: number) => (deg * Math.PI) / 180;
    if (!s.visible) return null;
    return (
        <mesh
            position={[s.posX, s.posY, s.posZ]}
            rotation={[d2r(s.rotX), d2r(s.rotY), d2r(s.rotZ)]}
        >
            <planeGeometry args={[s.width, s.height]} />
            <meshStandardMaterial color={s.color} side={DoubleSide} />
        </mesh>
    );
}

// ─── Room component ───────────────────────────────────────────────────────────
export default function Room() {
    const [surfaces, setSurfaces] = useState<Record<string, SurfaceState>>(() =>
        Object.fromEntries(
            Object.entries(SURFACES).map(([k, v]) => [k, defToState(v)])
        )
    );
    const surfRef = useRef<Record<string, SurfaceState>>(surfaces);
    surfRef.current = surfaces;

    useEffect(() => {
        let gui: import("lil-gui").GUI;

        (async () => {
            const { default: GUI } = await import("lil-gui");
            gui = new GUI({ title: "🏠 Room Surfaces", width: 280 });

            Object.keys(SURFACES).forEach((name) => {
                const folder = gui.addFolder(name);
                folder.close();

                const proxy = { ...surfRef.current[name] };
                const set = (key: keyof SurfaceState, v: unknown) => {
                    surfRef.current = {
                        ...surfRef.current,
                        [name]: { ...surfRef.current[name], [key]: v },
                    };
                    setSurfaces({ ...surfRef.current });
                };

                folder.add(proxy, "visible").name("Visible").onChange((v: boolean) => set("visible", v));
                folder.addColor(proxy, "color").name("Color").onChange((v: string) => set("color", v));

                const pos = folder.addFolder("Position");
                pos.add(proxy, "posX", -100, 100, 0.5).name("X").onChange((v: number) => set("posX", v));
                pos.add(proxy, "posY", -60, 60, 0.5).name("Y").onChange((v: number) => set("posY", v));
                pos.add(proxy, "posZ", -100, 100, 0.5).name("Z").onChange((v: number) => set("posZ", v));
                pos.close();

                const rot = folder.addFolder("Rotation (°)");
                rot.add(proxy, "rotX", -180, 180, 1).name("X").onChange((v: number) => set("rotX", v));
                rot.add(proxy, "rotY", -180, 180, 1).name("Y").onChange((v: number) => set("rotY", v));
                rot.add(proxy, "rotZ", -180, 180, 1).name("Z").onChange((v: number) => set("rotZ", v));
                rot.close();

                const sz = folder.addFolder("Size");
                sz.add(proxy, "width", 1, 200, 0.5).name("Width").onChange((v: number) => set("width", v));
                sz.add(proxy, "height", 1, 200, 0.5).name("Height").onChange((v: number) => set("height", v));
                sz.close();
            });
        })();

        return () => { gui?.destroy(); };
    }, []);

    return (
        <>
            {Object.entries(surfaces).map(([name, s]) => (
                <Wall key={name} s={s} />
            ))}
        </>
    );
}