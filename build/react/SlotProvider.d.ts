import React from "react";
import { SlotEngine } from "../engine/types";
export declare function SlotProvider({ engine, children, }: {
    engine?: SlotEngine;
    children: React.ReactNode;
}): React.JSX.Element;
export declare function useSlotEngineContext(): SlotEngine;
