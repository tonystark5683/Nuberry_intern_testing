import React, { useState, useEffect, useRef } from "react";
import Chart from "chart.js/auto";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { Bar, getElementAtEvent } from "react-chartjs-2";
import FlexBetween from "components/FlexBetween";
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
const GroupedProductCategory = ({
  originalData,
  selectedStore,
  selectedDepartment,
  labelvalue_BrandName,
  handleBackButtonClick_Brand,
}) => {
  const [groupedData, setGroupedData] = useState([]);
  const theme = useTheme();
  useEffect(() => {
    // Grouping and summing logic
    const groupData = () => {
      if (!Array.isArray(originalData) || !originalData.length) {
        console.log("Not an array or empty");
        return;
      }

      // Filter data based on selected store, department, and brand
      const filteredData = originalData.filter(
        (item) =>
          item.StoreName === selectedStore &&
          item.Department === selectedDepartment &&
          item.BrandName === labelvalue_BrandName
      );

      // Modify the grouping logic based on the selected values
      const groupedData = filteredData.reduce((accumulator, item) => {
        const storeKey = item.StoreName;
        const departmentKey = item.Department;
        const brandNameKey = item.BrandName;
        const productCategoryKey = item.ProductCategoryName;

        // Create a unique key for each store, department, brand name, and product category combination
        const key = `${storeKey}-${departmentKey}-${brandNameKey}-${productCategoryKey}`;

        if (!accumulator[key]) {
          accumulator[key] = {
            StoreName: storeKey,
            Department: departmentKey,
            BrandName: brandNameKey,
            ProductCategoryName: productCategoryKey,
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

    // Call the grouping logic when the original data, selectedStore, selectedDepartment, or selectedBrand changes
    groupData();
  }, [originalData, selectedStore, selectedDepartment, labelvalue_BrandName]);
  console.log(groupedData);
  const handleSortClick = () => {
    // Sort the data based on the "Amount" property
    const newSortedData = groupedData
      .slice()
      .sort((a, b) => b.Amount - a.Amount);

    // Update the state to trigger a re-render with the sorted data
    setGroupedData(newSortedData);
  };
  const handleBackButtonClick = () => {
    // Perform any necessary logic in the child component
    // ...

    // Call the callback function passed from the parent
    handleBackButtonClick_Brand();
  };
  const sortedData = groupedData.sort((a, b) => {
    const totalQuantityA = groupedData
      .filter((item) => item.ProductCategoryName === a.ProductCategoryName)
      .reduce((total, item) => total + parseFloat(item.Amount), 0);
  
    const totalQuantityB = groupedData
      .filter((item) => item.ProductCategoryName === b.ProductCategoryName)
      .reduce((total, item) => total + parseFloat(item.Amount), 0);
  
    return totalQuantityB - totalQuantityA;
  });
  
  const top20Data = sortedData.slice(0, 20);
  const totalAmount = groupedData.reduce(
    (sum, item) => sum + Math.round(parseFloat(item.Amount)),
    0
  );
  const formattedTotalAmount = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0, // Remove decimal part
    minimumFractionDigits: 0, // Ensure at least 0 decimal places
    useGrouping: true, // Enable grouping separator
  }).format(totalAmount);
  const barChart = groupedData[0] ? (
    <Bar
      data={{
        labels: top20Data.map((data) => data.ProductCategoryName),
        datasets: [
          {
            data: top20Data.map((data) =>
              Math.round(parseFloat(data.Amount))
            ),
            label: "Amount",
            backgroundColor: "rgba(0, 217, 255, 0.6)",
            borderColor: "rgba(0, 217, 255, 1)",
            borderWidth: 1,
            maxBarThickness: 100,
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
            text: `Total Forecasted Sales of ${selectedStore} >> ${selectedDepartment} >> ${labelvalue_BrandName} By Product Category`,

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
              maxRotation: 90,
              minRotation: 90, // Set maxRotation to 90 degrees for vertical ticks
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
      // ref={chartRef}
      // onClick={handleClick}
    />
  ) : null;
  return (
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
          <Typography variant="h4">Overall Sales: </Typography>
          <Typography
            variant="h5"
            sx={{ color: theme.palette.secondary.light }}
          >
            {formattedTotalAmount}
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
  );
};

export default GroupedProductCategory;
