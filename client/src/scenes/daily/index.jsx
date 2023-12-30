import React, { useEffect, useState, useRef } from "react";
import { Box, useTheme } from "@mui/material";
import Header from "components/Header";
import ByStore from "components/DailySales/Overview/ByStore";
const Daily = () => {

  return (
    <Box m=".5rem 1.5rem">
      <Header title="DAILY SALES"/>
      <Box height="75vh">
        <ByStore/>
      </Box>
    </Box>
  );
};

export default Daily;
