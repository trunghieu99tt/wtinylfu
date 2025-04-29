import { WTinyLFU } from "./index";

describe("WTinyLFU", () => {
    let cache: WTinyLFU<string, number>;

    beforeEach(() => {
        cache = new WTinyLFU<string, number>(3, 2); // 3 main cache, 2 window cache
    });

    it("should store and retrieve values", () => {
        cache.put("key1", 1);
        cache.put("key2", 2);

        expect(cache.get("key1")).toBe(1);
        expect(cache.get("key2")).toBe(2);
    });

    it("should handle cache misses", () => {
        expect(cache.get("nonexistent")).toBeUndefined();
    });

    it("should update existing values", () => {
        cache.put("key1", 1);
        cache.put("key1", 2);

        expect(cache.get("key1")).toBe(2);
    });

    it("should respect capacity limits", () => {
        cache.put("key1", 1);
        cache.put("key2", 2);
        cache.put("key3", 3);
        cache.put("key4", 4);
        cache.put("key5", 5);

        expect(cache.size()).toBe(5); // 3 main + 2 window
    });

    it("should evict least frequently used items", () => {
        // Fill the cache
        cache.put("key1", 1);
        cache.put("key2", 2);
        cache.put("key3", 3);
        cache.put("key4", 4);
        cache.put("key5", 5);

        // Access some items multiple times
        cache.get("key1");
        cache.get("key1");
        cache.get("key2");
        cache.get("key2");
        cache.get("key2");

        // Add a new item that should evict the least frequently used
        cache.put("key6", 6);

        // key3, key4, or key5 should be evicted as they were accessed least
        expect(cache.get("key1")).toBe(1);
        expect(cache.get("key2")).toBe(2);
        expect(cache.get("key6")).toBe(6);
    });

    it("should clear the cache", () => {
        cache.put("key1", 1);
        cache.put("key2", 2);

        cache.clear();

        expect(cache.size()).toBe(0);
        expect(cache.get("key1")).toBeUndefined();
        expect(cache.get("key2")).toBeUndefined();
    });
});
