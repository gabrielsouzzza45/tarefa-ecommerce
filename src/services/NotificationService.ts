import { IMailProvider } from '../providers/IMailProvider';

export interface INotificationDTO {
  to: string;
  subject: string;
  message: string;
}

export class NotificationService {
  constructor(private mailProvider: IMailProvider) {}

  async sendOrderConfirmation(customerEmail: string, orderId: number | string, total: number): Promise<void> {
    await this.mailProvider.sendMail({
      to: customerEmail,
      subject: `Confirmação do Pedido #${orderId}`,
      body: `
        <div style="font-family: Arial, sans-serif; color: #333;">
          <h2>Olá! O seu pedido foi registado com sucesso.</h2>
          <p><strong>Número do Pedido:</strong> #${orderId}</p>
          <p><strong>Valor Total:</strong> R$ ${total.toFixed(2)}</p>
          <p>Obrigado por comprar conosco!</p>
        </div>
      `,
    });

    console.log(`Notificação de confirmação enviada para ${customerEmail}`);
  }
}
