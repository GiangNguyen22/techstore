import instance from "./interceptor";

const getUsers = async (): Promise<any []> => {
    try {
        const res = await instance.get(`/user/allusers`);
        console.log("Users fetched successfully:", res.data);
        return res.data;
        
    }
    catch (error) {
        console.error("Error fetching users:", error);
        throw error;
    }
}
export {
    getUsers,
}