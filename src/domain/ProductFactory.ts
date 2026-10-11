import { IProduct } from './IProduct';
import { PhysicalProduct } from './PhysicalProduct';
import { DigitalProduct } from './DigitalProduct';

export class ProductFactory {
  static createProduct(data: { id: number; name: string; price: number; type: string; weight?: number }): IProduct {
    if (data.type === 'physical') {
      return new PhysicalProduct(data.id, data.name, data.price, data.weight || 0);
    } 
    
    if (data.type === 'digital') {
      return new DigitalProduct(data.id, data.name, data.price);
    }

    throw new Error(`Tipo de produto desconhecido: ${data.type}`);
  }
}
