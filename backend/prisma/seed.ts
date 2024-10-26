import {Order, PrismaClient, Product} from '@prisma/client'
import {parse} from 'csv-parse'
import {createReadStream} from 'fs'
import {join} from 'path'

const prisma = new PrismaClient()

function readCSV(path: string): Promise<unknown[][]> {
    return new Promise((resolve, reject) => {
        const data: unknown[][] = []
        createReadStream(path)
            .pipe(parse({delimiter: ';', from_line: 2}))
            .on('data', row => data.push(row))
            .on('end', () => resolve(data))
            .on('error', reject)
    })
}

function mapper(rawData: unknown[][], indexes: {[index: number]: string}) {
    const data: unknown[] = []
    for (const row of rawData) {
        const item: {[key: string]: unknown} = {}
        for (let index = 0; index < row.length; index++) {
            const key = indexes[index]
            item[key] = row[index]
        }
        data.push(item)
    }
    return data
}

async function getProducts(path: string) {
    const productsCSV = await readCSV(path)
    let products = mapper(productsCSV, {
        0: 'name',
        1: 'price',
        2: 'id',
    })
    products = products.map((product: any) => {
        return {
            ...product,
            price: parseFloat(product['price']),
            id: parseInt(product['id']),
        }
    })
    return products
}

async function getOrders(path: string) {
    const ordersCSV = await readCSV(path)
    let orders = mapper(ordersCSV, {
        0: 'quantity',
        1: 'date',
        2: 'productId',
    })
    orders = orders.map((order: any) => {
        return {
            ...order,
            quantity: parseInt(order['quantity']),
            date: new Date(order['date']),
            productId: parseInt(order['productId']),
        }
    })
    return orders
}

async function main() {
    const currentPath = join(__dirname, 'data')
    const ordersCSVPath = join(currentPath, 'output-orders.csv')
    const productsCSVPath = join(currentPath, 'output-products.csv')

    const products = (await getProducts(productsCSVPath)) as Product[]
    const orders = (await getOrders(ordersCSVPath)) as Order[]

    await prisma.product.createMany({
        data: products,
    })
    console.log(`${products.length} products imported.`)

    await prisma.order.createMany({data: orders})
    console.log(`${orders.length} orders imported.`)
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async e => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
