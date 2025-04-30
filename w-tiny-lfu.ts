import MinIncrementCBF from "./min-increment-cbf";
import { LRU } from "./lru";
import { SegmentedLRU } from "./segmented-lru";
import { Node } from "./node";

export class WTinyLFU<K extends string, V> {
    private windowCache: LRU<K, V>;
    private mainCache: SegmentedLRU<K, V>;
    private frequencySketch: MinIncrementCBF;
    private readonly cacheCapacity: number;

    constructor(cacheCapacity: number, windowRatio: number = 0.1) {
        this.cacheCapacity = cacheCapacity;
        this.initCaches(cacheCapacity, windowRatio);
    }

    /**
     * Initialize or reinitialize the caches
     */
    private initCaches(cacheCapacity: number, windowRatio: number): void {
        // window -> windowRatio (default 10%)
        // main -> remaining (default 90%)
        const windowCapacity = Math.max(
            1,
            Math.floor(cacheCapacity * windowRatio)
        );
        const mainCapacity = cacheCapacity - windowCapacity;
        this.windowCache = new LRU<K, V>(windowCapacity);
        this.mainCache = new SegmentedLRU<K, V>(mainCapacity);
        this.frequencySketch = new MinIncrementCBF(cacheCapacity);
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
        const victim = this.mainCache.peekProbationaryLRU();
        // if there's no victim (probationary segment is not full), admit directly
        if (!victim) {
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
        const evictedFromWindow = this.windowCache.put(key, value);
        if (evictedFromWindow) {
            this.handleAdmission(evictedFromWindow);
        }
    }

    size(): number {
        return this.windowCache.size() + this.mainCache.size();
    }

    clear(): void {
        this.initCaches(
            this.cacheCapacity,
            this.windowCache.getCapacity() / this.cacheCapacity
        );
    }
}
