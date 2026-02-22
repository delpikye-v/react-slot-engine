import React from "react";
export type SlotMode = "first" | "all";
export interface SlotProps<Props = any> {
    name: string;
    fallback?: React.ReactNode;
    loadingFallback?: React.ReactNode;
    mode?: SlotMode;
    props?: Props;
}
export declare function Slot<Props>({ name, fallback, loadingFallback, mode, props, }: SlotProps<Props>): import("react/jsx-runtime").JSX.Element;
