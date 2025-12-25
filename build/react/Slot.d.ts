import React from "react";
export type SlotProps<Props = any> = {
    name: string;
    fallback?: React.ReactNode;
    loadingFallback?: React.ReactNode;
    mode?: "first" | "all";
    props?: Props;
};
export declare function Slot<Props>({ name, fallback, loadingFallback, mode, props, }: SlotProps<Props>): React.JSX.Element;
