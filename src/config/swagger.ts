import swaggerJSDoc from "swagger-jsdoc";

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "Swagger API",
    version: "1.0.0",
    description: "",
    contact: {
      name: ": Jhon Elvis",
      email: "correo@example.com",
    }
  },
  servers: [
    {
      url: "http://localhost:3000",
      description: "Local server",
    },
  ],
};

const options = {
  swaggerDefinition,
  apis: ["./src/products/product.router.ts"],
};

export const swaggerSpec = swaggerJSDoc(options);