import {Router} from 'express'
import {prisma} from '../repositories/prisma_connection'
import {ProductRepository} from '../repositories/product_repository'

export const ProductRouter = Router()

const productRepository = new ProductRepository(prisma)

ProductRouter.get('/products', async (_, response) => {
    const products = await productRepository.fetchAll()
    response.status(200).json(products)
})
