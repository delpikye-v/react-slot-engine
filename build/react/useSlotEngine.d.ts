export declare function useSlotEngine(): {
    engine: import("..").SlotEngine;
    register: <Props>(name: string, render: import("..").SlotRender<Props>, options?: import("..").RegisterOptions | undefined) => import("../engine/types").Dispose;
    get: (name: string) => import("..").SlotEntry<any>[];
};
