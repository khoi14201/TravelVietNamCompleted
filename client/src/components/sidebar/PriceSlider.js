import { Box, Slider, Typography } from "@mui/material";
import React from "react";
import { useValue } from "../../context/ContextProvider";

const marks = [
  { value: 0, label: "0K" },
  { value: 500000, label: "500K" },
  { value: 1000000, label: "1.000K" },
];

const PriceSlider = () => {
  const {
    state: { priceFilter },
    dispatch,
  } = useValue();

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN").format(price);
  };

  return (
    <Box sx={{ mt: 5 }}>
      <Typography>Tối đa: {formatPrice(priceFilter) + "VND"}</Typography>
      <Slider
        min={0}
        max={1000000}
        step={10000}
        defaultValue={250000}
        valueLabelDisplay="auto"
        marks={marks}
        value={priceFilter}
        onChange={(e, price) =>
          dispatch({ type: "FILTER_PRICE", payload: price })
        }
      />
    </Box>
  );
};

export default PriceSlider;
