import { IPaymentMethod, IPaymentDetails } from './IPaymentMethod';

export class CreditCardPayment implements IPaymentMethod {
  async process(amount: number, details: IPaymentDetails): Promise<boolean> {
    if (!details.cardNumber || !details.cvv) {
      throw new Error('Dados do cartão de crédito incompletos.');
    }

    console.log(`Processando pagamento de R$ ${amount.toFixed(2)} via Cartão de Crédito...`);
    return true;
  }
}
