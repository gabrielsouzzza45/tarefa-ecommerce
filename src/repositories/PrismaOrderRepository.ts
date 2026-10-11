import { IOrderRepository, IOrderData } from './IOrderRepository';
import { prisma } from '../lib/prisma';

export class PrismaOrderRepository implements IOrderRepository {
  async save(order: IOrderData): Promise<any> {
    const createdOrder = await prisma.order.create({
      data: {
        customer: order.customer,
        total: order.total,
        freight: order.freight,
        status: order.status,
      },
    });

    return createdOrder;
  }
}
