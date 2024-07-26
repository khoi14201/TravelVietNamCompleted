import deleteImages from "./utills/deleteImages";
import fetchData from "./utills/fetchData";

const url = process.env.REACT_APP_SERVER_URL + "/food";

export const createFood = async (food, currentUser, dispatch) => {
  dispatch({ type: "START_LOADING" });

  const result = await fetchData(
    { url, body: food, token: currentUser?.token },
    dispatch
  );
  if (result) {
    dispatch({
      type: "UPDATE_ALERT",
      payload: {
        open: true,
        severity: "success",
        message: "Thêm khách sạn thành công!",
      },
    });
    clearFood(dispatch, currentUser);
    dispatch({ type: "UPDATE_SECTION", payload: 0 });
    dispatch({ type: "UPDATE_FOOD", payload: result });
  }

  dispatch({ type: "END_LOADING" });
};

export const getFoods = async (dispatch) => {
  const result = await fetchData({ url, method: "GET" }, dispatch);
  console.log("Fetched foods:", result);
  if (result) {
    dispatch({ type: "UPDATE_FOODS", payload: result });
  }
};

export const deleteFood = async (food, currentUser, dispatch) => {
  dispatch({ type: "START_LOADING" });

  const result = await fetchData(
    { url: `${url}/${food._id}`, method: "DELETE", token: currentUser?.token },
    dispatch
  );
  if (result) {
    dispatch({
      type: "UPDATE_ALERT",
      payload: {
        open: true,
        severity: "success",
        message: "Khách sạn đã được xóa!",
      },
    });

    dispatch({ type: "DELETE_FOOD", payload: result._id });
    deleteImages(food.images, food.uid);
  }

  dispatch({ type: "END_LOADING" });
};

export const updateFood = async (
  food,
  currentUser,
  dispatch,
  updatedFood,
  deletedImages
) => {
  dispatch({ type: "START_LOADING" });

  const result = await fetchData(
    {
      url: `${url}/${updatedFood._id}`,
      method: "PATCH",
      body: food,
      token: currentUser?.token,
    },
    dispatch
  );
  if (result) {
    dispatch({
      type: "UPDATE_ALERT",
      payload: {
        open: true,
        severity: "success",
        message: "Cập nhật khách sạn thành công!",
      },
    });

    clearFood(dispatch, currentUser, deletedImages, updatedFood);
    dispatch({ type: "UPDATE_SECTION", payload: 0 });
    dispatch({ type: "UPDATE_FOOD", payload: result });
  }

  dispatch({ type: "END_LOADING" });
};

export const clearFood = (
  dispatch,
  currentUser,
  images = [],
  updatedFood = null
) => {
  dispatch({ type: "RESET_FOOD" });
  localStorage.removeItem(currentUser.id);
  if (updatedFood) {
    deleteImages(images, updatedFood.uid);
  } else {
    deleteImages(images, currentUser.id);
  }
};

export const storeFood = (
  location,
  details,
  images,
  updatedFood,
  deletedImages,
  addedImages,
  userId
) => {
  if (
    location.lng ||
    location.lat ||
    details.price ||
    details.title ||
    details.description ||
    images.length
  ) {
    localStorage.setItem(
      userId,
      JSON.stringify({
        location,
        details,
        images,
        updatedFood,
        deletedImages,
        addedImages,
      })
    );
    return true;
  } else {
    return false;
  }
};
