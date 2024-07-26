import { GroupTwoTone, KingBedTwoTone } from "@mui/icons-material";
import {
  Avatar,
  Box,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Paper,
  Typography,
} from "@mui/material";
import React, { useEffect } from "react";
import { useValue } from "../../../context/ContextProvider";
import { getFoods } from "../../../actions/food";
import { getUsers } from "../../../actions/user";
import moment from "moment";
import PieFoodsCost from "./PieFoodsCost";
import AreaFoodsUsers from "./AreaFoodsUsers";

const Main = ({ setSelectedLink, link }) => {
  const {
    state: { foods, users, currentUser },
    dispatch,
  } = useValue();

  useEffect(() => {
    setSelectedLink(link);
    if (foods.length === 0) getFoods(dispatch);
    if (users.length === 0) getUsers(dispatch, currentUser);
  }, [dispatch, foods.length, users.length, link, setSelectedLink]);

  return (
    <Box
      sx={{
        display: { xs: "flex", md: "grid" },
        gridTemplateColumns: "repeat(3,1fr)",
        gridAutoRows: "minnmax(100px, auto)",
        gap: 3,
        textAlign: "center",
        flexDirection: "column",
      }}
    >
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h4">Tổng số người dùng</Typography>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <GroupTwoTone sx={{ height: 100, width: 100, opacity: 0.3, mr: 1 }} />
          <Typography variant="h4">{users.length}</Typography>
        </Box>
      </Paper>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h4">Tổng số khách sạn</Typography>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <KingBedTwoTone
            sx={{ height: 100, width: 100, opacity: 0.3, mr: 1 }}
          />
          <Typography variant="h4">{foods.length}</Typography>
        </Box>
      </Paper>
      <Paper elevation={3} sx={{ p: 2, gridColumn: 3, gridRow: "1/4" }}>
        <Box>
          <Typography>Người dùng được thêm gần đây</Typography>
          <List>
            {users.slice(0, 4).map((user, i) => (
              <Box key={user._id}>
                <ListItem>
                  <ListItemAvatar>
                    <Avatar alt={user?.name} src={user?.photoURL} />
                  </ListItemAvatar>
                  <ListItemText
                    primary={user?.name}
                    secondary={`Time created: ${moment(user?.createdAt).format(
                      "YYYY-MM-DD H:mm:ss"
                    )}`}
                  />
                </ListItem>
                {i !== 3 && <Divider variant="inset" />}
              </Box>
            ))}
          </List>
        </Box>
        <Divider sx={{ mt: 3, mb: 3, opacity: 0.7 }} />
        <Box>
          <Typography>Khách sạn được thêm gần đây</Typography>
          <List>
            {foods.slice(0, 4).map((food, i) => (
              <Box key={food._id}>
                <ListItem>
                  <ListItemAvatar>
                    <Avatar
                      alt={food?.title}
                      src={food?.images[0]}
                      variant="rounded"
                    />
                  </ListItemAvatar>
                  <ListItemText
                    primary={food?.title}
                    secondary={`Added: ${moment(food?.createdAt).fromNow()}`}
                  />
                </ListItem>
                {i !== 3 && <Divider variant="inset" />}
              </Box>
            ))}
          </List>
        </Box>
      </Paper>
      <Paper elevation={3} sx={{ p: 2, gridColumn: "1/3" }}>
        <PieFoodsCost />
      </Paper>
      <Paper elevation={3} sx={{ p: 2, gridColumn: "1/3" }}>
        <AreaFoodsUsers />
      </Paper>
    </Box>
  );
};

export default Main;
