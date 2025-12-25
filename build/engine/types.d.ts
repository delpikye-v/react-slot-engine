import React from "react";
export type SlotPlugin = {
    name: string;
    setup(engine: SlotEngine): void | Dispose;
};
export type SlotName = string;
export type SlotRender<Props = any> = React.ComponentType<Props> | ((props: Props) => React.ReactNode);
export type SlotEntry<Props = any> = {
    id: number;
    render: SlotRender<Props>;
    priority: number;
    async?: boolean;
};
export type RegisterOptions = {
    priority?: number;
    async?: boolean;
};
export type Dispose = () => void;
export type SlotEngine = {
    parent?: SlotEngine;
    register<Props>(name: SlotName, render: SlotRender<Props>, options?: RegisterOptions): Dispose;
    get(name: SlotName): SlotEntry[];
    subscribe(name: SlotName, cb: () => void): Dispose;
};
