import { test, beforeEach } from "node:test";
import assert from "node:assert/strict";
import request from "supertest";

import createApp from "./server.test";

import { createProduct, mockProductRepository } from "./utils.js";
import type { IProduct, CreateProduct } from "../products/product.DTOS.ts";

import { Router } from "express";

const router = Router()
router.use('', mockProductRepository.create)
router.use('', mockProductRepository.delete)
router.use('', mockProductRepository.getAll)
router.use('', mockProductRepository.getById)

const app = createApp(router);

const ENDPOINTS = Object.freeze({
    PRODUCT: "/api/product",
    GET_ALL: "/api/product/all",
    GET_BY_ID: "/api/product/{id}",
});

beforeEach(() => {
    mockProductRepository.clear();
});

test("Obtener todos los productos (cuando no hay) devuelve un 404", async () => {
    const response = await request(app).get(ENDPOINTS.GET_ALL).send();

    assert.strictEqual(response.statusCode, 404);
});

test("Obtener todos los productos (cuando hay) devuelve un 200 y los productos", async () => {
    // Productos con precios 1, 2 y 3
    const expectedProducts: IProduct[] = [1, 2, 3].map((price) => createProduct(price));

    const productsWithoutId: CreateProduct[] = expectedProducts.map((product) => ({ ...product }));

    for (const product of productsWithoutId) {
        const result = await mockProductRepository.create(product);
        assert.notEqual(result, null);
    }

    const response = await request(app).get(ENDPOINTS.GET_ALL).send();

    // Las fechas de la respuesta vienen con tipo `string`, no `Date`
    // Pero vienen bien formateadas así que se pueden convertir y ya
    const actualProducts = response.body.map((product: IProduct) => ({
        ...product,
    }));

    assert.strictEqual(response.statusCode, 200);
    assert.deepStrictEqual(actualProducts, expectedProducts);
});

test("Crear un producto e intentar obtenerlo por ID funca", async () => {
    const product = createProduct(1);
    const result = await mockProductRepository.create(product);
    assert.notEqual(result, null);

    const endpoint = ENDPOINTS.GET_BY_ID.replace("{id}", result.id.toString())

    const response = await request(app).get(endpoint).send();
    const productSent = {
        ...response.body,
        createdAt: new Date(response.body.createdAt),
        updatedAt: new Date(response.body.updatedAt),
    };
    const storedProduct = await mockProductRepository.getById(result.id);

    assert.strictEqual(response.statusCode, 200);
    assert.deepStrictEqual(productSent, storedProduct);
});