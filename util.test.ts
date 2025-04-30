import { nextPowerOf2 } from "./util";

describe("Utility Functions", () => {
    describe("nextPowerOf2", () => {
        it("should return the same number if already a power of 2", () => {
            expect(nextPowerOf2(1)).toBe(1);
            expect(nextPowerOf2(2)).toBe(2);
            expect(nextPowerOf2(4)).toBe(4);
            expect(nextPowerOf2(8)).toBe(8);
            expect(nextPowerOf2(16)).toBe(16);
            expect(nextPowerOf2(32)).toBe(32);
            expect(nextPowerOf2(64)).toBe(64);
            expect(nextPowerOf2(128)).toBe(128);
            expect(nextPowerOf2(256)).toBe(256);
            expect(nextPowerOf2(512)).toBe(512);
            expect(nextPowerOf2(1024)).toBe(1024);
        });

        it("should return the next power of 2 for non-powers of 2", () => {
            expect(nextPowerOf2(3)).toBe(4);
            expect(nextPowerOf2(5)).toBe(8);
            expect(nextPowerOf2(7)).toBe(8);
            expect(nextPowerOf2(9)).toBe(16);
            expect(nextPowerOf2(10)).toBe(16);
            expect(nextPowerOf2(15)).toBe(16);
            expect(nextPowerOf2(17)).toBe(32);
            expect(nextPowerOf2(31)).toBe(32);
            expect(nextPowerOf2(33)).toBe(64);
            expect(nextPowerOf2(63)).toBe(64);
            expect(nextPowerOf2(65)).toBe(128);
            expect(nextPowerOf2(127)).toBe(128);
            expect(nextPowerOf2(129)).toBe(256);
        });

        it("should handle large numbers correctly", () => {
            expect(nextPowerOf2(1000)).toBe(1024);
            expect(nextPowerOf2(1025)).toBe(2048);
            expect(nextPowerOf2(2047)).toBe(2048);
            expect(nextPowerOf2(2049)).toBe(4096);
            expect(nextPowerOf2(4095)).toBe(4096);
            expect(nextPowerOf2(4097)).toBe(8192);
            expect(nextPowerOf2(8191)).toBe(8192);
            expect(nextPowerOf2(8193)).toBe(16384);
            expect(nextPowerOf2(1000000)).toBe(1048576); // 2^20
        });
    });
});
