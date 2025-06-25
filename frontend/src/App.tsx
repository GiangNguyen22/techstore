import React, { useEffect,useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setAuthData, setAuthLoading } from "./reducer/auth";
import { getUserProfile } from "./api/auth";
import { RootState } from "./stores/store";
import useRouterElement from "./hooks/useRouterElement";
import { useNavigate } from "react-router-dom";
function App() {
  const routeElement = useRouterElement();
    const dispatch = useDispatch();
  const [token, setToken] = useState(
    () => localStorage.getItem("accessToken") || ""
  );
  const [username, setUsername] = useState<string | null>(null);
  const isAdmin = useSelector((state: RootState) => state.auth.isAdmin);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await getUserProfile();
        if (!res) return;
        // console.log("📦 API profile result:", res);

        setUsername(res.name);
        dispatch(
          setAuthData({
            username: res.name,
            token: token,
            isAdmin:
              res.role?.name === "ROLE_ADMIN" ||
              res.role?.authority === "ROLE_ADMIN",
          })
        );
      } catch (err) {
        console.error("Lỗi lấy profile:", err);
      }
    };

    fetchProfile();
  }, [dispatch, token]);
  return <>{routeElement}</>;
}

export default App;
