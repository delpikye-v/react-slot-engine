import { jsx, Fragment } from 'react/jsx-runtime';
import React, { useCallback, useSyncExternalStore, useMemo, Suspense } from 'react';

let _id = 0;
function uid() {
    return ++_id;
}
function createSlotEngine(parent) {
    const registry = new Map();
    const listeners = new Map();
    function notify(name) {
        var _a;
        (_a = listeners.get(name)) === null || _a === void 0 ? void 0 : _a.forEach(l => {
            try {
                l();
            }
            catch (err) {
                if (process.env.NODE_ENV !== "production") {
                    console.error("[SlotEngine] listener error", err);
                }
            }
        });
    }
    function sortEntries(list) {
        return list.sort((a, b) => b.priority - a.priority ||
            a.id - b.id // stable order
        );
    }
    return {
        parent,
        register(name, render, options) {
            var _a, _b;
            const entry = {
                id: uid(),
                render,
                priority: (_a = options === null || options === void 0 ? void 0 : options.priority) !== null && _a !== void 0 ? _a : 0,
                async: options === null || options === void 0 ? void 0 : options.async,
            };
            const current = (_b = registry.get(name)) !== null && _b !== void 0 ? _b : [];
            const next = sortEntries([...current, entry]);
            registry.set(name, next);
            notify(name);
            return () => {
                const list = registry.get(name);
                if (!list)
                    return;
                const updated = list.filter(e => e.id !== entry.id);
                if (updated.length > 0) {
                    registry.set(name, updated);
                }
                else {
                    registry.delete(name);
                }
                notify(name);
            };
        },
        get(name) {
            var _a, _b;
            const local = (_a = registry.get(name)) !== null && _a !== void 0 ? _a : [];
            const inherited = (_b = parent === null || parent === void 0 ? void 0 : parent.get(name)) !== null && _b !== void 0 ? _b : [];
            if (!local.length)
                return inherited;
            if (!inherited.length)
                return local;
            return sortEntries([...local, ...inherited]);
        },
        subscribe(name, cb) {
            var _a;
            const set = (_a = listeners.get(name)) !== null && _a !== void 0 ? _a : new Set();
            set.add(cb);
            listeners.set(name, set);
            const unsubParent = parent === null || parent === void 0 ? void 0 : parent.subscribe(name, cb);
            return () => {
                set.delete(cb);
                if (set.size === 0) {
                    listeners.delete(name);
                }
                unsubParent === null || unsubParent === void 0 ? void 0 : unsubParent();
            };
        },
    };
}

const SlotEngineContext = React.createContext(null);
function SlotProvider({ engine, children, }) {
    const parent = React.useContext(SlotEngineContext);
    const instance = React.useMemo(() => engine !== null && engine !== void 0 ? engine : createSlotEngine(parent !== null && parent !== void 0 ? parent : undefined), [engine, parent]);
    return (jsx(SlotEngineContext.Provider, { value: instance, children: children }));
}
function useSlotEngineContext() {
    const ctx = React.useContext(SlotEngineContext);
    if (!ctx) {
        throw new Error("SlotEngine missing. Wrap your app with <SlotProvider>.");
    }
    return ctx;
}

function Slot({ name, fallback = null, loadingFallback = null, mode = "first", props, }) {
    const engine = useSlotEngineContext();
    const subscribe = useCallback((cb) => engine.subscribe(name, cb), [engine, name]);
    const getSnapshot = useCallback(() => engine.get(name), [engine, name]);
    const entries = useSyncExternalStore(subscribe, getSnapshot, () => [] // SSR fallback
    );
    const rendered = useMemo(() => {
        if (!entries.length)
            return fallback;
        const renderEntry = (entry) => {
            const Render = entry.render;
            const node = jsx(Render, { ...props });
            return entry.async ? (jsx(Suspense, { fallback: loadingFallback, children: node }, entry.id)) : (jsx(React.Fragment, { children: node }, entry.id));
        };
        return mode === "all"
            ? entries.map(renderEntry)
            : renderEntry(entries[0]);
    }, [entries, mode, props, fallback, loadingFallback]);
    return jsx(Fragment, { children: rendered });
}

function useSlotEngine() {
    const engine = useSlotEngineContext();
    return useMemo(() => ({
        engine,
        register: engine.register,
        get: engine.get,
    }), [engine]);
}

function applySlotPlugins(engine, plugins = []) {
    const disposers = [];
    plugins.forEach(p => {
        try {
            const dispose = p.setup(engine);
            if (typeof dispose === "function") {
                disposers.push(dispose);
            }
        }
        catch (err) {
            if (process.env.NODE_ENV !== "production") {
                console.error(`[SlotPlugin:${p.name}] setup failed`, err);
            }
        }
    });
    return () => {
        disposers.forEach(d => {
            try {
                d();
            }
            catch (_a) { }
        });
    };
}

async function executeSlots(entries, props) {
    const results = [];
    for (const entry of entries) {
        if (entry.async) {
            const r = await entry.render(props);
            results.push(r);
        }
        else {
            results.push(entry.render(props));
        }
    }
    return results;
}

export { Slot, SlotProvider, applySlotPlugins, createSlotEngine, executeSlots, useSlotEngine, useSlotEngineContext };
