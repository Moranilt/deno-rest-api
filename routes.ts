import { Router, RouterContext } from 'https://deno.land/x/oak/mod.ts';
import { getProducts, getProduct, updateProduct, addProduct, deleteProduct } from './controllers/products.ts'
import {home} from './controllers/home.ts'

const router = new Router()

const decoder = new TextDecoder("utf-8")
const fileCont = await Deno.readFile('./views/test.js')
const fileJS = decoder.decode(fileCont)

router.get('/api/v1/products', getProducts)
    .get('/api/v1/products/:id', getProduct)
    .post('/api/v1/products', addProduct)
    .put('/api/v1/products/:id', updateProduct)
    .delete('/api/v1/products/:id', deleteProduct)
    .get('/', home)
    .get('/views/test.js', (ctx: RouterContext) => {
        ctx.response.type = "application/javascript"
        ctx.response.body = fileJS
    })


 export default router;