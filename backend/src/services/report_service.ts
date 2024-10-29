import {Prisma} from '@prisma/client'
import {Response} from 'express'
import PDFDocument from 'pdfkit-table'

interface Sales {
    product: {
        name: string
        price: Prisma.Decimal
    }
    id: number
    productId: number
    quantity: number
    date: Date
}

export class ReportService {
    async generateReport(response: Response, sales: Sales[]) {
        const document = new PDFDocument({margin: 40, size: 'A4'})
        document.pipe(response)
        document.font('Times-Roman')

        document.fontSize(24).text(`Relatório de Vendas Inteligente - Contabot`)

        const salesToTable = sales.map(sale => {
            const total = sale.quantity * sale.product.price.toNumber()
            return [
                sale.id.toString(),
                sale.quantity.toString(),
                sale.product.name,
                sale.product.price.toNumber().toString(),
                total.toString(),
            ]
        })

        const table = {
            title: 'Vendas',
            headers: [
                'ID da Venda',
                'Quantidade',
                'Nome do Produto',
                'Preço Unitário (em $)',
                'Total (em $)',
            ],
            rows: salesToTable,
        }
        await document.table(table)

        // TODO: include the prompt result
        // code here...
        // ===============================

        document
            .fontSize(8)
            .text(`Gerado em ${new Date().toLocaleDateString()}`, {
                oblique: true,
                align: 'right',
            })
        document.end()
    }
}
