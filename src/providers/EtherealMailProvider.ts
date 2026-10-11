import nodemailer, { Transporter } from 'nodemailer';
import { IMailProvider, IMessage } from './IMailProvider';

export class EtherealMailProvider implements IMailProvider {
  private client: Transporter;

  constructor() {
    nodemailer.createTestAccount().then((testAccount) => {
      this.client = nodemailer.createTransport({
        host: testAccount.smtp.host,
        port: testAccount.smtp.port,
        secure: testAccount.smtp.secure,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });
    }).catch((err) => {
      console.error('Erro ao criar conta de teste do Ethereal Mail:', err);
    });
  }

  async sendMail(message: IMessage): Promise<void> {
    if (!this.client) {
      const testAccount = await nodemailer.createTestAccount();
      this.client = nodemailer.createTransport({
        host: testAccount.smtp.host,
        port: testAccount.smtp.port,
        secure: testAccount.smtp.secure,
        auth: { user: testAccount.user, pass: testAccount.pass },
      });
    }

    const info = await this.client.sendMail({
      from: '"Equipe E-commerce" <noreply@ecommerce.com>',
      to: message.to,
      subject: message.subject,
      html: message.body,
    });

    console.log('E-mail enviado! URL de visualização: %s', nodemailer.getTestMessageUrl(info));
  }
}
