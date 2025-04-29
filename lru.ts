import { Node } from "./node";

export class LRU<K extends string, V> {
    protected head: Node<K, V>;
    protected tail: Node<K, V>;
    protected cache: Map<K, Node<K, V>>;
    protected capacity: number;

    constructor(capacity: number) {
        this.capacity = capacity;
        this.cache = new Map();
        this.head = new Node<K, V>("" as K, null as unknown as V);
        this.tail = new Node<K, V>("" as K, null as unknown as V);
        this.head.next = this.tail;
        this.tail.prev = this.head;
    }

    protected moveToHead(node: Node<K, V>) {
        // Remove node from its current position
        node.prev.next = node.next;
        node.next.prev = node.prev;

        // Insert node after head
        node.next = this.head.next;
        node.prev = this.head;
        this.head.next.prev = node;
        this.head.next = node;
    }

    protected removeTail(): Node<K, V> {
        const node = this.tail.prev;
        this.tail.prev = node.prev;
        node.prev.next = this.tail;
        return node;
    }

    has(key: K): boolean {
        return this.cache.has(key);
    }

    get(key: K): V | undefined {
        const node = this.cache.get(key);
        if (!node) return undefined;

        this.moveToHead(node);
        return node.value;
    }

    put(key: K, value: V): Node<K, V> | null {
        let removed: Node<K, V> | null = null;
        if (this.cache.has(key)) {
            const node = this.cache.get(key)!;
            node.value = value;
            this.moveToHead(node);
            return removed;
        }

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
        return this.tail.prev;
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
}
