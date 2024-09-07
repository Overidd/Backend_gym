import test from 'node:test';
import assert from 'node:assert/strict';

import { productSchema } from "../products/product.schema.js";

import { createProduct } from './utils.js';


const validPrices = [0, 1, 10, 100, 1000, 10000, 100000, 1000000, 1.1, 2.45, 4.2];
const invalidPrices = [-1, -10, -1.1, -4.2, 4.999, 5.3214];


for (const price of validPrices) {
    test(`Un producto con precio ${price} es válido`, () => {
        const product = createProduct(price);
        const result = productSchema.safeParse(product);
        assert.strictEqual(result.success, true);
        assert.deepStrictEqual(result.data, product);
    });
}


for (const price of invalidPrices) {
    test(`Un producto con precio ${price} no es válido`, () => {
        const product = createProduct(price);
        const result = productSchema.safeParse(product);
        assert.strictEqual(result.success, false);
    });
}