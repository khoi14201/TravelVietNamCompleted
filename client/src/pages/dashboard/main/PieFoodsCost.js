import { Box, Stack, Typography } from "@mui/material";
import { PieChart, Pie, Cell, Tooltip } from "recharts";
import { useValue } from "../../../context/ContextProvider";
import { useEffect, useState } from "react";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28"];

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
}) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};
export default function PieFoodsCost() {
  const {
    state: { foods },
  } = useValue();
  const [costGroups, setCostGroups] = useState([]);

  useEffect(() => {
    let lessThan300 = 0,
      between300And600 = 0,
      moreThan600 = 0;
    foods.forEach((food) => {
      if (food.price < 300000) {
        lessThan300++;
      } else if (food.price <= 600000) {
        between300And600++;
      } else {
        moreThan600++;
      }
    });
    setCostGroups([
      { name: "Less Than 300.000 VND", qty: lessThan300 },
      { name: "Between 300.000 & 600.000 VND", qty: between300And600 },
      { name: "More Than 600.000 VND", qty: moreThan600 },
    ]);
  }, [foods]);

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-evenly",
        flexWrap: "wrap",
      }}
    >
      <PieChart width={400} height={400}>
        <Pie
          data={costGroups}
          cx={200}
          cy={200}
          labelLine={false}
          label={renderCustomizedLabel}
          outerRadius={80}
          fill="#8884d8"
          dataKey="qty"
        >
          {costGroups.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
      <Stack gap={2}>
        <Typography variant="h6">Foods Cost</Typography>
        <Box sx={{ display: "flex", gap: 3, flexWrap: "wrap" }}>
          {COLORS.map((color, i) => (
            <Stack key={color} alignItems="center" spacing={1}>
              <Box sx={{ width: 20, height: 20, background: color }} />
              <Typography variant="body2" sx={{ opacity: 0.7 }}>
                {costGroups[i]?.name}
              </Typography>
            </Stack>
          ))}
        </Box>
      </Stack>
    </Box>
  );
}
