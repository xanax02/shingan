import { useFPSControls } from "../hooks/useFPSControlls";


//TODO: on fast movement camera is jittering, fix this

export default function FPSCamera({ lockTarget }: { lockTarget: React.RefObject<Element | null> }) {
    useFPSControls(lockTarget);
    return null;
}