import { IProduct } from './IProduct';

export class PhysicalProduct implements IProduct {
  constructor(
    private id: number,
    private name: string,
    private price: number,
    private weight: number
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
    return 10.00;
  }
}
