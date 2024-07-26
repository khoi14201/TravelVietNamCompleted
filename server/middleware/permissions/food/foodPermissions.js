import checkOwner from "./checkOwner.js";

const foodPermissions = {
  update: {
    roles: ["admin", "editor"],
    owner: checkOwner,
  },
  delete: {
    roles: ["admin", "editor"],
    owner: checkOwner,
  },
};

export default foodPermissions;
