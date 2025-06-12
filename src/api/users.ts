import instance from "./interceptor";

const getUsers = async (): Promise<any []> => {
    try {
        const res = await instance.get(`/user`);
        console.log("Users fetched successfully:", res.data);
        return res.data;
        
    }
    catch (error) {
        console.error("Error fetching users:", error);
        throw error;
    }
}

const updateStatus= async (id:number, isActive:boolean): Promise<any []> => {
    try {
        const res = await instance.put(`/user/${id}/status?isActive=${isActive}`)
        console.log("Update status successfully:", res.data);
        return res.data;
        
    }
    catch (error) {
        console.error("Error fetching users:", error);
        throw error;
    }
}
export {
    getUsers,
    updateStatus
}