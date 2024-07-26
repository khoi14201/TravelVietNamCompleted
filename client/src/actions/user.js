import uploadFile from "../firebase/uploadFile";
import fetchData from "./utills/fetchData";
import { v4 as uuidv4 } from "uuid";

const url = process.env.REACT_APP_SERVER_URL + "/user";

export const register = async (user, dispatch) => {
  dispatch({ type: "START_LOADING" });

  const result = await fetchData(
    { url: url + "/register", body: user },
    dispatch
  );
  if (result) {
    dispatch({ type: "UPDATE_USER", payload: result });
    dispatch({ type: "CLOSE_LOGIN" });
    dispatch({
      type: "UPDATE_ALERT",
      payload: {
        open: true,
        severity: "success",
        message: "Bạn đã tạo tài khoản thành công!",
      },
    });
  }

  dispatch({ type: "END_LOADING" });
};

export const login = async (user, dispatch) => {
  dispatch({ type: "START_LOADING" });

  const result = await fetchData({ url: url + "/login", body: user }, dispatch);
  if (result) {
    dispatch({ type: "UPDATE_USER", payload: result });
    dispatch({ type: "CLOSE_LOGIN" });
  }

  dispatch({ type: "END_LOADING" });
};

export const updateProfile = async (currentUser, updateFields, dispatch) => {
  dispatch({ type: "START_LOADING" });

  const { name, file } = updateFields;
  let body = { name };
  try {
    if (file) {
      const imageName = uuidv4() + "." + file?.name?.split(".")?.pop();
      const photoURL = await uploadFile(
        file,
        `profile/${currentUser?.id}/${imageName}`
      );
      body = { ...body, photoURL };
    }
    const result = await fetchData(
      {
        url: url + "/updateProfile",
        method: "PATCH",
        body,
        token: currentUser.token,
      },
      dispatch
    );
    if (result) {
      dispatch({ type: "UPDATE_USER", payload: { ...currentUser, ...result } });
      dispatch({
        type: "UPDATE_ALERT",
        payload: {
          open: true,
          severity: "success",
          message: "Cập nhật hồ sơ thành công!",
        },
      });
      dispatch({
        type: "UPDATE_PROFILE",
        payload: { open: false, file: null, photoURL: result.photoURL },
      });
    }
  } catch (error) {
    dispatch({
      type: "UPDATE_ALERT",
      payload: {
        open: true,
        severity: "error",
        message: error.message,
      },
    });
    console.log(error);
  }

  dispatch({ type: "END_LOADING" });
};

export const getUsers = async (dispatch, currentUser) => {
  const result = await fetchData(
    { url, method: "GET", token: currentUser.token },
    dispatch
  );
  console.log("Fetched users:", result);
  if (result) {
    dispatch({ type: "UPDATE_USERS", payload: result });
  }
};

export const updateStatus = (updatedFields, userId, dispatch, currentUser) => {
  return fetchData(
    {
      url: `${url}/updateStatus/${userId}`,
      method: "PATCH",
      token: currentUser.token,
      body: updatedFields,
    },
    dispatch
  );
};

export const logout = (dispatch) => {
  dispatch({ type: "UPDATE_USER", payload: null });
  dispatch({ type: "RESET_FOOD" });
  dispatch({ type: "UPDATE_USERS", payload: [] });
};