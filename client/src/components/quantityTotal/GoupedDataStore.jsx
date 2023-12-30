import React, { useEffect, useState, useRef } from "react";
import Chart from "chart.js/auto";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { Bar, getElementAtEvent } from "react-chartjs-2";
import GroupedDataDepartment from "./GroupedDataDepartment";
import FlexBetween from "components/FlexBetween";
import {
  Box,
  Button,
  Typography,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);
Chart.register(ChartDataLabels);
const GroupedDataStore = ({ originalData, labelvalue,onBackButtonClick }) => {
  const chartRef = useRef(null);
  const [labelvalue_Department, setlabelvalue_Department] = useState([]);
  const [groupedData, setGroupedData] = useState([]);
  const theme = useTheme();
  useEffect(() => {
    // Grouping and summing logic
    const groupData = () => {
      if (!Array.isArray(originalData) || !originalData.length) {
        console.log("Not an array or empty");
        return;
      }

      // Modify the grouping logic based on the labelvalue
      const filteredData = originalData.filter(
        (item) => item.StoreName === labelvalue
      );

      const groupedData = filteredData.reduce((accumulator, item) => {
        const storeKey = item.StoreName;
        const departmentKey = item.Department;

        // Create a unique key for each store and department combination
        const key = `${storeKey}-${departmentKey}`;

        if (!accumulator[key]) {
          accumulator[key] = {
            StoreName: storeKey,
            Department: departmentKey,
            Quantity: 0,
            Amount: 0,
          };
        }

        accumulator[key].Quantity += item.Quantity || 0;
        accumulator[key].Amount += item.Amount || 0;

        return accumulator;
      }, {});

      const groupedArray = Object.values(groupedData);

      setGroupedData(groupedArray);
    };

    // Call the grouping logic when the original data or labelvalue changes
    groupData();
  }, [originalData, labelvalue]);

  // console.log(groupedData);
  const handleSortClick = () => {
    // Sort the data based on the "Amount" property
    const newSortedData = groupedData.slice().sort((a, b) => b.Quantity - a.Quantity);

    // Update the state to trigger a re-render with the sorted data
    setGroupedData(newSortedData);
  };
  const [conditiondepart, setConditiondepart] = useState(false);
  const handleBackButtonClick_Department = () => {
    setConditiondepart(false); // Set condition to null when back button is clicked
  };
  const handleClick = (e) => {
    // console.log("event,", getElementAtEvent(chartRef.current, e));
    const currindex = getElementAtEvent(chartRef.current, e)[0].index;
    // console.log(currindex);
    const value = groupedData[currindex].Department;
    // console.log(value)
    setlabelvalue_Department(value);
    setConditiondepart(true);
  };
  useEffect(() => {
    // This block will run every time labelvalue changes
    // console.log("Labelvalue", labelvalue_Department);
  }, [labelvalue_Department]);
  const handleBackButtonClick = () => {
    onBackButtonClick();
  };
  const totalQuantiy = groupedData.reduce(
    (sum, item) => sum + Math.round(parseFloat(item.Quantity)),
    0
  );
  const formattedTotalQuantity = new Intl.NumberFormat("en-IN").format(totalQuantiy);
  
  const barChart = groupedData[0] ? (
    <Bar
      data={{
        labels: groupedData.map((data) => data.Department),
        datasets: [
          {
            data: groupedData.map((data) =>
              Math.round(parseFloat(data.Quantity))
            ),
            label: "Quantity",
            backgroundColor: "rgba(0, 217, 255, 0.6)",
            borderColor: "rgba(0, 217, 255, 1)",
            borderWidth: 1,
          },
          // {
          //   data: groupedData.map((data) => Math.round(parseFloat(data.Quantity))),
          //   label: 'Quantity',
          //   backgroundColor: 'rgba(0, 217, 255, 0.6)',
          //   borderColor: 'rgba(0, 217, 255, 1)',
          //   borderWidth: 1,
          // },
        ],
      }}
      options={{
        responsive: true,
        maintainAspectRatio:false,
        plugins: {
          legend: {
            position: "top",
            labels: {
              boxWidth: 30,
              font: {
                size: 8,
              },
              color: "white",
            }
          },
          datalabels: {
            display: true,
            color: "white",
            font: { size: "8" },
            formatter: Math.round,
            anchor: "end",
            offset: -20,
            align: "start",
          },
          title: {
            display: true,
            text: `Total Forecasted Quantity of ${labelvalue} By Department`,
            color: 'white',
                font: { size: "10" }
          },
        },
        scales: {
          x: {
            grid: {
              display: false,
            },
            ticks: {
              color: theme.palette.secondary[200] ,
              font: { size: "8" },
              maxRotation: 90, // Set maxRotation to 90 degrees for vertical ticks
              
            },
            gridLines: {
              color: "red",
            },

            axisColor: "rgb(255, 99, 132)",
          },
          y: {
            grid: {
              display: false,
            },
            gridLines: {
              color: "red",
            },
            ticks: {
              color: theme.palette.secondary[200] ,
              font: { size: "10" },
              maxRotation: 90, // Set maxRotation to 90 degrees for vertical ticks
              minRotation: 90,
            },
            axisColor: "rgb(255, 99, 132)",
          },
        },
      }}
      ref={chartRef}
      onClick={handleClick}
    />
  ) : null;
  return (
    <Box>
      {/* Render your grouped data here */}
      {/* {groupedData.map((data, index) => (
        <div key={index}>
          Store: {data.StoreName}, Department: {data.Department}, Quantity:{" "}
          {data.Quantity}, Amount: {Math.round(parseFloat(data.Amount))}
        </div>
      ))} */}

      
       {conditiondepart ? (
        <GroupedDataDepartment
        originalData={originalData}
        selectedStore={labelvalue}
        selectedDepartment={labelvalue_Department}
        handleBackButtonClick_Department={handleBackButtonClick_Department}
      ></GroupedDataDepartment> ) : (
        
        <Box
        mt="20px"
        display="grid"
        gridTemplateColumns="repeat(12, 1fr)"
        gridAutoRows="auto" // Adjust the row size as needed
        gap="20px"
      >
        <Box
          gridColumn="span 12"
          gridRow="span 1"
          display="flex"
          justifyContent="space-between"
          borderRadius="0.55rem"
        >
          <div>
            <Button
              variant="contained"
              onClick={handleSortClick}
              style={{ marginRight: "8px" }}
            >
              Sort
            </Button>
            <Button variant="contained" onClick={handleBackButtonClick}>
              Back
            </Button>
          </div>
          <Box
            display="flex"
            flexDirection="column"
            justifyContent="space-between"
            backgroundColor={theme.palette.background.alt}
            borderRadius="0.55rem"
            p=".2rem .5rem"
          >
            <FlexBetween gap="1.2rem">
              <Typography variant="h4">Overall Quantity: </Typography>
              <Typography
                variant="h5"
                sx={{ color: theme.palette.secondary.light }}
              >
               {formattedTotalQuantity}
              </Typography>
            </FlexBetween>
          </Box>
        </Box>
        <Box
          gridColumn="span 12"
          gridRow="span 2"
          backgroundColor={theme.palette.background.alt}
          p=".2rem"
          borderRadius="0.55rem"
          sx={{ height: "80vh", width: "100%", mb: 5 }}
        >
          {barChart}
        </Box>
      </Box>
        )}
    </Box>
  );
};

export default GroupedDataStore;
