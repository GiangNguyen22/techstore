// import { createAction, createReducer } from "@reduxjs/toolkit";
// import {
//   clearLS,
//   getAccessTokenFromLS,
//   getProfileFromLS,
//   setAccessTokenToLS,
//   setProfileToLS,
// } from "../utils/auth.util";
// import { splitJwt } from "../utils/splitJwt";
// // import { clearLocalStorage, getAccessTokenFromLocal } from "../api/auth";

// interface UserState {
//   isAuthenticated: Boolean;
//   user: any;
// }

// const initailState: UserState = {
//   isAuthenticated: getProfileFromLS() ? true : false,

//   user: localStorage.getItem("user")
//     ? JSON.parse(localStorage.getItem("user")!)
//     : null,
// };

// export const checkIsAuthenticated = createAction<boolean>(
//   "user/checkIsAuthenticated"
// );

// // export const setAccessToken = createAction<string>("user/setAccessToken");

// export const addUser = createAction<any>("user/addUser");

// export const logout = createAction("user/logout");

// const userReducer = createReducer(initailState, (build) => {
//   build
//     .addCase(checkIsAuthenticated, (state, action) => {
//       state.isAuthenticated = action.payload;
//     })
//     .addCase(addUser, (state, action) => {
//       console.log("User từ API:", action.payload);

//       state.user = action.payload;
//       setProfileToLS(action.payload);
//     })
//     .addCase(logout, (state) => {
//       clearLS();
//       state.isAuthenticated = false;
//       state.user = null;
//     });
    
// });
// export default userReducer;
import { createAction, createReducer } from "@reduxjs/toolkit";
import {
    clearLS,
    getProfileFromLS,
    setProfileToLS,
    getAccessTokenFromLS 
} from "../utils/auth.util";
import { jwtDecode } from "jwt-decode";

interface UserState {
    isAuthenticated: Boolean;
    user: any;
}
const checkValidToken = (token: string) => {
    try {
      if (!token) return false;
      const decodedToken = jwtDecode(token);
      
      // Kiểm tra nếu exp có tồn tại trong decodedToken
      if (!decodedToken.exp) {
        return false;  // Nếu exp không có, token không hợp lệ
      }
  
      return decodedToken.exp * 1000 > Date.now();  // Kiểm tra nếu thời gian hết hạn chưa đến
    } catch (error) {
      return false;
    }
  };
  
  
// const initailState: UserState = {
//     isAuthenticated: !!getProfileFromLS(), // Sử dụng getProfileFromLS để kiểm tra
//     user: getProfileFromLS(),             // Sử dụng getProfileFromLS để lấy user
// };
const initailState: UserState = {
    isAuthenticated: checkValidToken(getAccessTokenFromLS()), // Kiểm tra token hợp lệ
    user: getProfileFromLS(), // Lấy thông tin người dùng từ LS
  };
export const checkIsAuthenticated = createAction<boolean>(
    "user/checkIsAuthenticated"
);

export const addUser = createAction<any>("user/addUser");

export const logout = createAction("user/logout");

const userReducer = createReducer(initailState, (build) => {
    build
        .addCase(checkIsAuthenticated, (state, action) => {
            state.isAuthenticated = action.payload;
        })
        .addCase(addUser, (state, action) => {
            console.log("User từ API:", action.payload);
            state.user = action.payload;
            setProfileToLS(action.payload);
        })
        .addCase(logout, (state) => {
            clearLS();
            state.isAuthenticated = false;
            state.user = null;
        });
});

export default userReducer;
