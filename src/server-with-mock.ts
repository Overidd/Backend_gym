import createApp from './app.js';

import { mockProductRepository } from './tests/utils.js';


const app = createApp({ productRepository: mockProductRepository });

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});