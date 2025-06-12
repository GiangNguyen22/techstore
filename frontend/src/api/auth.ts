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
    const res = await axios.post(`${urlAuth}/register`, {
      name,      
      email,
      password,
      phone,     
    });
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


// const login = async (email: string, password: string): Promise<any> => {
//   try {
//     const res = await axios.post(`${urlAuth}/login`, {
//       email,
//       password,
//     });
//     return res.data;
//   } catch (error) {
//     console.error(error);
//     throw new Error("Tên đăng nhập hoặc mật khẩu không đúng");
//   }
// };
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
    
    return res.data;
  }  catch (error: any) {
  console.error("Lỗi login chi tiết:", error.response || error);
  if (error.response?.data?.message) {
    throw new Error(error.response.data.message);
  }
  throw new Error("Tên đăng nhập hoặc mật khẩu không đúng");
}

};

const loginWithGoogle = async (token: string): Promise<any> => {
  try {
    const res = await axios.post(`${urlAuth}/oauth2/google`, {
      credential: token,
    });
    return res.data;
  } catch (error) {
    console.error(error);
    throw new Error("Đăng nhập Google thất bại");
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

const getAccessTokenFromRefreshToken = async (refreshToken: string) => {
  try {
    const res = await instance.post(`${urlAuth}/refreshTokenV2`, {
      refreshToken,
    });
    return res.data;
  } catch (error) {
    console.error(error);
  }
};

export {
  login,
  register,
  getUser,
  loginWithGoogle,
  getAccessTokenFromRefreshToken,
};
