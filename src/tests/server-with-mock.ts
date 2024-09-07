import createApp from './server.test';

import { mockProductRepository } from './utils.js';


import { ProductRouter } from '../products/product.router.js';


const routerProduct = new ProductRouter(mockProductRepository)
const app = createApp(routerProduct.router);

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});