export interface IOrderData {
  customer: string;
  total: number;
  freight: number;
  status: string;
}

export interface IOrderRepository {
  save(order: IOrderData): Promise<any>;
}
