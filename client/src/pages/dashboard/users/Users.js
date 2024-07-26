import { Avatar, Box, Typography } from "@mui/material";
import React, { useEffect, useMemo, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { useValue } from "../../../context/ContextProvider";
import { getUsers } from "../../../actions/user";
import moment from "moment";
import { grey } from "@mui/material/colors";
import UsersActions from "./UsersActions";

const Users = ({ setSelectedLink, link }) => {
  const {
    state: { users, currentUser },
    dispatch,
  } = useValue();

  const [pageSize, setPageSize] = useState(5);
  const [rowId, setRowId] = useState(null);

  useEffect(() => {
    setSelectedLink(link);
    if (users.length === 0) getUsers(dispatch, currentUser);
  }, [link, setSelectedLink, users.length, dispatch]);

  const columns = useMemo(
    () => [
      {
        field: "photoURL",
        headerName: "Avatar",
        width: 60,
        renderCell: (params) => <Avatar src={params.row.photoURL} />,
        sortable: false,
        filterable: false,
      },
      { field: "name", headerName: "Tên", width: 170 },
      { field: "email", headerName: "Email", width: 200 },
      {
        field: "role",
        headerName: "Quyền",
        width: 100,
        type: "singleSelect",
        valueOptions: ["basic", "editor", "admin"],
        editable: currentUser?.role === "admin",
      },
      {
        field: "active",
        headerName: "Active",
        width: 100,
        type: "boolean",
        editable: currentUser?.role === "admin",
      },
      {
        field: "createdAt",
        headerName: "Tạo lúc",
        width: 200,
        renderCell: (params) =>
          moment(params.row.createdAt).format("YYYY-MM-DD HH:MM:SS"),
      },
      { field: "_id", headerName: "Id", width: 220 },
      {
        field: "actions",
        headerName: "Actions",
        type: "actions",
        renderCell: (params) => (
          <UsersActions {...{ params, rowId, setRowId }} />
        ),
      },
    ],
    [rowId]
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
        Quản lý người dùng
      </Typography>

      <DataGrid
        rows={users}
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
        onCellEditStart={(params) => setRowId(params.id)}
      />
    </Box>
  );
};

export default Users;
