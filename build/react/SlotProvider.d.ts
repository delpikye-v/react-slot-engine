import React from "react";
import { SlotEngine } from "../engine/types";
interface SlotProviderProps {
    engine?: SlotEngine;
    children: React.ReactNode;
}
export declare function SlotProvider({ engine, children, }: SlotProviderProps): import("react/jsx-runtime").JSX.Element;
export declare function useSlotEngineContext(): SlotEngine;
export {};
