import React, { useState } from "react";
import { FormControl, MenuItem, InputLabel, Box, Select } from "@mui/material";
import Header from "components/Header";
import OverviewChart from "components/OverviewChart";
import ForecastGraph from "components/ForecastGraph"
import ForecastTable from "components/ForecastTable";

const Overview = () => {
  const [view, setView] = useState("units");

  return (
    <Box m=".5rem 1.5rem">
      {/* <Header
        title="FORECAST"
        subtitle="Forecast Based on Quantity and Amount"
      /> */}
      <Box height="75vh">
        {/* <FormControl sx={{ mt: "1rem" }}>
          <InputLabel>View</InputLabel>
          <Select
            value={view}
            label="View"
            onChange={(e) => setView(e.target.value)}
          >
            <MenuItem value="sales">Quantity</MenuItem>
            <MenuItem value="units">Amount</MenuItem>
          </Select>
        </FormControl>
        <OverviewChart view={view} /> */}
        {/* <ForecastGraph/> */}
        <Box width='100%'><ForecastTable/></Box>
      </Box>
      
    </Box>
  );
};

export default Overview;
