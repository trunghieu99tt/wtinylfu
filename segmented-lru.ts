import { LRU } from "./lru";
import { Node } from "./node";

export class SegmentedLRU<K extends string, V> {
    private probationary: LRU<K, V>;
    private protected: LRU<K, V>;
    private totalCapacity: number;

    constructor(capacity: number) {
        this.totalCapacity = capacity;
        const probationaryCapacity = Math.max(1, Math.floor(capacity * 0.2));
        const protectedCapacity = capacity - probationaryCapacity;
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
        const removedFromProtected = this.protected.put(key, value);
        if (removedFromProtected) {
            return this.probationary.put(
                removedFromProtected.key,
                removedFromProtected.value
            );
        }
        return removedFromProtected;
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

    /**
     * Puts a key-value pair into the cache
     * @param key The key to put
     * @param value The value to put
     * @returns The evicted item from protected or probationary segment if any
     */
    put(key: K, value: V): Node<K, V> | null {
        // If key exists in protected segment, update it
        if (this.protected.has(key)) {
            this.protected.put(key, value);
            return null;
        }

        // If key exists in probationary segment, move to protected
        if (this.probationary.has(key)) {
            this.probationary.delete(this.probationary.getNode(key)!);
            return this.moveToProtected(key, value);
        }

        return this.probationary.put(key, value);
    }

    peekProbationaryLRU(): Node<K, V> | null {
        return this.probationary.peekLRU();
    }

    size(): number {
        return this.probationary.size() + this.protected.size();
    }

    getCapacity(): number {
        return this.totalCapacity;
    }
}
