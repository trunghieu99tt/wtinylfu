import { HashFunctions } from "./hash";

describe("HashFunctions", () => {
    describe("fnv1a32", () => {
        it("should generate consistent hashes", () => {
            const hash1 = HashFunctions.fnv1a32("test");
            const hash2 = HashFunctions.fnv1a32("test");
            expect(hash1).toBe(hash2);
        });

        it("should generate different hashes for different inputs", () => {
            const hash1 = HashFunctions.fnv1a32("test1");
            const hash2 = HashFunctions.fnv1a32("test2");
            expect(hash1).not.toBe(hash2);
        });
    });

    describe("murmur3", () => {
        it("should generate consistent hashes", () => {
            const hash1 = HashFunctions.murmur3("test");
            const hash2 = HashFunctions.murmur3("test");
            expect(hash1).toBe(hash2);
        });

        it("should generate different hashes for different inputs", () => {
            const hash1 = HashFunctions.murmur3("test1");
            const hash2 = HashFunctions.murmur3("test2");
            expect(hash1).not.toBe(hash2);
        });
    });

    describe("djb2", () => {
        it("should generate consistent hashes", () => {
            const hash1 = HashFunctions.djb2("test");
            const hash2 = HashFunctions.djb2("test");
            expect(hash1).toBe(hash2);
        });

        it("should generate different hashes for different inputs", () => {
            const hash1 = HashFunctions.djb2("test1");
            const hash2 = HashFunctions.djb2("test2");
            expect(hash1).not.toBe(hash2);
        });
    });

    describe("sdbm", () => {
        it("should generate consistent hashes", () => {
            const hash1 = HashFunctions.sdbm("test");
            const hash2 = HashFunctions.sdbm("test");
            expect(hash1).toBe(hash2);
        });

        it("should generate different hashes for different inputs", () => {
            const hash1 = HashFunctions.sdbm("test1");
            const hash2 = HashFunctions.sdbm("test2");
            expect(hash1).not.toBe(hash2);
        });
    });

    describe("jenkins", () => {
        it("should generate consistent hashes", () => {
            const hash1 = HashFunctions.jenkins("test");
            const hash2 = HashFunctions.jenkins("test");
            expect(hash1).toBe(hash2);
        });

        it("should generate different hashes for different inputs", () => {
            const hash1 = HashFunctions.jenkins("test1");
            const hash2 = HashFunctions.jenkins("test2");
            expect(hash1).not.toBe(hash2);
        });
    });

    describe("simple", () => {
        it("should generate consistent hashes", () => {
            const hash1 = HashFunctions.simple("test");
            const hash2 = HashFunctions.simple("test");
            expect(hash1).toBe(hash2);
        });

        it("should generate different hashes for different inputs", () => {
            const hash1 = HashFunctions.simple("test1");
            const hash2 = HashFunctions.simple("test2");
            expect(hash1).not.toBe(hash2);
        });
    });

    describe("hash distribution", () => {
        it("should generate different hashes for similar inputs", () => {
            const hashes = new Set<number>();
            for (let i = 0; i < 1000; i++) {
                hashes.add(HashFunctions.murmur3(`test${i}`));
            }
            expect(hashes.size).toBeGreaterThan(900); // At least 90% unique hashes
        });
    });
});
