import { IProduct } from './IProduct';

export class DigitalProduct implements IProduct {
  constructor(
    private id: number,
    private name: string,
    private price: number
  ) {}

  getId(): number {
    return this.id;
  }

  getName(): string {
    return this.name;
  }

  getPrice(): number {
    return this.price;
  }

  calculateFreight(): number {
    return 0;
  }
}
