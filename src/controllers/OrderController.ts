import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { getMailClient } from '../lib/mail';
import nodemailer from 'nodemailer';
import logger from '../lib/logger';

const prisma = new PrismaClient();

export class OrderController {
  
  async processOrder(req: Request, res: Response) {
    try {
      const { customer, items, paymentMethod, paymentDetails } = req.body;

      // 1. VALIDAÇÃO
      if (!items || items.length === 0) {
        logger.error('Tentativa de pedido sem itens');
        return res.status(400).json({ error: 'Carrinho vazio' });
      }

      // 2. CÁLCULO DE PREÇO E ESTOQUE
      let totalAmount = 0;
      let productsDetails = [];

      for (const item of items) {
        const product = await prisma.product.findUnique({ where: { id: item.productId } });
        
        if (!product) {
          return res.status(400).json({ error: `Produto ${item.productId} não encontrado` });
        }

        // Garante que o preço existe (evita NaN ou 0 caso venha nulo)
        const productPrice = Number(product.price) || 0;
        let itemTotal = productPrice * item.quantity;

        // Adiciona frete se for físico ou se o tipo não estiver especificado
        if (product.type === 'physical' || !product.type) {
          itemTotal += 10; // Frete fixo
        }

        totalAmount += itemTotal;
        productsDetails.push({ ...product, quantity: item.quantity });
      }

      // 3. PROCESSAMENTO DE PAGAMENTO
      if (paymentMethod === 'credit_card') {
        logger.info(`Processando cartão final ${paymentDetails?.cardNumber?.slice(-4) || '----'}`);
        if (paymentDetails?.cvv === '000') throw new Error('Cartão recusado');
      } else if (paymentMethod === 'debit_card') {
        logger.info('Processando débito...');
      } else {
        return res.status(400).json({ error: 'Método de pagamento não suportado' });
      }

      // 4. PERSISTÊNCIA
      const order = await prisma.order.create({
        data: {
          customer,
          items: JSON.stringify(productsDetails),
          total: totalAmount,
          status: 'confirmed'
        }
      });

      // 5. NOTIFICAÇÃO
      const mailer = await getMailClient();

      const info = await mailer.sendMail({
        from: '"DevStore" <noreply@devstore.com>',
        to: customer,
        subject: `Confirmação do Pedido #${order.id}`,
        text: `Olá, seu pedido #${order.id} no valor de R$ ${totalAmount} foi confirmado.`,
        html: `
          <h1>Pedido Confirmado!</h1>
          <p>Olá, seu pedido <b>#${order.id}</b> foi processado com sucesso.</p>
          <p>Total: <strong>R$ ${totalAmount}</strong></p>
          <ul>
            ${productsDetails.map(p => `<li>${p.name} (Qtd:${p.quantity})</li>`).join('')}
          </ul>
        `,
      });

      logger.info(`Email enviado: ${nodemailer.getTestMessageUrl(info)}`); 

      return res.json({ 
        message: 'Pedido processado com sucesso', 
        orderId: order.id,
        emailPreview: nodemailer.getTestMessageUrl(info)
      });

    } catch (error: any) {
      logger.error(`Erro ao processar pedido: ${error.message}`);
      return res.status(500).json({ error: 'Erro interno' });
    }
  }
}
