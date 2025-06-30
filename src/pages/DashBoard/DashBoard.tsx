import { useSelector } from "react-redux";
import { RootState } from "../../stores/store";
import Dialog from "./Dialog";
import Main from "./Main";
import Sidebar from "./Sidebar";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const DashBoard = () => {
  const isOpenDialog = useSelector(
    (state: RootState) => state.dialog.isOpenDialog
  );

  return (
    <div className="h-screen">
      <ToastContainer autoClose={2000} />
      {isOpenDialog && <Dialog />}
      <div className="flex bg-blue-50  gap-20 w-full h-full">
        <Sidebar />
        <Main />
      </div>
    </div>
  );
};

export default DashBoard;
