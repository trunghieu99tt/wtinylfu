import { DoorKeeper } from "./door-keeper";

describe("DoorKeeper", () => {
    let doorKeeper: DoorKeeper;

    beforeEach(() => {
        doorKeeper = new DoorKeeper(100);
    });

    it("should report false for keys not added", () => {
        expect(doorKeeper.contains("test")).toBe(false);
    });

    it("should report true for keys that have been added", () => {
        doorKeeper.add("test");
        expect(doorKeeper.contains("test")).toBe(true);
    });

    it("should support adding multiple keys", () => {
        doorKeeper.add("key1");
        doorKeeper.add("key2");
        doorKeeper.add("key3");

        expect(doorKeeper.contains("key1")).toBe(true);
        expect(doorKeeper.contains("key2")).toBe(true);
        expect(doorKeeper.contains("key3")).toBe(true);
    });

    it("should clear all keys on reset", () => {
        doorKeeper.add("key1");
        doorKeeper.add("key2");

        doorKeeper.reset();

        expect(doorKeeper.contains("key1")).toBe(false);
        expect(doorKeeper.contains("key2")).toBe(false);
    });

    it("should handle empty strings", () => {
        doorKeeper.add("");
        expect(doorKeeper.contains("")).toBe(true);
    });

    it("should handle very long keys", () => {
        const longKey = "a".repeat(1000);
        doorKeeper.add(longKey);
        expect(doorKeeper.contains(longKey)).toBe(true);
    });

    // Testing Bloom filter properties - may have false positives but no false negatives
    it("should not have false negatives", () => {
        const keys = Array.from({ length: 50 }, (_, i) => `key${i}`);

        // Add all keys
        keys.forEach((key) => doorKeeper.add(key));

        // Check all keys are recognized
        keys.forEach((key) => {
            expect(doorKeeper.contains(key)).toBe(true);
        });
    });
});
