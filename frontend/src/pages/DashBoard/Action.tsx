import Button from "./Button";
import { useDispatch } from "react-redux";
import {
  setIdSelected,
  setOpenDialog,
  setTypeDialog,
} from "../../reducer/dialog.reducer";

const Action = ({ id }: { id: any }) => {
  const dispatch = useDispatch();

  const handleDelete = () => {
    dispatch(setOpenDialog(true));
    dispatch(setIdSelected(id));
    dispatch(setTypeDialog("delete"));
  };

  const handleEdit = () => {
    dispatch(setOpenDialog(true));
    dispatch(setIdSelected(id));
    dispatch(setTypeDialog("edit"));
  };

  return (
    <div className="flex gap-4">
      <Button onClick={handleEdit} className="p-3 bg-green-200 text-green-600">
        Edit
      </Button>
      <Button onClick={handleDelete} className="p-3 bg-red-200 text-gray-600">
        Delete
      </Button>
    </div>
  );
};

export default Action;
