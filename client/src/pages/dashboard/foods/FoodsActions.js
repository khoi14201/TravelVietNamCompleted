import { Box, IconButton, Tooltip } from "@mui/material";
import { Delete, Edit, Preview } from "@mui/icons-material";
import { useValue } from "../../../context/ContextProvider";
import { clearFood, deleteFood } from "../../../actions/food";
import { useNavigate } from "react-router-dom";

const FoodsActions = ({ params }) => {
  const { _id, lng, lat, price, title, description, images, uid } = params.row;
  const {
    dispatch,
    state: { currentUser, updatedFood, addedImages, images: newImages },
  } = useValue();

  const navigate = useNavigate();
  const handleEdit = () => {
    if (updatedFood) {
      clearFood(dispatch, currentUser, addedImages, updatedFood);
    } else {
      clearFood(dispatch, currentUser, newImages);
    }

    dispatch({ type: "UPDATE_LOCATION", payload: { lng, lat } });
    dispatch({
      type: "UPDATE_DETAILS",
      payload: { price, title, description },
    });
    dispatch({ type: "UPDATE_IMAGES", payload: images });
    dispatch({ type: "UPDATE_UPDATED_FOOD", payload: { _id, uid } });
    dispatch({ type: "UPDATE_SECTION", payload: 2 });
    navigate("/");
  };

  return (
    <Box>
      <Tooltip title="Xem chi tiết">
        <IconButton
          onClick={() => dispatch({ type: "UPDATE_FOOD", payload: params.row })}
        >
          <Preview />
        </IconButton>
      </Tooltip>
      <Tooltip title="Chỉnh sửa">
        <IconButton onClick={handleEdit}>
          <Edit />
        </IconButton>
      </Tooltip>
      <Tooltip title="Xóa">
        <IconButton
          onClick={() => deleteFood(params.row, currentUser, dispatch)}
        >
          <Delete />
        </IconButton>
      </Tooltip>
    </Box>
  );
};

export default FoodsActions;
