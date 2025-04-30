import { HashFunctions } from "./hash";
import { nextPowerOf2 } from "./util";
import { DoorKeeper } from "./door-keeper";

const HASH_FUNCS = [
    HashFunctions.djb2,
    HashFunctions.sdbm,
    HashFunctions.jenkins,
    HashFunctions.simple,
] as const;

class MinIncrementCBF {
    private readonly cap: number;
    private readonly size: number;
    private readonly mask: number;
    private readonly doorKeeper: DoorKeeper;
    private counters: Uint8Array;
    private ticks = 0;

    constructor(
        readonly cacheCapacity: number,
        readonly sampleSize: number = cacheCapacity * 10,
        sketchSlots = 4096
    ) {
        this.cap = Math.ceil(this.sampleSize / this.cacheCapacity);
        this.size = nextPowerOf2(sketchSlots);
        this.mask = this.size - 1;

        this.counters = new Uint8Array(this.size);
        this.doorKeeper = new DoorKeeper(this.size >>> 2);
    }

    private hashSlots(key: string): number[] {
        return HASH_FUNCS.map((h) => (h(key) >>> 0) & this.mask);
    }

    private minAcross(slots: number[]): number {
        return Math.min(...slots.map((s) => this.counters[s]));
    }

    private reset(): void {
        this.counters = this.counters.map((c) => c >> 1);
        this.doorKeeper.reset();
        this.ticks >>= 1;
    }

    estimate(key: string): number {
        if (!this.doorKeeper.contains(key)) return 0;
        const slots = this.hashSlots(key);
        return this.minAcross(slots) + 1;
    }

    increment(key: string): boolean {
        this.ticks += 1;
        const firstTime = !this.doorKeeper.contains(key);
        this.doorKeeper.add(key);
        if (firstTime) return false;

        const slots = this.hashSlots(key);
        const minFreq = this.minAcross(slots);

        for (const s of slots)
            if (this.counters[s] === minFreq && this.counters[s] < this.cap)
                this.counters[s]++;

        if (this.ticks >= this.sampleSize) {
            this.reset();
            return true;
        }
        return false;
    }
}

export default MinIncrementCBF;
