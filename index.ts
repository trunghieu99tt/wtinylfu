import { SegmentedLRU } from "./segmented-lru";
import { WTinyLFU } from "./w-tiny-lfu";

const cache = new SegmentedLRU<string, number>(5);

cache.put("key1", 1);
cache.put("key2", 2);

console.log(cache.get("key1"));
console.log(cache.get("key2"));
