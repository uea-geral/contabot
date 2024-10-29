import {Router} from 'express'
import {ProductRouter} from './controllers/product_controller'
import {SalesRouter} from './controllers/sales_controller'

export const router = Router()

router.use(SalesRouter)
router.use(ProductRouter)
