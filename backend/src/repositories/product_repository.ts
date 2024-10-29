import {PrismaClient} from '@prisma/client'

export class ProductRepository {
    constructor(private readonly prisma: PrismaClient) {}

    async fetchAll() {
        const products = await this.prisma.product.findMany({})
        return products
    }
}
