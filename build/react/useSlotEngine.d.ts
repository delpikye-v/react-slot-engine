export declare function useSlotEngine(): {
    engine: import("..").SlotEngine;
    register: <Props>(name: import("..").SlotName, render: import("..").SlotRender<Props>, options?: import("..").RegisterOptions) => import("..").Dispose;
    get: (name: import("..").SlotName) => import("..").SlotEntry[];
};
