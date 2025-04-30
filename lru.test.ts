import { LRU } from "./lru";

describe("LRU", () => {
    let cache: LRU<string, number>;

    beforeEach(() => {
        cache = new LRU<string, number>(3);
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

        expect(cache.size()).toBe(3);
        expect(cache.get("key1")).toBeUndefined(); // key1 should be evicted
    });

    it("should evict least recently used items", () => {
        cache.put("key1", 1);
        cache.put("key2", 2);
        cache.put("key3", 3);

        // Access key1 to make it most recently used
        cache.get("key1");

        // Add a new item that should evict the least recently used (key2)
        cache.put("key4", 4);

        expect(cache.get("key1")).toBe(1); // key1 was accessed, should still be there
        expect(cache.get("key2")).toBeUndefined(); // key2 should be evicted
        expect(cache.get("key3")).toBe(3);
        expect(cache.get("key4")).toBe(4);
    });

    it("should return removed node when putting and evicting", () => {
        cache.put("key1", 1);
        cache.put("key2", 2);
        cache.put("key3", 3);

        // This should evict key1 and return its node
        const evicted = cache.put("key4", 4);

        expect(evicted).not.toBeNull();
        expect(evicted?.key).toBe("key1");
        expect(evicted?.value).toBe(1);
    });

    it("should return null when putting without evicting", () => {
        cache.put("key1", 1);
        cache.put("key2", 2);

        // This should not evict anything
        const result = cache.put("key3", 3);

        expect(result).toBeNull();
    });

    it("should return null when updating an existing key", () => {
        cache.put("key1", 1);

        // This should update key1, not evict anything
        const result = cache.put("key1", 10);

        expect(result).toBeNull();
        expect(cache.get("key1")).toBe(10);
    });

    it("should correctly identify LRU item", () => {
        cache.put("key1", 1);
        cache.put("key2", 2);
        cache.put("key3", 3);

        const lruNode = cache.peekLRU();

        expect(lruNode).not.toBeNull();
        expect(lruNode?.key).toBe("key1");
    });

    it("should correctly report size", () => {
        expect(cache.size()).toBe(0);

        cache.put("key1", 1);
        expect(cache.size()).toBe(1);

        cache.put("key2", 2);
        expect(cache.size()).toBe(2);

        cache.get("key1"); // Just accessing, shouldn't change size
        expect(cache.size()).toBe(2);
    });

    it("should correctly remove LRU item", () => {
        cache.put("key1", 1);
        cache.put("key2", 2);
        cache.put("key3", 3);

        const removed = cache.removeLRU();

        expect(removed).not.toBeNull();
        expect(removed?.key).toBe("key1");
        expect(cache.size()).toBe(2);
        expect(cache.get("key1")).toBeUndefined();
    });

    it("should return null when removing LRU from empty cache", () => {
        const removed = cache.removeLRU();
        expect(removed).toBeNull();
    });
});
