import { jwtDecode } from "jwt-decode";

export const LocalStorageEventTarget = new EventTarget();

export const setAccessTokenToLS = (accessToken: string) => {
  localStorage.setItem("accessToken", accessToken);
};

export const setRefreshTokenToLS = (refreshToken: string) => {
  localStorage.setItem("refreshToken", refreshToken);
};

export const clearLS = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("user");

  // Tạo sự kiện clearLS
  const clearLSEvent = new Event("clearLS");
  
  // Phát sự kiện
  LocalStorageEventTarget.dispatchEvent(clearLSEvent);
};

// Lắng nghe sự kiện "clearLS"
LocalStorageEventTarget.addEventListener("clearLS", () => {
  console.log("LocalStorage has been cleared!");
});

export const getAccessTokenFromLS = () => {
  const token = localStorage.getItem("accessToken");
  // console.log("Access Token từ localStorage:", token);
  return token || "";
};

export const getRefreshTokenFromLS = () => 
  localStorage.getItem("refreshToken") || "";

export const getProfileFromLS = () => {
  const result = localStorage.getItem("user");
  return result ? JSON.parse(result) : null;
};

export const setProfileToLS = (profile: any) => {
  localStorage.setItem("user", JSON.stringify(profile));
};

export const refreshAccessToken = async (): Promise<string | undefined> => {
  const refreshToken = getRefreshTokenFromLS();
  const response = await fetch("/api/refresh_token", {
    method: "POST",
    body: JSON.stringify({ refreshToken }),
    headers: { "Content-Type": "application/json" },
  });
  const data = await response.json();
  if (data?.accessToken) {
    setAccessTokenToLS(data.accessToken);
    return data.accessToken;
  }
  return undefined;
};

export const checkValidToken = (token: string | null) => {
  if (!token) return false;

  try {
    const decodedToken: { exp: number } = jwtDecode(token);
    const currentTime = Date.now() / 1000;
    return decodedToken.exp > currentTime;
  } catch (error) {
    console.error("Token không hợp lệ:", error);
    return false;
  }
};
