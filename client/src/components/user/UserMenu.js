import { Dashboard, Logout, Settings } from "@mui/icons-material";
import { ListItemIcon, Menu, MenuItem } from "@mui/material";
import React, { useEffect } from "react";
import { useValue } from "../../context/ContextProvider";
import useCheckToken from "../../hooks/useCheckToken";
import Profile from "./Profile";
import { useNavigate } from "react-router-dom";
// import { storeFood } from "../../actions/food";
// import { logout } from "../../actions/user";

const UserMenu = ({ anchorUserMenu, setAnchorUserMenu }) => {
  useCheckToken();
  const {
    dispatch,
    state: {
      currentUser,
      location,
      details,
      images,
      updatedFood,
      deletedImages,
      addedImages,
    },
  } = useValue();
  const handleCloseUserMenu = () => {
    setAnchorUserMenu(null);
  };

  const navigate = useNavigate();

  // const handleLogout = () => {
  //   storeFood(
  //     location,
  //     details,
  //     images,
  //     updatedFood,
  //     deletedImages,
  //     addedImages,
  //     currentUser.id
  //   );
  //   logout(dispatch);
  // };

  // useEffect(() => {
  //   const storeBeforeLeave = (e) => {
  //     if (
  //       storeFood(
  //         location,
  //         details,
  //         images,
  //         updatedFood,
  //         deletedImages,
  //         addedImages,
  //         currentUser.id
  //       )
  //     ) {
  //       e.preventDefault();
  //       e.returnValue = true;
  //     }
  //   };

  //   window.addEventListener("beforeunload", storeBeforeLeave);
  //   return () => window.removeEventListener("beforeunload", storeBeforeLeave);
  // }, [location, details, images]);
  return (
    <>
      <Menu
        anchorEl={anchorUserMenu}
        open={Boolean(anchorUserMenu)}
        onClose={handleCloseUserMenu}
        onClick={handleCloseUserMenu}
      >
        {!currentUser.google && (
          <MenuItem
            onClick={() =>
              dispatch({
                type: "UPDATE_PROFILE",
                payload: {
                  open: true,
                  file: null,
                  photoURL: currentUser?.photoURL,
                },
              })
            }
          >
            <ListItemIcon>
              <Settings fontSize="small" />
            </ListItemIcon>
            Hồ sơ
          </MenuItem>
        )}
        <MenuItem onClick={() => navigate("dashboard")}>
          <ListItemIcon>
            <Dashboard fontSize="small" />
          </ListItemIcon>
          Dashboard
        </MenuItem>

        <MenuItem
          onClick={() => dispatch({ type: "UPDATE_USER", payload: null })}
        >
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          Đăng xuất
        </MenuItem>
      </Menu>
      <Profile />
    </>
  );
};

export default UserMenu;
