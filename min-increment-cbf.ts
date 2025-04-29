import { HashFunctions } from "./hash";
import { nextPowerOf2 } from "./util";
import { DoorKeeper } from "./door-keeper";

/**
 * MinIncrementCBF implements a Count-Min Sketch with a door keeper filter
 * for efficient frequency estimation of items in a stream.
 */
class MinIncrementCBF {
    private readonly cap: number;
    private readonly size: number;
    private readonly mask: number;
    private counters: number[];
    private readonly doorKeeper: DoorKeeper;
    private readonly hashFunctions = [
        HashFunctions.djb2,
        HashFunctions.sdbm,
        HashFunctions.jenkins,
        HashFunctions.simple,
    ];

    constructor(size: number, cap: number) {
        this.size = nextPowerOf2(size);
        this.mask = this.size - 1;
        this.cap = cap;
        this.counters = new Array(this.size).fill(0);
        this.doorKeeper = new DoorKeeper(this.size);
    }

    private getHashSlots(key: string): number[] {
        return this.hashFunctions.map((hash) => hash(key) & this.mask);
    }

    estimate(key: string): number {
        // Early return if key hasn't been seen before
        if (!this.doorKeeper.contains(key)) {
            return 0;
        }

        // Find minimum counter value across all hash slots
        const hashSlots = this.getHashSlots(key);
        return Math.min(...hashSlots.map((slot) => this.counters[slot]));
    }

    increment(key: string): boolean {
        // Track if this is a new item
        const isNewItem = !this.doorKeeper.contains(key);

        // Always add to door keeper
        this.doorKeeper.add(key);

        // Skip counter updates for first-time items
        if (isNewItem) {
            return false;
        }

        // Get current count and hash slots
        const minCount = this.estimate(key);
        const hashSlots = this.getHashSlots(key);

        // Increment only the counters that match the minimum value
        hashSlots.forEach((slot) => {
            if (this.counters[slot] === minCount) {
                this.counters[slot]++;
            }
        });

        // Check if we need to reset
        if (minCount + 1 >= this.cap) {
            this.reset();
            return true;
        }

        return false;
    }

    reset(): void {
        // Halve all counter values
        this.counters = this.counters.map((count) => Math.floor(count / 2));
    }
}

export default MinIncrementCBF;
