import { HashFunctions } from "./hash";
import { nextPowerOf2 } from "./util";

class DoorKeeper {
    private mask: number;
    private bloomFilter: Uint8Array;
    private hashFunctions: ((key: string) => number)[] = [
        HashFunctions.djb2,
        HashFunctions.sdbm,
    ];

    constructor(capacity: number) {
        this.mask = nextPowerOf2(capacity) - 1;
        this.bloomFilter = new Uint8Array(this.mask + 1);
    }

    private getHashSlots(key: string): number[] {
        return this.hashFunctions.map((hash) => hash(key) & this.mask);
    }

    add(key: string): void {
        const hashSlots = this.getHashSlots(key);
        for (const slot of hashSlots) {
            this.bloomFilter[slot] = 1;
        }
    }

    contains(key: string): boolean {
        const hashSlots = this.getHashSlots(key);
        return hashSlots.every((slot) => this.bloomFilter[slot] === 1);
    }

    reset(): void {
        this.bloomFilter.fill(0);
    }
}

export { DoorKeeper };
