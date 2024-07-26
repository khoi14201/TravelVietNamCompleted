import { useEffect } from "react";
import { useValue } from "../context/ContextProvider";
import { jwtDecode } from "jwt-decode";
import { storeFood } from "../actions/food";
import { logout } from "../actions/user";

const useCheckToken = () => {
  const {
    state: {
      currentUser,
      location,
      details,
      images,
      updatedFood,
      deletedImages,
      addedImages,
    },
    dispatch,
  } = useValue();
  useEffect(() => {
    if (currentUser) {
      const decodedToken = jwtDecode(currentUser.token);
      if (decodedToken.exp * 1000 < new Date().getTime()) {
        storeFood(
          location,
          details,
          images,
          updatedFood,
          deletedImages,
          addedImages,
          currentUser.id
        );
        logout(dispatch);
      }
    }
  }, [currentUser, dispatch]);
};

export default useCheckToken;
