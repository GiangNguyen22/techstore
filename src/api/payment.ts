
import instance from "./interceptor";

interface RawSaleReport {
  totalSale: number;
  previousSale: number;
  increaseSale: number;
}

const getPaymentTotal = async (): Promise<RawSaleReport> =>{
    try {
        const res = await instance.get(`/payment/totals`);
        return res.data;
    } catch (error) {
        console.error("Error fetching payment total:", error);
        throw error;
    }
}

export {
  getPaymentTotal,
};