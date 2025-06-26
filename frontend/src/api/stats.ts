import instance from "./interceptor";

const getStatsThisWeek = async (): Promise<any> => {
  try {
    const res = await instance.get("/stats/this-week");
    return res.data;
  } catch (error: any) {
    console.error("Error fetching weekly stats:", error);
    throw error.response?.data || error;
  }
}

export {
    getStatsThisWeek,
};