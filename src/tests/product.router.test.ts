import { test, beforeEach } from "node:test";
import assert from "node:assert/strict";
import request from "supertest";

import createApp from "./app";

import { createProduct, mockProductRepository } from "./utils.js";
import type { CreateProduct, IProduct } from "../presentation/products/product.DTOS";

import { ProductRouter, publicProductSchema } from "../presentation/products";

const productRouter = new ProductRouter(mockProductRepository)


const app = createApp(productRouter.router);

const ENDPOINTS = Object.freeze({
    PRODUCT: "/api/product",
    GET_ALL: "/api/product/all",
    GET_BY_ID: "/api/product/{id}",
});

beforeEach(() => {
    mockProductRepository.clear();
});

test("Obtener todos los productos (cuando no hay) devuelve un array vacío", async () => {
    const response = await request(app).get(ENDPOINTS.GET_ALL).send();

    assert.strictEqual(response.statusCode, 200);
    assert.deepStrictEqual(response.body.data, []);
});

test("Obtener todos los productos (cuando hay) devuelve un 200 y los productos", async () => {
    // Productos con precios 1, 2 y 3
    const expectedProducts: CreateProduct[] = [1, 2, 3].map((price) => createProduct(price));

    for (const product of expectedProducts) {
        const result = await mockProductRepository.create(product);
        assert.notEqual(result, null);
    }

    const response = await request(app).get(ENDPOINTS.GET_ALL).send();

    // El servidor le añade más información a los productos al crearlos
    // Así que le quito todo eso con el esquema para comparar más fácil
    const actualProducts: CreateProduct[] = response.body.data.map((product: IProduct) => (publicProductSchema.parse(product)));

    assert.strictEqual(response.statusCode, 200);
    assert.deepStrictEqual(actualProducts, expectedProducts, response.body);
});

test("Crear un producto e intentar obtenerlo por ID funca", async () => {
    const product = createProduct(1);
    const productStored = await mockProductRepository.create(product);
    assert.notEqual(productStored, null);

    const endpoint = ENDPOINTS.GET_BY_ID.replace("{id}", productStored.id.toString())

    const response = await request(app).get(endpoint).send();
    const productSent = {
        ...response.body.data,
        createdAt: new Date(response.body.data.createdAt),
        updatedAt: new Date(response.body.data.updatedAt),
    };
    const productInRepo = await mockProductRepository.getById(productStored.id);

    assert.strictEqual(response.statusCode, 200);
    assert.deepStrictEqual(productSent, productInRepo);
    assert.deepStrictEqual(productSent, productStored);
});