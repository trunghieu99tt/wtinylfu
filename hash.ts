export class HashFunctions {
    /**
     * FNV-1a 32-bit hash function
     * Good for small strings and has good distribution
     */
    static fnv1a32(key: string): number {
        const FNV_PRIME = 16777619;
        const FNV_OFFSET_BASIS = 2166136261;

        let hash = FNV_OFFSET_BASIS;
        for (let i = 0; i < key.length; i++) {
            hash ^= key.charCodeAt(i);
            hash *= FNV_PRIME;
        }
        return hash >>> 0; // Convert to unsigned 32-bit integer
    }

    /**
     * MurmurHash3 32-bit hash function
     * Good for general purpose hashing with good distribution
     */
    static murmur3(key: string): number {
        const c1 = 0xcc9e2d51;
        const c2 = 0x1b873593;
        const r1 = 15;
        const r2 = 13;
        const m = 5;
        const n = 0xe6546b64;

        let h1 = 0;
        let k1 = 0;
        let i = 0;

        while (i < key.length) {
            k1 =
                key.charCodeAt(i++) |
                (key.charCodeAt(i++) << 8) |
                (key.charCodeAt(i++) << 16) |
                (key.charCodeAt(i++) << 24);

            k1 =
                ((k1 & 0xffff) * c1 + ((((k1 >>> 16) * c1) & 0xffff) << 16)) &
                0xffffffff;
            k1 = (k1 << r1) | (k1 >>> (32 - r1));
            k1 =
                ((k1 & 0xffff) * c2 + ((((k1 >>> 16) * c2) & 0xffff) << 16)) &
                0xffffffff;

            h1 ^= k1;
            h1 = (h1 << r2) | (h1 >>> (32 - r2));
            h1 =
                ((h1 & 0xffff) * m + ((((h1 >>> 16) * m) & 0xffff) << 16)) &
                0xffffffff;
            h1 = (h1 & 0xffff) + n + ((((h1 >>> 16) + n) & 0xffff) << 16);
        }

        h1 ^= key.length;
        h1 ^= h1 >>> 16;
        h1 =
            ((h1 & 0xffff) * 0x85ebca6b +
                ((((h1 >>> 16) * 0x85ebca6b) & 0xffff) << 16)) &
            0xffffffff;
        h1 ^= h1 >>> 13;
        h1 =
            ((h1 & 0xffff) * 0xc2b2ae35 +
                ((((h1 >>> 16) * 0xc2b2ae35) & 0xffff) << 16)) &
            0xffffffff;
        h1 ^= h1 >>> 16;

        return h1 >>> 0;
    }

    /**
     * djb2 hash function
     * Simple and fast hash function with good distribution
     */
    static djb2(key: string): number {
        let hash = 5381;
        for (let i = 0; i < key.length; i++) {
            hash = (hash << 5) + hash + key.charCodeAt(i);
        }
        return hash >>> 0;
    }

    /**
     * sdbm hash function
     * Good alternative to djb2 with similar properties
     */
    static sdbm(key: string): number {
        let hash = 0;
        for (let i = 0; i < key.length; i++) {
            hash = key.charCodeAt(i) + (hash << 6) + (hash << 16) - hash;
        }
        return hash >>> 0;
    }

    /**
     * Jenkins One-at-a-time hash function
     * Good for small strings and has good distribution
     */
    static jenkins(key: string): number {
        let hash = 0;
        for (let i = 0; i < key.length; i++) {
            hash += key.charCodeAt(i);
            hash += hash << 10;
            hash ^= hash >>> 6;
        }
        hash += hash << 3;
        hash ^= hash >>> 11;
        hash += hash << 15;
        return hash >>> 0;
    }

    /**
     * Simple hash function for quick hashing
     * Not recommended for cryptographic purposes
     */
    static simple(key: string): number {
        let hash = 0;
        for (let i = 0; i < key.length; i++) {
            hash = (hash << 5) - hash + key.charCodeAt(i);
            hash = hash & hash;
        }
        return Math.abs(hash);
    }
}
