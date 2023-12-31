import React, { useState, useEffect, useRef } from "react";
import ByBrandName from "./ByBrandName";
import Chart from "chart.js/auto";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { Bar, getElementAtEvent } from "react-chartjs-2";
import { baseColors } from "theme";
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
const ByProductCategory = ({
  originalData,
  storeNameValue,
  departmentNameValue,
  handleBackButtonClick_Department,
}) => {
  const [groupedData, setGroupedData] = useState([]);
  const [productCategoryNameValue, setProductCategoryNameValue] = useState([]);
  const chartRef = useRef(null);
  const theme= useTheme();
  useEffect(() => {
    // Grouping and summing logic
    const groupData = () => {
      if (!Array.isArray(originalData) || !originalData.length) {
        console.log("Not an array or empty");
        return;
      }

      // Filter data for the selected store and department
      const filteredData = originalData.filter(
        (item) =>
          item.StoreName === storeNameValue &&
          item.Department === departmentNameValue
      );

      // Group data by ProductCategory and month for the selected store and department
      const groupedData = filteredData.reduce((accumulator, item) => {
        const productCategoryKey = item.ProductCategoryName;
        const monthKey = new Date(item.BillDate).toLocaleString("en-US", {
          month: "long",
        });
        const departmentKey = item.Department;
        // Create a unique key for each ProductCategory and month combination
        const key = `${productCategoryKey}-${monthKey}`;

        if (!accumulator[key]) {
          accumulator[key] = {
            Department: departmentKey,
            ProductCategoryName: productCategoryKey,
            Month: monthKey,
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

    // Call the grouping logic when the original data or selectedStore or selectedDepartment changes
    groupData();
  }, [originalData, storeNameValue, departmentNameValue]);

  //   console.log(groupedData);
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
    handleBackButtonClick_Department();
  };
  const [conditionbrand, setConditionbrand] = useState(false);
  const handleBackButtonClick_Brand = () => {
    setConditionbrand(false); // Set condition to null when back button is clicked
  };
  const handleClick = (e) => {
    const currindex = getElementAtEvent(chartRef.current, e)[0].index;
    const currdatasetIndex = getElementAtEvent(chartRef.current, e)[0]
      .datasetIndex;
    const labels = chartRef.current.data.labels;
    const month = labels[currindex];
    const datasets = chartRef.current.data.datasets;
    const productCategoryName = datasets[currdatasetIndex].label;
    //   console.log("Clicked values",month,productCategoryName)
    //  setMonthNameValue(month)
    setProductCategoryNameValue(productCategoryName);
    setConditionbrand(true);
  };
  useEffect(() => {
    // console.log("Labelvalue", productCategoryNameValue);
  }, [productCategoryNameValue]);

  const uniqueMonths = [...new Set(groupedData.map((item) => item.Month))];
  const uniqueProductCategories = [
    ...new Set(groupedData.map((item) => item.ProductCategoryName)),
  ];
  //   console.log(uniqueMonths,uniqueProductCategories)
  // Prepare data for the chart
  const sortedProductCategories = uniqueProductCategories.sort((a, b) => {
    const totalQuantityA = groupedData
      .filter((item) => item.ProductCategoryName === a)
      .reduce((total, item) => total + item.Quantity, 0);
  
    const totalQuantityB = groupedData
      .filter((item) => item.ProductCategoryName === b)
      .reduce((total, item) => total + item.Quantity, 0);
  
    return totalQuantityB - totalQuantityA;
  });
  
  // Take only the top ten product categories
  const topTenProductCategories = sortedProductCategories.slice(0, 20);
  
  // Prepare data for the chart
  const datasets = topTenProductCategories.map((productCategory, index) => ({
    label: productCategory,
    data: uniqueMonths.map((month) => {
      const dataPoint = groupedData.find(
        (item) =>
          item.ProductCategoryName === productCategory && item.Month === month
      );
      return dataPoint ? dataPoint.Quantity : 0;
    }),
    backgroundColor: baseColors[index + 1],
    borderColor: "rgba(75, 192, 192, 1)",
    borderWidth: 1,
  }));
  // const datasets = uniqueProductCategories.map((productCategory,index) => ({
  //   label: productCategory,
  //   data: uniqueMonths.map((month) => {
  //     const dataPoint = groupedData.find(
  //       (item) =>
  //         item.ProductCategoryName === productCategory && item.Month === month
  //     );
  //     return dataPoint ? dataPoint.Quantity : 0;
  //   }),
  //   backgroundColor: baseColors[index + 1],
  //   borderColor: "rgba(75, 192, 192, 1)",
  //   borderWidth: 1,
  // }));
  const totalQuantiy = groupedData.reduce(
    (sum, item) => sum + Math.round(parseFloat(item.Quantity)),
    0
  );
  const formattedTotalQuantity = new Intl.NumberFormat("en-IN").format(totalQuantiy);
  
  const barChart = groupedData[0] ? (
    <Bar
      data={{
        labels: uniqueMonths,
        datasets: datasets,
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
            text: `Total Forecasted Sales of ${storeNameValue} >> ${departmentNameValue} >> By Product Category`,
            color: "white",
            font: { size: "10" },
          },
          zoom: {
            pan: {
              enabled: true,
              mode: "x",
            },
            zoom: {
              pinch: {
                enabled: true, // Enable pinch zooming
              },
              wheel: {
                enabled: true, // Enable wheel zooming
              },
              mode: "x",
            },
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
              maxRotation: 90,
              minRotation:90, // Set maxRotation to 90 degrees for vertical ticks
            },
            axisColor: "rgb(255, 99, 132)",
          },
        },
      }}
      ref={chartRef}
      onClick={handleClick}
    />
  ) : null;
  const dataGridRows = groupedData.map((data, index) => ({
    id: index,
    Department: data.Department,
    ProductCategoryName: data.ProductCategoryName,
    Quantity: data.Quantity,
    Month: data.Month,
    Amount: Math.round(parseFloat(data.Amount)),
  }));

  // Define columns for the DataGrid
  const dataGridColumns = [
    { field: "Department", headerName: "Department", flex: 1 },
    { field: "ProductCategoryName", headerName: "Product Category", flex: 1 },
    { field: "Month", headerName: "Month", flex: 1 },
    { field: "Amount", headerName: "Amount", flex: 1 },
    { field: "Quantity", headerName: "Quantity", flex: 1 },
  ];
  return (
    <div>
      {conditionbrand ? (
        <ByBrandName
          originalData={originalData}
          storeNameValue={storeNameValue}
          departmentNameValue={departmentNameValue}
          productCategoryNameValue={productCategoryNameValue}
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
    </div>
  );
};

export default ByProductCategory;
