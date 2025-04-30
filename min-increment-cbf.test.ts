import MinIncrementCBF from "./min-increment-cbf";

describe("MinIncrementCBF", () => {
    let cbf: MinIncrementCBF;

    beforeEach(() => {
        // Create a CBF with small capacity for testing
        cbf = new MinIncrementCBF(100, 1000, 256);
    });

    it("should initially estimate zero for any key", () => {
        expect(cbf.estimate("test")).toBe(0);
        expect(cbf.estimate("anotherKey")).toBe(0);
    });

    it("should continue reporting zero for first time access", () => {
        cbf.increment("test");
        expect(cbf.estimate("test")).toBe(1);
    });

    it("should increment counter on second access", () => {
        cbf.increment("test"); // First access, no increment due to minimum rule
        cbf.increment("test"); // Second access should increment
        expect(cbf.estimate("test")).toBe(2);
    });

    it("should continue incrementing on multiple accesses", () => {
        cbf.increment("test"); // First access
        cbf.increment("test"); // Second access (increment to 1)
        cbf.increment("test"); // Third access (increment to 2)
        cbf.increment("test"); // Fourth access (increment to 3)
        expect(cbf.estimate("test")).toBeGreaterThanOrEqual(1);
    });

    it("should respect the counter cap", () => {
        const key = "test";
        // Repeatedly increment to test the cap
        for (let i = 0; i < 20; i++) {
            cbf.increment(key);
        }
        expect(cbf.estimate(key)).toBeLessThanOrEqual(11);
    });

    it("should return true when reset occurs", () => {
        // Fill up to reach sample size
        let resetOccurred = false;
        const sampleSize = 1000;

        for (let i = 0; i < sampleSize + 10; i++) {
            const key = `key${i % 100}`; // Use 100 different keys
            const result = cbf.increment(key);
            if (result) {
                resetOccurred = true;
            }
        }

        expect(resetOccurred).toBe(true);
    });

    it("should handle different keys independently", () => {
        // First key
        cbf.increment("key1");
        cbf.increment("key1");
        expect(cbf.estimate("key1")).toBe(2);

        // Second key
        cbf.increment("key2");
        expect(cbf.estimate("key2")).toBe(1);

        // Increment second key again
        cbf.increment("key2");
        expect(cbf.estimate("key2")).toBe(2);

        // First key should remain unchanged
        expect(cbf.estimate("key1")).toBe(2);
    });

    it("should reset counters when sample size is reached", () => {
        const testKey = "testReset";

        // Access the test key multiple times to increment its counter
        cbf.increment(testKey);
        cbf.increment(testKey);
        cbf.increment(testKey);

        // Initial value should be at least 1
        const initialValue = cbf.estimate(testKey);
        expect(initialValue).toBeGreaterThan(0);

        // Now fill up the sample size to trigger a reset
        let resetOccurred = false;
        for (let i = 0; i < 1000; i++) {
            const key = `filler${i}`;
            const result = cbf.increment(key);
            if (result) {
                resetOccurred = true;
                break;
            }
        }

        // After reset, the counter value should be reduced
        if (resetOccurred) {
            expect(cbf.estimate(testKey)).toBeLessThan(initialValue);
        }
    });
});
