import createApp from '../tests/app.js';

import { mockProductRepository } from '../tests/utils.js';


import { ProductRouter } from '../presentation/products/product.router.js';


const routerProduct = new ProductRouter(mockProductRepository)
const app = createApp(routerProduct.router);

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});