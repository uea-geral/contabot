import {Request, Router} from 'express'
import {prisma} from '../repositories/prisma_connection'
import {SalesRepository} from '../repositories/sales_repository'
import {ReportService} from '../services/report_service'

export const SalesRouter = Router()

const salesRepository = new SalesRepository(prisma)
const reportService = new ReportService()

SalesRouter.get(
    '/sales',
    async (
        request: Request<
            unknown,
            unknown,
            unknown,
            {page: number; offset?: number}
        >,
        response,
    ) => {
        const {page, offset} = request.query
        const sales = await salesRepository.fetchAll(
            page,
            offset ? parseInt(offset.toString()) : undefined,
        )
        response.status(200).json(sales)
    },
)

SalesRouter.get(
    '/sales/report',
    async (
        request: Request<
            unknown,
            unknown,
            unknown,
            {page: number; offset?: number}
        >,
        response,
    ) => {
        const {page, offset} = request.query
        const sales = await salesRepository.fetchAll(
            page,
            offset ? parseInt(offset.toString()) : undefined,
        )

        // TODO: pass the prompt results
        await reportService.generateReport(response, sales)
    },
)
