import { WTinyLFU } from "./w-tiny-lfu";

const cache = new WTinyLFU(100);

cache.put("key1", "value1");
cache.put("key2", "value2");
cache.put("key3", "value3");
cache.put("key4", "value4");
cache.put("key5", "value5");

console.log(cache.get("key1"));
