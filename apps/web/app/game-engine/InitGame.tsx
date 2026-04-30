"use client";

import { useEffect } from "react";
import { useTargetStore } from "../store/targetStore";

export default function InitGame() {
    const { initTargets } = useTargetStore();

    useEffect(() => {
        initTargets();
    }, [])

    return null
}