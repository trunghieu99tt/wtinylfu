import { Node } from "./node";

describe("Node", () => {
    it("should initialize with key and value", () => {
        const node = new Node<string, number>("testKey", 42);

        expect(node.key).toBe("testKey");
        expect(node.value).toBe(42);
    });

    it("should initialize with key and undefined value", () => {
        const node = new Node<string, number>("testKey");

        expect(node.key).toBe("testKey");
        expect(node.value).toBeUndefined();
    });

    it("should initialize with circular prev/next references", () => {
        const node = new Node<string, number>("testKey", 42);

        // Node should initially point to itself
        expect(node.prev).toBe(node);
        expect(node.next).toBe(node);
    });

    it("should allow linking nodes together", () => {
        const node1 = new Node<string, number>("key1", 1);
        const node2 = new Node<string, number>("key2", 2);
        const node3 = new Node<string, number>("key3", 3);

        // Link nodes: node1 <-> node2 <-> node3
        node1.next = node2;
        node2.prev = node1;
        node2.next = node3;
        node3.prev = node2;

        // Verify links
        expect(node1.next).toBe(node2);
        expect(node2.prev).toBe(node1);
        expect(node2.next).toBe(node3);
        expect(node3.prev).toBe(node2);
    });

    it("should allow updating value", () => {
        const node = new Node<string, number>("testKey", 42);

        node.value = 100;

        expect(node.value).toBe(100);
    });
});
