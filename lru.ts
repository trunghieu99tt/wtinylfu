import { runInThisContext } from "vm";
import { Node } from "./node";

export class LRU<K extends string, V> {
    private head: Node<K, V>;
    private tail: Node<K, V>;
    private cache: Map<K, Node<K, V>>;
    private capacity: number;

    constructor(capacity: number) {
        this.capacity = capacity;
        this.cache = new Map();
        this.head = new Node<K, V>("" as K, null as unknown as V);
        this.tail = new Node<K, V>("" as K, null as unknown as V);
        this.head.next = this.tail;
        this.tail.prev = this.head;
    }

    private moveToHead(node: Node<K, V>) {
        this.delete(node);

        // Insert node after head
        node.next = this.head.next;
        node.prev = this.head;
        this.head.next.prev = node;
        this.head.next = node;
    }

    private removeTail(): Node<K, V> {
        const node = this.tail.prev;
        this.tail.prev = node.prev;
        node.prev.next = this.tail;
        return node;
    }

    has(key: K): boolean {
        return this.cache.has(key);
    }

    getNode(key: K): Node<K, V> | undefined {
        return this.cache.get(key);
    }

    get(key: K): V | undefined {
        const node = this.getNode(key);
        if (!node) return undefined;

        this.moveToHead(node);
        return node.value;
    }

    delete(node: Node<K, V>): void {
        node.prev.next = node.next;
        node.next.prev = node.prev;
    }

    put(key: K, value: V): Node<K, V> | null {
        if (this.cache.has(key)) {
            const node = this.cache.get(key)!;
            node.value = value;
            this.moveToHead(node);
            return null;
        }

        let removed: Node<K, V> | null = null;
        if (this.cache.size >= this.capacity) {
            removed = this.removeTail();
            this.cache.delete(removed.key);
        }

        const node = new Node<K, V>(key, value);
        this.cache.set(key, node);
        this.moveToHead(node);
        return removed;
    }

    peekLRU(): Node<K, V> | null {
        if (this.size() >= this.getCapacity()) {
            return this.tail.prev;
        }
        return null;
    }

    size(): number {
        return this.cache.size;
    }

    removeLRU(): Node<K, V> | null {
        if (this.cache.size === 0) return null;
        const node = this.removeTail();
        this.cache.delete(node.key);
        return node;
    }

    getCapacity(): number {
        return this.capacity;
    }

    getCache(): Map<K, Node<K, V>> {
        return this.cache;
    }
}
