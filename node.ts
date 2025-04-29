export class Node<K extends string, V> {
    next: Node<K, V>;
    prev: Node<K, V>;
    key: K;
    value?: V;

    constructor(key: K, value?: V) {
        this.key = key;
        this.value = value;
        this.next = this as any;
        this.prev = this as any;
    }
}
