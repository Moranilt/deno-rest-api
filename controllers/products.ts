import { Client } from "https://deno.land/x/postgres/mod.ts"
import {Product} from '../types.ts'
import { dbCreds } from '../config.ts'

// Initialize client
const client = new Client(dbCreds)

//  @desc   Get All Products
//  @route  GET /api/v1/products
const getProducts = async ({response} : {response:any}) => {
    try{
        await client.connect()

        const result = await client.query("SELECT * FROM products")
        const products = new Array()

        result.rows.map(p => {
            let obj: any = new Object()
            result.rowDescription.columns.map((el, i) => {
                obj[el.name] = p[i]
            })

            products.push(obj)
        })

        response.body = {
            success: true,
            data: products
        }
    }catch(error){
        response.status = 500
        response.body = {
            success: false,
            msg: error.toString()
        }
    }finally{
        await client.end()
    }
}

//  @desc   Get A Single Product
//  @route  GET /api/v1/products/:id
const getProduct = async ({params, response} : {params: {id: string}, response:any}) => {
    try {
        await client.connect()
        
        const result =  await client.query("SELECT * FROM products WHERE id = $1", params.id)

        if(result.rows.toString() === "") {
            response.status = 404
            response.body = {
                success: false,
                msg: `No Product with id of ${params.id}`
            }
            return;
        }else{
            const product: any = new Object()

            result.rows.map(p => {
                result.rowDescription.columns.map((el, i) => {
                    product[el.name] = p[i]
                })
            })

            response.body = {
                success: true,
                data: product
            }
        }

    } catch (error) {
        response.status = 500
        response.body = {
            success: false,
            msg: error.toString()
        }
    } finally {
        await client.end()
    }
}

//  @desc   Add A Single Product
//  @route  POST /api/v1/products/:id
const addProduct = async ({request, response} : {request: any, response:any}) => {
    const body = await request.body()
    const product = await body.value

    if(!request.hasBody) {
        response.status = 400
        response.body = {
            success: false,
            msg: 'No data'
        }
    }else{
        try{
            await client.connect()

            const result = await client.query("INSERT INTO products(name, description, price) VALUES($1, $2, $3)", 
            product.name, 
            product.description, 
            product.price)

            response.status = 201
            response.body = {
                success: true,
                data: product
            }
        }catch(error){
            response.status = 500
            response.body = {
                success: false,
                msg: error
            }
        } finally {
            await client.end()
        }
    }
}

//  @desc   Update A Single Product
//  @route  PUT /api/v1/products/:id
const updateProduct = async ({params, request, response} : { params: { id: string}, request: any, response:any}) => {
    await getProduct({ params: {"id": params.id}, response})

    if(response.status === 404) {
        response.body = {
            success: false,
            msg: response.body.msg
        }
        response.status = 404
        return
    }else{
        const body = await request.body()
        const product = await body.value

            /** */
            if(!request.hasBody) {
                response.status = 400
                response.body = {
                    success: false,
                    msg: 'No data'
                }
            }else{
                try{
                    await client.connect()

                    const result = await client.query("UPDATE products SET name=$1, description=$2, price=$3 WHERE id=$4", 
                    product.name ? product.name : response.body.data.name, 
                    product.description ? product.description : response.body.data.description, 
                    product.price ? product.price : response.body.data.price,
                    params.id)

                    response.status = 201
                    response.body = {
                        success: true,
                        data: product
                    }
                }catch(error){
                    response.status = 500
                    response.body = {
                        success: false,
                        msg: error.toString()
                    }
                } finally {
                    await client.end()
                }
            }
            /** */
    }
}

//  @desc   Delete A Single Product
//  @route  DELETE /api/v1/products/:id
const deleteProduct = async ({params, response} : { params: {id: string}, response:any}) => {
    await getProduct({params: {"id": params.id}, response})

    if(response.status === 404) {
        response.status = 404
        response.body = {
            success: false,
            body: response.body.msg
        }
    }else{
        try {
            await client.connect()

            const result = await client.query("DELETE FROM products WHERE id=$1", params.id)

            response.status = 204
            response.body = {
                success: true, 
                msg: `Product with id ${params.id} has been deleted`
            }

        } catch (error) {
            response.status = 500
            response.body = {
                success: false,
                msg: error.toString()
            }
        } finally {
            await client.end()
        }
    }
}

export { getProducts, getProduct, addProduct, updateProduct, deleteProduct };