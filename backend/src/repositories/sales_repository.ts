import {PrismaClient} from '@prisma/client'

export class SalesRepository {
    constructor(private readonly prisma: PrismaClient) {}

    async fetchAll(page: number, offset: number = 10) {
        const sales = await this.prisma.order.findMany({
            select: {
                id: true,
                date: true,
                product: {
                    select: {
                        name: true,
                        price: true,
                    },
                },
                quantity: true,
                productId: true,
            },
            skip: page * offset,
            take: offset,
        })
        return sales
    }
}
