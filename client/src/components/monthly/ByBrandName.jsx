import React, { useEffect, useRef, useState } from "react";
import { baseColors } from "theme";
import Chart from "chart.js/auto";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { Bar, getElementAtEvent } from "react-chartjs-2";
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
const ByBrandName = ({
  originalData,
  storeNameValue,
  departmentNameValue,
  productCategoryNameValue,
  handleBackButtonClick_Brand,
}) => {
  const chartRef = useRef(null);
  const [groupedData, setGroupedData] = useState([]);
  const theme = useTheme();
  useEffect(() => {
    // Grouping and summing logic
    const groupData = () => {
      if (!Array.isArray(originalData) || !originalData.length) {
        console.log("Not an array or empty");
        return;
      }

      // Filter data for the selected store, department, and product category
      const filteredData = originalData.filter(
        (item) =>
          item.StoreName === storeNameValue &&
          item.Department === departmentNameValue &&
          item.ProductCategoryName === productCategoryNameValue
      );

      // Group data by BrandName and month for the selected store, department, and product category
      const groupedData = filteredData.reduce((accumulator, item) => {
        const brandNameKey = item.BrandName;
        const monthKey = new Date(item.BillDate).toLocaleString("en-US", {
          month: "long",
        });

        // Create a unique key for each BrandName and month combination
        const key = `${brandNameKey}-${monthKey}`;

        if (!accumulator[key]) {
          accumulator[key] = {
            BrandName: brandNameKey,
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

    // Call the grouping logic when the original data or storeNameValue or departmentNameValue or productCategoryNameValue changes
    groupData();
  }, [
    originalData,
    storeNameValue,
    departmentNameValue,
    productCategoryNameValue,
  ]);
  // console.log(groupedData);
  const totalAmountByMonth = {};

  groupedData.forEach((item) => {
    const month = item.Month;

    if (!totalAmountByMonth[month]) {
      totalAmountByMonth[month] = 0;
    }

    totalAmountByMonth[month] += item.Amount || 0;
  });

  // Render total amounts for each month
  const renderTotalAmounts = () => {
    return Object.entries(totalAmountByMonth).map(([month, amount]) => (
      <FlexBetween key={month} gap="1.2rem">
        <Typography variant="h5">{month}</Typography>
        <Typography  variant="h6"
                  sx={{ color: theme.palette.secondary.light }}>
          {new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 0, // Remove decimal part
            minimumFractionDigits: 0, // Ensure at least 0 decimal places
            useGrouping: true, // Enable grouping separator
          }).format(amount)}
        </Typography>
      </FlexBetween>
    ));
  };

  console.log(totalAmountByMonth);
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
  // Extract unique months and BrandNames for the chart
  const uniqueMonths = [...new Set(groupedData.map((item) => item.Month))];
  const uniqueBrandNames = [
    ...new Set(groupedData.map((item) => item.BrandName)),
  ];

  // Prepare data for the chart
  const datasets = uniqueBrandNames.map((brandName, index) => ({
    label: brandName,
    data: uniqueMonths.map((month) => {
      const dataPoint = groupedData.find(
        (item) => item.BrandName === brandName && item.Month === month
      );
      return dataPoint ? dataPoint.Amount : 0;
    }),
    backgroundColor: baseColors[index + 1],
    borderColor: "rgba(75, 192, 192, 1)",
    borderWidth: 1,
    maxBarThickness: 100,
  }));
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
            text: `Total Forecasted Sales of ${storeNameValue} >> ${departmentNameValue} >> ${productCategoryNameValue} by Brand Name`,
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
              font: { size: "10" },
              maxRotation: 90,
              // Set maxRotation to 90 degrees for vertical ticks
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
              minRotation: 90, // Set maxRotation to 90 degrees for vertical ticks
            },
            axisColor: "rgb(255, 99, 132)",
          },
        },
      }}
      //   ref={chartRef}
      //   onClick={handleClick}
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
          <Button variant="contained" onClick={handleSortClick} style={{ marginRight: "8px" }}>
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
        sx={{ height: "80vh", width: "100%"}}
      >
        {barChart}
      </Box>
      <Box
              display="flex"
              flexDirection="column"
              justifyContent="space-between"
              backgroundColor={theme.palette.background.alt}
              borderRadius="0.55rem"
              p=".2rem .5rem"
              marginBottom={5}
            >
            {renderTotalAmounts()}
          </Box>
    </Box>
  );
};

export default ByBrandName;
