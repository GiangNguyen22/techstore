import axios from "axios";
import instance from "./interceptor";

const urlAuth = "http://localhost:8080/api/auth";

const register = async (
  name: string,
  email: string,
  password: string,
  phone: string
): Promise<any> => {
  try {
const res = await instance.post(`/auth/register`, {
      name,      
      email,
      password,
      phone,     
    });
    console.log(res.data);
    return res.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error("Lỗi chi tiết:", error.response?.data || error.message);
      throw new Error(error.response?.data?.message || "Đăng ký không thành công");
    } else {
      console.error("Lỗi không xác định:", error);
      throw new Error("Đăng ký không thành công");
    }
  }
};



const login = async (email: string, password: string): Promise<any> => {
  try {
    const res = await axios.post(`${urlAuth}/login`, {
      email,
      password,
    });
    
    const { token, refreshToken } = res.data;
    
    if (token) {
      localStorage.setItem("accessToken", token);
    }
    if (refreshToken) {
      localStorage.setItem("refreshToken", refreshToken);
    }
    console.log(res.data);
    return res.data;
  }  catch (error: any) {
  console.error("Lỗi login chi tiết:", error.response || error);
  if (error.response?.data?.message) {
    throw new Error(error.response.data.message);
  }
  throw new Error("Tên đăng nhập hoặc mật khẩu không đúng");
}

};


const getUser = async () => {
  try {
    const res = await instance.get(`${urlAuth}/user`);
    return res.data;
  } catch (error: any) {
    const status = error?.response?.status;
    if (status === 401 || status === 500) {
      console.warn("Chưa đăng nhập hoặc lỗi server.");
      return null;
    }
    console.error("Lỗi khi lấy thông tin người dùng:", error);
    throw new Error("Không lấy được thông tin người dùng");
  }
};
export interface RefreshTokenResponse {
  accessToken: string;
}

 const getAccessTokenFromRefreshToken = async (refreshToken: string): Promise<RefreshTokenResponse> => {
  try {
    const res = await instance.post("/refreshToken", { refreshToken });
    console.log(res.data);
    return res.data; // { accessToken: "..." }
  } catch (error) {
    console.error("Error refreshing token:", error);
    throw error;
  }
};

export interface UserProfile {
  id: number;
  name: string;
  email: string;
  dateOfBirth: string ;
  role: {
    name: string;
    authority: string;
  };
  phone: string;
  address: string ;
}


export interface UpdateProfileRequest {
  name: string;
  dateOfBirth: string;
  phone: string;
  address: string;
}

// Hàm lấy profile user
const getUserProfile = async (): Promise<UserProfile | null> => {
  try {
    const res = await instance.get("/user/profile");
    return res.data;
  } catch (error: any) {
    if (error.response?.status === 401) {
      console.warn("Chưa đăng nhập hoặc token hết hạn");
      return null;
    }
    console.error("Lấy profile thất bại", error);
    throw new Error("Lấy profile thất bại");
  }
};

// Hàm cập nhật profile user
const updateUserProfile = async (data: UpdateProfileRequest): Promise<string> => {
  try {
    const res = await instance.put("/user/profile", data);
    return res.data; // trả về message "Profile updated successfully"
  } catch (error: any) {
    console.error("Cập nhật profile thất bại", error);
    throw new Error(error.response?.data || "Cập nhật profile thất bại");
  }
};
export {
  login,
  register,
  getUser,
  getAccessTokenFromRefreshToken,
  getUserProfile,
  updateUserProfile,
};
