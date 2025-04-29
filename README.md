# TinyLFU

A TypeScript implementation of the TinyLFU (Window Tiny Least Frequently Used) cache eviction policy.

## About

TinyLFU is an efficient cache admission policy that provides high hit rates by using frequency-based admission control. This implementation includes:

-   Window-TinyLFU (W-TinyLFU) design with window and main caches
-   Segmented LRU for the main cache
-   Count-Min Sketch frequency counter
-   Efficient cache admission policy

## Installation

```bash
npm install
```

## Usage

```typescript
import { WTinyLFU } from "tinylfu";

// Create a cache with capacity of 100 items
const cache = new WTinyLFU<string, any>(100);

// Add items to the cache
cache.put("key1", "value1");

// Retrieve items
const value = cache.get("key1");

// Check size
const size = cache.size();

// Clear cache
cache.clear();
```

## Development

To start development:

```bash
npm run dev
```

## Building

To build the project:

```bash
npm run build
```

## Testing

To run tests:

```bash
npm test
```

To run tests in watch mode:

```bash
npm run test:watch
```

## Project Structure

-   `index.ts` - Main W-TinyLFU implementation
-   `segmented-lru.ts` - Segmented LRU implementation
-   `lru.ts` - Basic LRU cache
-   `min-increment-cbf.ts` - Count-Min Sketch for frequency counting
-   `door-keeper.ts` - Bloom filter implementation
-   `hash.ts` - Hashing utilities
-   `node.ts` - Cache node implementation
-   `util.ts` - Utility functions
