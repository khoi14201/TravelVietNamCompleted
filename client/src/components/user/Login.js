import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  TextField,
} from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { useValue } from "../../context/ContextProvider";
import { Close, Send } from "@mui/icons-material";
import PasswordField from "./PasswordField";
import GoogleOneTapLogin from "./GoogleOneTapLogin";
import { login, register } from "../../actions/user";

const Login = () => {
  const {
    state: { openLogin },
    dispatch,
  } = useValue();
  const [title, setTitle] = useState("Đăng ký");
  const [isRegister, setIsRegister] = useState(false);
  const nameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();
  const confirmPasswordRef = useRef();

  const handleClose = () => {
    dispatch({ type: "CLOSE_LOGIN" });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const email = emailRef.current.value;
    const password = passwordRef.current.value;
    if (!isRegister) return login({ email, password }, dispatch);
    const name = nameRef.current.value;
    const confirmPassword = confirmPasswordRef.current.value;
    if (password !== confirmPassword)
      return dispatch({
        type: "UPDATE_ALERT",
        payload: {
          open: true,
          severity: "error",
          message: "Mật khẩu không trùng khớp",
        },
      });
    register({ name, email, password }, dispatch);
    // send register request
  };

  useEffect(() => {
    isRegister ? setTitle("Đăng ký") : setTitle("Đăng nhập");
  }, [isRegister]);

  return (
    <Dialog open={openLogin} onClose={handleClose}>
      <DialogTitle>
        {title}
        <IconButton
          sx={{
            position: "absolute",
            top: 8,
            right: 8,
            color: (theme) => theme.palette.grey[500],
          }}
          onClick={handleClose}
        >
          <Close />
        </IconButton>
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <DialogContentText>
            Vui lòng điền các thông tin bên dưới
          </DialogContentText>
          {isRegister && (
            <TextField
              autoFocus
              margin="normal"
              id="name"
              label="Tên"
              type="text"
              fullWidth
              inputRef={nameRef}
              inputProps={{ minLength: 2 }}
              required
            />
          )}
          <TextField
            autoFocus={!isRegister}
            margin="normal"
            id="email"
            label="Email"
            type="email"
            fullWidth
            inputRef={emailRef}
            inputProps={{ minLength: 2 }}
            required
          />
          <PasswordField {...{ passwordRef }} />
          {isRegister && (
            <PasswordField
              passwordRef={confirmPasswordRef}
              id="confirmPassword"
              label="Nhập lại mật khẩu"
            />
          )}
        </DialogContent>
        <DialogActions sx={{ px: "23px" }}>
          <Button type="submit" variant="contained" endIcon={<Send />}>
            Tiếp tục
          </Button>
        </DialogActions>
      </form>
      <DialogActions sx={{ justifyContent: "left", p: "5px 24px" }}>
        {isRegister ? "Bạn đã có tài khoản? " : "Bạn chưa có tài khoản? "}
        <Button onClick={() => setIsRegister(!isRegister)}>
          {isRegister ? "Đăng nhập" : "Đăng ký"}
        </Button>
      </DialogActions>
      <DialogActions sx={{ justifyContent: "center", py: "24px" }}>
        <GoogleOneTapLogin />
      </DialogActions>
    </Dialog>
  );
};

export default Login;
