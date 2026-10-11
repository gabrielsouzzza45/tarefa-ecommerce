export interface IProduct {
  getId(): number;
  getName(): string;
  getPrice(): number;
  calculateFreight(): number;
}
