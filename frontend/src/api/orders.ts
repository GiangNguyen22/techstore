import instance from "./interceptor";
interface OrderReport {
  totalOrders: number;
 previousTotalOrders: number;
  percent: number;
}
interface Pending{
  pending:number;
    cancel:number;
}

const getOrders = async (status?: string): Promise<any[]> => {
    try {
        const res = await instance.get(`/order`)
        return res.data;
    }
    catch(error) {
        console.error("Error fetching orders:", error);
        throw error;
    }
};
const getOrdersReport = async(status?:string):Promise<OrderReport> => {
    try {
        const res = await instance.get(`/order/total-order`)
        return res.data;
    }
    catch(error) {
        console.error("Error fetching orders report:", error);
        throw error;
    }
};

const getOrdersbyId = async(id: number): Promise<any> => {
    try {
        const res = await instance.get(`/order/${id}`);
        return res.data;
    } catch (error) {
        console.error("Error fetching order by ID:", error);
        throw error;
    }
};

const getPendingCancelledOrders = async (status?:string): Promise<Pending> => {
    try {
        const res = await instance.get(`/order/pending-cancelled`);
        return res.data;
    } catch (error) {
        console.error("Error fetching pending cancelled orders:", error);
        throw error;
    }
};
export {
    getOrders,
    getOrdersReport,
    getOrdersbyId,
    getPendingCancelledOrders
}