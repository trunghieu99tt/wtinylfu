import MinIncrementCBF from "./min-increment-cbf";
import { LRU } from "./lru";
import { SegmentedLRU } from "./segmented-lru";
import { Node } from "./node";

export class WTinyLFU<K extends string, V> {
    private windowCache: LRU<K, V>;
    private mainCache: SegmentedLRU<K, V>;
    private frequencySketch: MinIncrementCBF;

    private capacity: number;
    private sketchSize: number = 10; // Default multiplier for sketch size
    private maxCounterValue: number = 8; // Default max counter value

    constructor(capacity: number, windowRatio: number = 0.1) {
        this.capacity = capacity;
        this.initCaches(capacity, windowRatio);
    }

    /**
     * Initialize or reinitialize the caches
     */
    private initCaches(capacity: number, windowRatio: number): void {
        // window -> windowRatio (default 10%)
        // main -> remaining (default 90%)
        const windowCapacity = Math.floor(capacity * windowRatio);
        const mainCapacity = capacity - windowCapacity;
        this.windowCache = new LRU<K, V>(windowCapacity);
        this.mainCache = new SegmentedLRU<K, V>(mainCapacity);
        this.frequencySketch = new MinIncrementCBF(
            capacity * this.sketchSize,
            this.maxCounterValue
        );
    }

    /**
     * Record access frequency for a key
     */
    private recordAccess(key: K): void {
        this.frequencySketch.increment(key);
    }

    /**
     * Handle admission from window cache to main cache
     */
    private handleAdmission(candidate: Node<K, V>): void {
        const victim = this.mainCache.peekProbationLRU();
        if (!victim) {
            // If main cache's probation segment is not full, admit directly
            this.mainCache.put(candidate.key, candidate.value);
            return;
        }

        // Compare frequencies to determine admission
        const freqCandidate = this.frequencySketch.estimate(candidate.key);
        const freqVictim = this.frequencySketch.estimate(victim.key);

        if (freqCandidate > freqVictim) {
            // Candidate wins, admit to main cache
            this.mainCache.put(candidate.key, candidate.value);
        }
        // If victim frequency is higher or equal, we retain the victim
        // No action needed as victim already exists in the main cache
    }

    get(key: K): V | undefined {
        // Try window cache first
        if (this.windowCache.has(key)) {
            const value = this.windowCache.get(key)!;
            this.recordAccess(key);
            return value;
        }

        // Try main cache
        if (this.mainCache.has(key)) {
            const value = this.mainCache.get(key)!;
            this.recordAccess(key);
            return value;
        }

        return undefined;
    }

    put(key: K, value: V): void {
        this.recordAccess(key);
        const removedFromWindow = this.windowCache.put(key, value);

        if (removedFromWindow) {
            this.handleAdmission(removedFromWindow);
        }
    }

    size(): number {
        return this.windowCache.size() + this.mainCache.size();
    }

    clear(): void {
        this.initCaches(
            this.capacity,
            this.windowCache.getCapacity() / this.capacity
        );
    }
}
