import { Google } from "@mui/icons-material";
import { Button } from "@mui/material";
import React, { useState } from "react";
import { useValue } from "../../context/ContextProvider";
import { jwtDecode } from "jwt-decode";

const GoogleOneTapLogin = () => {
  const { dispatch } = useValue();
  const [disabled, setDisabled] = useState(false);

  const handleResponse = (response) => {
    const token = response.credential;
    const decodeToken = jwtDecode(token);
    const { sub: id, email, name, picture: photoURL } = decodeToken;
    dispatch({
      type: "UPDATE_USER",
      payload: {
        id,
        email,
        name,
        photoURL,
        token,
        google: true,
        role: "basic",
      },
    });
    dispatch({ type: "CLOSE_LOGIN" });
  };
  const handleGoogleLogin = () => {
    setDisabled(true);
    try {
      window.google.accounts.id.initialize({
        client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID,
        callback: handleResponse,
        ux_mode: "popup",
      });
      window.google.accounts.id.prompt((notification) => {
        if (notification.isNotDisplayed()) {
          throw new Error("Try to clear the cookies or try again later!");
        }
        if (
          notification.isSkippedMoment() ||
          notification.isDismissedMoment()
        ) {
          setDisabled(false);
        }
      });
    } catch (error) {
      dispatch({
        type: "UPDATE_ALERT",
        payload: { open: true, severity: "error", message: error.message },
      });
      console.log(error);
    }
  };
  return (
    <Button
      variant="outlined"
      startIcon={<Google />}
      disabled={disabled}
      onClick={handleGoogleLogin}
    >
      Đăng nhập bằng Google
    </Button>
  );
};

export default GoogleOneTapLogin;
