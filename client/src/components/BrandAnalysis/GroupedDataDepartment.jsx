import React, { useEffect, useState, useRef } from "react";
import Chart from "chart.js/auto";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { Bar, getElementAtEvent } from "react-chartjs-2";
import GroupedProductCategory from "./GroupedProductCategory";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import {
  Box,
  Button,
  Typography,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

Chart.register(ChartDataLabels);
const GoupedDataDepartment = ({
  originalData,
  selectedStore,
  selectedDepartment,
  handleBackButtonClick_Department,
}) => {
  const chartRef = useRef(null);
  const [groupedData, setGroupedData] = useState([]);
  const [labelvalue_BrandName, setlabelvalue_BrandName] = useState([]);
  const theme = useTheme();
  useEffect(() => {
    // Grouping and summing logic
    const groupData = () => {
      if (!Array.isArray(originalData) || !originalData.length) {
        console.log("Not an array or empty");
        return;
      }

      // Filter data based on selected store and department
      const filteredData = originalData.filter(
        (item) =>
          item.StoreName === selectedStore &&
          item.Department === selectedDepartment
      );

      // Modify the grouping logic based on the selected values
      const groupedData = filteredData.reduce((accumulator, item) => {
        const storeKey = item.StoreName;
        const departmentKey = item.Department;
        const brandNameKey = item.BrandName;

        // Create a unique key for each store, department, and brand name combination
        const key = `${storeKey}-${departmentKey}-${brandNameKey}`;

        if (!accumulator[key]) {
          accumulator[key] = {
            StoreName: storeKey,
            Department: departmentKey,
            BrandName: brandNameKey,
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

    // Call the grouping logic when the original data, selectedStore, or selectedDepartment changes
    groupData();
  }, [originalData, selectedStore, selectedDepartment]);

  const handleSortClick = () => {
    // Sort the data based on the "Amount" property
    const newSortedData = groupedData
      .slice()
      .sort((a, b) => b.Amount - a.Amount);

    // Update the state to trigger a re-render with the sorted data
    setGroupedData(newSortedData);
  };
  //   const dataGridRows = groupedData.map((data, index) => ({
  //     id: index,
  //     ProductCategory: data.ProductCategoryName,
  //     Amount: Math.round(parseFloat(data.Amount)),
  //     Quantity: data.Quantity,
  //   }));
  // console.log(dataGridRows)
  //   // Define columns for the DataGrid
  //   const dataGridColumns = [
  //     { field: 'ProductCategory', headerName: 'Product Category', flex: 1 },
  //     { field: 'Amount', headerName: 'Amount', flex: 1 },
  //     { field: 'Quantity', headerName: 'Quantity', flex: 1 },
  //   ];
  const handleBackButtonClick = () => {
    // Perform any necessary logic in the child component
    // ...

    // Call the callback function passed from the parent
    handleBackButtonClick_Department();
  };
  const [conditionForProductcat, setConditionForProductcat] = useState(false);
  const handleBackButtonClick_Brand = () => {
    setConditionForProductcat(false); // Set condition to null when back button is clicked
  };
  const handleClick = (e) => {
    // console.log("event,", getElementAtEvent(chartRef.current, e));
    const currindex = getElementAtEvent(chartRef.current, e)[0].index;
    // console.log(currindex);
    const value = groupedData[currindex].BrandName;
    // console.log(value)
    setlabelvalue_BrandName(value);
    setConditionForProductcat(true);
  };
  useEffect(() => {
    // This block will run every time labelvalue changes
    console.log("Labelvalue", labelvalue_BrandName);
  }, [labelvalue_BrandName]);
  // console.log(groupedData);
  const barChart = groupedData[0] ? (
    <Bar
      data={{
        labels: groupedData.map((data) => data.BrandName),
        datasets: [
          {
            data: groupedData.map((data) =>
              Math.round(parseFloat(data.Amount))
            ),
            label: "Amount",
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
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "top",
            labels: {
              boxWidth: 30,
              font: {
                size: 8,
              },
              color: "white",
            },
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
            text: `Total Forecasted Sales of ${selectedStore} >> ${selectedDepartment} By Brand Name`,
            color: "white",
            font: { size: "10" },
          },
        },
        scales: {
          x: {
            grid: {
              display: false,
            },
            ticks: {
              color: theme.palette.secondary[200],
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
              color: theme.palette.secondary[200],
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
    <>
      {/* Top section with buttons */}
      <div>
        {/* Bottom section with additional content */}
        {conditionForProductcat ? (
          <GroupedProductCategory
            originalData={originalData}
            selectedStore={selectedStore}
            selectedDepartment={selectedDepartment}
            labelvalue_BrandName={labelvalue_BrandName}
            handleBackButtonClick_Brand={handleBackButtonClick_Brand}
          />
        ) : (
          <Box
            mt="20px"
            display="grid"
            gridTemplateColumns="repeat(12, 1fr)"
            gridAutoRows="auto" // Adjust the row size as needed
            gap="20px"
          >
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
            <Box
              gridColumn="span 12"
              gridRow="span 1"
              backgroundColor={theme.palette.background.alt}
              p=".2rem"
              borderRadius="0.55rem"
              sx={{ height: "80vh", width: "100%", mb: 5 }}
            >
              {barChart}
            </Box>
          </Box>
        )}
      </div>
    </>
  );
};

export default GoupedDataDepartment;