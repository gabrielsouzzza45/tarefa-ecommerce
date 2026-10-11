import { ProductFactory } from '../domain/ProductFactory';
import { IOrderRepository } from '../repositories/IOrderRepository';
import { IMailProvider } from '../providers/IMailProvider';
import { IPaymentMethod } from '../payments/IPaymentMethod';

export class OrderService {
  constructor(
    private orderRepository: IOrderRepository,
    private mailProvider: IMailProvider
  ) {}

  async execute(data: { customer: string; items: any[]; paymentMethod: IPaymentMethod; paymentDetails: any }) {
    let totalFreight = 0;
    const processedItems = data.items.map(item => {
      const product = ProductFactory.createProduct(item); 
      
      totalFreight += product.calculateFreight();
      return product;
    });

    const paymentSuccess = data.paymentMethod.process(data.paymentDetails);
    if (!paymentSuccess) {
      throw new Error('Pagamento recusado.');
    }

    const order = await this.orderRepository.save({
      customer: data.customer,
      items: processedItems,
      freight: totalFreight
    });

    await this.mailProvider.sendMail({
      to: data.customer,
      subject: 'Pedido Realizado com Sucesso!',
      body: `O seu pedido foi aprovado. O frete total foi de R$ ${totalFreight}`
    });

    return order;
  }
}