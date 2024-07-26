import {
  BottomNavigation,
  BottomNavigationAction,
  Box,
  Paper,
} from "@mui/material";
import { AddLocationAlt, Fastfood, LocationOn } from "@mui/icons-material";
import { useEffect, useRef, useState } from "react";
import ClusterMap from "./map/ClusterMap";
import Food from "./food/Food";
import AddServices from "./addServices/AddServices";
import Protected from "./protected/Protected";
import { useValue } from "../context/ContextProvider";

const BottomNav = () => {
  const {
    state: { section },
    dispatch,
  } = useValue();
  const ref = useRef();
  useEffect(() => {
    ref.current.ownerDocument.body.scrollTop = 0;
  }, [section]);
  return (
    <Box ref={ref}>
      {
        {
          0: <ClusterMap />,
          1: <Food />,
          2: (
            <Protected>
              {" "}
              <AddServices />,
            </Protected>
          ),
        }[section]
      }
      <Paper
        elevation={3}
        sx={{ position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 2 }}
      >
        <BottomNavigation
          showLabels
          value={section}
          onChange={(e, newValue) =>
            dispatch({ type: "UPDATE_SECTION", payload: newValue })
          }
        >
          <BottomNavigationAction label="Map" icon={<LocationOn />} />
          <BottomNavigationAction label="Khách sạn" icon={<Fastfood />} />
          <BottomNavigationAction label="Thêm" icon={<AddLocationAlt />} />
        </BottomNavigation>
      </Paper>
    </Box>
  );
};

export default BottomNav;
