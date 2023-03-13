import { useLayoutEffect } from "react";

export function useWheelZoom(func: (e: WheelEvent) => any) {
    useLayoutEffect(() => {
        const listener = (e: WheelEvent) => func(e);
        window.addEventListener('wheel', listener);
        return () => window.removeEventListener('wheel', listener);
    }, []);
};