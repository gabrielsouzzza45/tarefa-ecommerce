export interface IPaymentDetails {
  cardNumber?: string;
  cvv?: string;
  document?: string;
  pixKey?: string;
}

export interface IPaymentMethod {
  process(amount: number, details: IPaymentDetails): Promise<boolean>;
}
