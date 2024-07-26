import Food from "../../../models/Food.js";

const checkOwner = async (req) => {
  try {
    const food = await Food.findOne({
      _id: req.params.foodId,
      uid: req.user.id,
    });
    if (food) return true;
    return false;
  } catch (error) {
    console.log(error);
    return "error";
  }
};

export default checkOwner;
