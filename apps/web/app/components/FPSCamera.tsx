import { useFPSControls } from "../hooks/useFPSControlls";

export default function FPSCamera({ lockTarget }: { lockTarget: React.RefObject<Element | null> }) {
    useFPSControls(lockTarget);
    return null;
}