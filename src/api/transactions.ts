import instance from "./interceptor";

const getTransactions = async ():Promise<any[]> => {
    try {
        const res = await instance.get(`/payment`);
        return res.data;
    } catch (error) {
        console.error("Error fetching transactions:", error);
        throw error;
    }
}

export{
    getTransactions,
}