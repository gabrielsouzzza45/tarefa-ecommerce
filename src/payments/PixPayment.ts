import { IPaymentMethod, IPaymentDetails } from './IPaymentMethod';

export class PixPayment implements IPaymentMethod {
  async process(amount: number, details: IPaymentDetails): Promise<boolean> {
    if (!details.pixKey) {
      throw new Error('A chave PIX do pagador é obrigatória.');
    }

    // Simulação de geração de QR Code / Transação PIX instantânea
    console.log(`Gerando cobrança PIX no valor de R$ ${amount.toFixed(2)} para a chave: ${details.pixKey}...`);
    
    return true;
  }
}
