import { LRU } from "./lru";
import { Node } from "./node";

export class SegmentedLRU<K extends string, V> {
    private probationary: LRU<K, V>;
    private protected: LRU<K, V>;
    private probationaryCapacity: number;
    private protectedCapacity: number;
    private totalCapacity: number;

    constructor(capacity: number) {
        this.totalCapacity = capacity;
        const probationaryCapacity = Math.floor(capacity * 0.2);
        const protectedCapacity = capacity - probationaryCapacity;
        this.probationaryCapacity = probationaryCapacity;
        this.protectedCapacity = protectedCapacity;
        this.probationary = new LRU<K, V>(probationaryCapacity);
        this.protected = new LRU<K, V>(protectedCapacity);
    }

    has(key: K): boolean {
        return this.protected.has(key) || this.probationary.has(key);
    }

    /**
     * Moves an item from probationary to protected segment
     * @param key The key to move
     * @param value The value to set
     * @returns The evicted item from protected segment if any
     */
    private moveToProtected(key: K, value: V): Node<K, V> | null {
        let removed: Node<K, V> | null = null;

        // Check if protected segment is full
        if (this.protected.size() >= this.protectedCapacity) {
            // Remove least recently used item from protected
            removed = this.protected.removeLRU();
            if (removed && removed.key !== key) {
                // Move the removed item to probationary
                this.probationary.put(removed.key, removed.value);
            }
        }

        // Add to protected segment
        this.protected.put(key, value);
        return removed;
    }

    get(key: K): V | undefined {
        // Try protected segment first
        if (this.protected.has(key)) {
            return this.protected.get(key);
        }

        // Try probationary segment
        if (!this.probationary.has(key)) {
            return undefined;
        }

        const probationaryValue = this.probationary.get(key)!;

        // Move to protected segment
        this.moveToProtected(key, probationaryValue);
        return probationaryValue;
    }

    put(key: K, value: V): Node<K, V> | null {
        let removed: Node<K, V> | null = null;

        // If key exists in protected segment, update it
        if (this.protected.has(key)) {
            this.protected.put(key, value);
            return null;
        }

        // If key exists in probationary segment, move to protected
        if (this.probationary.has(key)) {
            this.moveToProtected(key, value);
            return null;
        }

        // New key, add to probationary segment
        // Check if probationary segment is full
        if (this.probationary.size() >= this.probationaryCapacity) {
            // Remove least recently used item from probationary
            removed = this.probationary.removeLRU();
        }

        this.probationary.put(key, value);
        return removed;
    }

    peekProbationLRU(): Node<K, V> | null {
        return this.probationary.peekLRU();
    }

    size(): number {
        return this.probationary.size() + this.protected.size();
    }

    getCapacity(): number {
        return this.totalCapacity;
    }
}
