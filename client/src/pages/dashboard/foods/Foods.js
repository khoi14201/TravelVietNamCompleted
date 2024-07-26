import { Avatar, Box, Tooltip, Typography } from "@mui/material";
import React, { useEffect, useMemo, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { useValue } from "../../../context/ContextProvider";
import { getFoods } from "../../../actions/food";
import moment from "moment";
import { grey } from "@mui/material/colors";
import FoodsActions from "./FoodsActions";
import isAdmin from "../utils/isAdmin";

const Foods = ({ setSelectedLink, link }) => {
  const {
    state: { foods, currentUser },
    dispatch,
  } = useValue();

  const [pageSize, setPageSize] = useState(5);

  useEffect(() => {
    setSelectedLink(link);
    if (foods.length === 0) getFoods(dispatch);
  }, [link, setSelectedLink, foods.length, dispatch]);

  const columns = useMemo(
    () => [
      {
        field: "images",
        headerName: "Ảnh",
        width: 70,
        renderCell: (params) => (
          <Avatar src={params.row.images[0]} variant="rounded" />
        ),
        sortable: false,
        filterable: false,
      },
      {
        field: "price",
        headerName: "Giá",
        width: 110,
        renderCell: (params) =>
          params.row.price.toLocaleString("vi-VN") + " VND",
      },
      { field: "title", headerName: "Tên", width: 200 },
      { field: "description", headerName: "Mô tả", width: 230 },
      { field: "lng", headerName: "Kinh độ", width: 110 },
      { field: "lat", headerName: "Vĩ độ", width: 110 },

      {
        field: "uName",
        headerName: "Thêm bởi",
        width: 80,
        renderCell: (params) => (
          <Tooltip title={params.row.uName}>
            <Avatar src={params.row.uPhoto} />
          </Tooltip>
        ),
      },
      {
        field: "createdAt",
        headerName: "Thêm lúc",
        width: 180,
        renderCell: (params) =>
          moment(params.row.createdAt).format("YYYY-MM-DD HH:MM:SS"),
      },
      { field: "_id", hide: true },
      {
        field: "actions",
        headerName: "Actions",
        type: "actions",
        width: 140,
        renderCell: (params) => <FoodsActions {...{ params }} />,
      },
    ],
    []
  );

  return (
    <Box
      sx={{
        height: 400,
        width: "100%",
      }}
    >
      <Typography
        variant="h3"
        component="h3"
        sx={{ textAlign: "center", mt: 3, mb: 3 }}
      >
        Quản lý khách sạn
      </Typography>

      <DataGrid
        rows={
          isAdmin(currentUser)
            ? foods
            : foods.filter((food) => food.uid === currentUser.id)
        }
        columns={columns}
        pageSize={pageSize}
        pageSizeOptions={[5, 10, 20]}
        rowsPerPageOptions={[5, 10, 25]}
        onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
        getRowId={(row) => row._id}
        getRowSpacing={(params) => ({
          top: params.isFirstVisible ? 0 : 5,
          bottom: params.isLastVisible ? 0 : 5,
        })}
        sx={{
          "& .MuiDataGrid-row": {
            backgroundColor: (theme) =>
              theme.palette.mode === "light" ? grey[200] : grey[900],
          },
        }}
      />
    </Box>
  );
};

export default Foods;
