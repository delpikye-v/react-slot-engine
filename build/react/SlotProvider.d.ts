import React from "react";
import { SlotEngine } from "../engine/types";
export declare function SlotProvider({ engine, children, }: {
    engine?: SlotEngine;
    children: React.ReactNode;
}): JSX.Element;
export declare function useSlotEngineContext(): SlotEngine;
