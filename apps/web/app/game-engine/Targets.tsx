import { Target, TargetState, useTargetStore } from "../store/targetStore";

export default function Targets() {

    const targets = useTargetStore((state: TargetState) => state.targets);

    return (
        <>
            {targets.map((target: Target) => (
                <mesh
                    key={target.id}
                    position={target.position}
                >
                    <sphereGeometry args={[1, 16, 16]} />
                    <meshBasicMaterial color="hotpink" />
                </mesh>
            ))}
        </>
    )
}