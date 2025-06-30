import axios from "axios";
import instance from "./interceptor";
import { getAccessTokenFromLS } from "../utils/auth.util";
import { jwtDecode } from "jwt-decode";

interface queryCategory {
  name: string;
}

interface Params {
  pageNumber?: number;
  pageSize?: number;
  sortOrder?: string;
}
interface AddToCartRequest {
  productVariantId: number;
  quantity: number;
}

const baseUrl = "http://localhost:8080/api/cart";

const getAllCarts = async (): Promise<any> => {
  try {
    const res = await instance.get(`${baseUrl}`);
    // console.log(res);
    return res.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

// const getACart = async () => {
//   try {
//     const accessToken = getAccessTokenFromLS(); // Lấy token từ LocalStorage
//     console.log("Access Token:", accessToken); // In ra token để kiểm tra

//     if (!accessToken) throw new Error("No access token found");

//     // Giải mã token để kiểm tra thông tin
//     const decodedToken: any = jwtDecode(accessToken);

//     // Kiểm tra nếu token có trường exp
//     if (decodedToken.exp) {
//       const isTokenExpired = decodedToken.exp * 1000 < Date.now(); // Kiểm tra xem token có hết hạn hay không
//       if (isTokenExpired) {
//         console.log("Token đã hết hạn.");
//         // Xử lý lại yêu cầu lấy lại token mới hoặc thông báo người dùng đăng nhập lại
//       } else {
//         console.log("Token còn hạn.");
//       }
//     } else {
//       console.log("Token không hợp lệ, không có trường exp.");
//     }

//     // Kiểm tra nếu token đã hết hạn
//     const currentTime = Math.floor(Date.now() / 1000); // Thời gian hiện tại (tính bằng giây)
//     console.log("Expiration Time:", decodedToken.exp); // In ra thời gian hết hạn của token

//     if (decodedToken.exp < currentTime) {
//       throw new Error("Token đã hết hạn");
//     }

//     // Nếu token còn hạn, tiếp tục thực hiện yêu cầu API
//     const response = await axios.get('http://localhost:8080/api/carts/users/cart', {
//       headers: {
//         Authorization: `Bearer ${accessToken}`, // Gửi token trong header
//       },
//     });
//     console.log("he",response);
//     return response.data;
//   } catch (error: unknown) {
//     // Kiểm tra nếu error là instance của Error
//     if (error instanceof Error) {
//       console.error("Lỗi khi lấy giỏ hàng:", error.message);
//     } else {
//       console.error("Lỗi không xác định:", error);
//     }
//     throw error;
//   }
// };

const getACart = async () => {
  try {
    const token = getAccessTokenFromLS();
    if (!token) {
      // Trả về cart rỗng khi chưa đăng nhập
      return { items: [] };
    }

    const res = await axios.get(baseUrl, {
      headers: { Authorization: `Bearer ${token}` },
    });
    // console.log(res.data);
    return res.data;
  } catch (error) {
    // Có thể log lỗi hoặc xử lý tùy ý
    return { items: [] };  // Hoặc throw error nếu muốn xử lý khác ở ngoài
  }
};


//   const addAProductCart = async (productId: string, quantity: number): Promise<any> => {
//     try {
//         const token = localStorage.getItem("access_token");  // Lấy access token từ localStorage

//         if (!token) throw new Error("Không có token để xác thực");

//         const res = await instance.post(
//             `${baseUrl}/products/${productId}/quantity/${quantity}`,
//             {},
//             {
//                 headers: {
//                     Authorization: `Bearer ${token}`,  // Thêm Authorization header
//                 }
//             }
//         );

//         console.log('API Response:', res.data);
//         return res.data;
//     } catch (error: any) {
//         console.error('API Error:', error);
//         throw error.response?.data || error;
//     }
// };
const addAProductCart = async (request: AddToCartRequest): Promise<any> => {
  try {
    const token = getAccessTokenFromLS();
    if (!token) throw new Error("No token");

    const res = await axios.post(`${baseUrl}/items`, request, {
      headers: { Authorization: `Bearer ${token}` },
    });
    // console.log(
    //   "Sending request to:",
    //   `${baseUrl}/items`,
    //   "with data:",
    //   request
    // );

    return res.data;
  } catch (error) {
    console.error("addAProductCart error:", error);

    throw error;
  }
};

// const updateCart = async (
//   productId: string,
//   quantity: number
// ): Promise<any> => {
//   try {
//     // console.log(productId, quantity);
//     const res = await instance.put(
//       `${baseUrl}/products/${productId}/quantity/${quantity}`
//     );
//     console.log(res.data);
//     return res.data;
//   } catch (error) {
//     console.log(error);
//   }
// };
const updateCart = async (
  cartItemId: number,
  quantity: number
): Promise<any> => {
  try {
    const token = getAccessTokenFromLS();
    if (!token) throw new Error("No token");

    const res = await axios.put(
      `${baseUrl}/items/${cartItemId}`,
       quantity ,
      {
        headers: { Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
 },
        
      }
    );

    return res.data;
  } catch (error) {
    throw error;
  }
};

// const deleteCart = async (cartId: string, productId: string): Promise<any> => {
//   try {
//     const res = await instance.delete(
//       `${baseUrl}/${cartId}/product/${productId}`
//     );
//     // console.log(res.data);
//     return res.data;
//   } catch (error) {
//     console.log(error);
//   }
// };
interface RemoveFromCartRequest {
  cartItemId: number;
}

const deleteCart = async (cartItemId: number): Promise<any> => {
  try {
    const token = getAccessTokenFromLS();
    console.log("Token sent for deleteCart:", token);

    if (!token) throw new Error("No token");

    // const res = await axios.delete(`${baseUrl}`, {
    //   headers: { Authorization: `Bearer ${token}` },
    //   data: { cartItemId }
    // });
    const res = await axios.delete(`${baseUrl}/items/${cartItemId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return res.data;
  } catch (error: any) {
    console.error("Delete cart error:", error.response?.data || error.message);

    throw error;
  }
};

export { getAllCarts, addAProductCart, deleteCart, getACart, updateCart };
