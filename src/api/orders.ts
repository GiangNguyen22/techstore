import instance from "./interceptor";

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
export {
    getOrders,}