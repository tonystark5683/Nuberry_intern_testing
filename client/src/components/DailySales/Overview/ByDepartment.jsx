import React, { useEffect, useState, useRef } from "react";
import { BarChart } from "@mui/x-charts/BarChart";
import { Line } from "react-chartjs-2";
import Chart from "chart.js/auto";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { Bar, getElementAtEvent } from "react-chartjs-2";
import { baseColors } from "theme";
import ByProductCategory from "./ByProductDrill/ByProductCategory";
import zoomPlugin from "chartjs-plugin-zoom";
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
  LineElement,
  PointElement,
} from "chart.js";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);
Chart.register(ChartDataLabels);
Chart.register(zoomPlugin);
const ByDepartment = ({ originalData, storeNameValue, onBackButtonClick }) => {
  const theme = useTheme();
  const chartRef = useRef(null);
  const [departmentNameValue, setDepartmentNameValue] = useState([]);
  const [groupedData, setGroupedData] = useState([]);
  useEffect(() => {
    // Grouping and summing logic
    const groupData = () => {
      if (!Array.isArray(originalData) || !originalData.length) {
        console.log("Not an array or empty");
        return;
      }
      const filteredData = originalData.filter(
        (item) => item.StoreName === storeNameValue
      );

      const groupedByDepartment = filteredData.reduce((accumulator, item) => {
        const storeKey = item.StoreName;
        const departmentKey = item.Department;
        const date = new Date(item.BillDate);

        // Extract year, month, and day from the date
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();

        // Create a unique key for each store, product category, and date combination
        const key = `${storeKey}-${departmentKey}-${year}-${month}-${day}`;

        if (!accumulator[key]) {
          accumulator[key] = {
            StoreName: storeKey,
            Department: departmentKey,
            Date: `${day}/${month}/${year}`, // You can store the full date object if needed
            Quantity: 0,
            Amount: 0,
          };
        }

        accumulator[key].Quantity += item.Quantity || 0;
        accumulator[key].Amount += item.Amount || 0;

        return accumulator;
      }, {});

      const groupedArrayByDepartment = Object.values(groupedByDepartment);

      setGroupedData(groupedArrayByDepartment);
    };

    // Call the grouping logic when the original data changes
    groupData();
  }, [originalData, storeNameValue]);
  // console.log("grouped data",groupedData);
  const handleBackButtonClick = () => {
    onBackButtonClick();
  };
  const [conditiondepart, setConditiondepart] = useState(false);
  const handleBackButtonClick_Department = () => {
    setConditiondepart(false);
  };
  const handleClick = (e) => {
    const currindex = getElementAtEvent(chartRef.current, e)[0].index;
    const currdatasetIndex = getElementAtEvent(chartRef.current, e)[0]
      .datasetIndex;
    const labels = chartRef.current.data.labels;
    const Date = labels[currindex];
    const datasets = chartRef.current.data.datasets;
    const DepartmentName = datasets[currdatasetIndex].label;
    setDepartmentNameValue(DepartmentName);
    setConditiondepart(true);
  };

  useEffect(() => {
    console.log("Labelvalue", departmentNameValue);
  }, [departmentNameValue]);

  const storeData = {};

  groupedData.forEach((entry) => {
    const department = entry.Department; // Assuming there is a "Department" field in your data
    const date = entry.Date;
    const amount = entry.Amount;

    if (!storeData[date]) {
      storeData[date] = {};
    }

    if (storeData[date][department]) {
      storeData[date][department] += amount;
    } else {
      storeData[date][department] = amount;
    }
  });
  // console.log(storeData)
  let max = 0;
  for (const date in storeData) {
    for (const department in storeData[date]) {
      const amount = storeData[date][department];
      if (amount > max) {
        max = amount;
      }
    }
  }
  max = max + 10000;
  let labels;
  let datasets;

  if (storeData && Object.keys(storeData).length > 0) {
    labels = Object.keys(storeData);
    datasets = Object.entries(storeData[labels[0]]).map(
      ([department, _], index) => ({
        label: department,
        data: labels.map((date) => storeData[date][department] || 0),
        backgroundColor: baseColors[index + 1],
        borderColor: baseColors[index + 1],
        borderWidth: 1,
        tension: 0.6,
        fill: false,
        pointRadius: 3,
        pointHoverRadius: 5,
        pointHoverBorderWidth: 3,
      })
    );
    // Use datasets in your chart
  } else {
    // Handle the case when storeData is null or empty
    console.error("storeData is null or empty");
  }
  // console.log(labels,datasets)
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
  const lineChart = groupedData[0] ? (
    <Line
      data={{
        labels: labels,
        datasets: datasets,
      }}
      options={{
        responsive: true,
        maintainAspectRatio: false,
        transitions: {
          zoom: {
            animation: {
              duration: 9000,
              easing: "easeOutCubic",
            },
          },
        },
        plugins: {
          zoom: {
            zoom: {
              wheel: {
                enabled: true,
              },
              pinch: {
                enabled: true,
              },
              mode: "xy",
            },
            pan: {
              enabled: true,
              mode: "xy",
            },
            limits: {
              y: { min: 0, max: max },
            },
          },
          legend: {
            position: "top",
            labels: {
              boxWidth: 30,
              font: {
                size: 8,
              },
              color: "white", // Set your desired font color
            },
          },
          datalabels: {
            display: true,
            color: "white",
            font: { size: "6" },
            formatter: Math.round,
            anchor: "end", // Set anchor to "center" for center alignment
            align: "top", // Set align to "center" for centering on the line
            offset: 0, // Set align to "end" for vertical alignment
            rotation: 0,
          },
          title: {
            display: true,
            text: "Total Forecasted Sales By Department",
            color: "white",
            font: { size: "10" },
          },
          tooltip: {
            enabled: true,
            intersect: false,
            mode: "nearest",
            callbacks: {
              label: function (context) {
                const label = context.dataset.label || "";
                if (label) {
                  return label + ": " + context.parsed.y;
                }
                return null;
              },
            },
          },
        },
        scales: {
          x: {
            color: "red",
            grid: {
              display: false,
              color: "red",
            },
            title: {
              display: true,
              text: "Day",
              color: "Aqua",
              font: { size: "10" },
            },
            ticks: {
              color: theme.palette.secondary[200] ,
              font: { size: "8" },
              maxRotation: 90, // Set maxRotation to 90 degrees for vertical ticks
              minRotation: 90,
            },
            axis: {
              color: "green",
            },
          },
          y: {
            grid: {
              display: false,
              color: "red",
            },

            ticks: {
              color: theme.palette.secondary[200] ,
              font: { size: "10" },
              maxRotation: 90, // Set maxRotation to 90 degrees for vertical ticks
              minRotation: 90,
            },
            title: {
              display: true,
              text: "Total Sales",
              color: "Aqua",
              font: { size: "10" },
            },
          },
        },
        interaction: {
          intersect: false,
          axis: "x",
        },

        // onClick: function (event, elements) {
        //   // Handle click events on data points
        //   if (elements.length > 0) {
        //     const datasetIndex = elements[0].datasetIndex;
        //     const dataIndex = elements[0].index;
        //     const storeName = datasets[datasetIndex].label;
        //     const date = labels[dataIndex];
        //     const amount = datasets[datasetIndex].data[dataIndex];
        //     console.log(
        //       `Clicked on ${storeName} on ${date} with amount ${amount}`
        //     );
        //   }
        // },
      }}
      ref={chartRef}
      onClick={handleClick}
    />
  ) : null;

  const dataGridRows = groupedData.map((data, index) => ({
    id: index,
    StoreName: data.StoreName,
    Department: data.Department,
    Date: data.Date,
    Quantity: data.Quantity,
    Amount: Math.round(parseFloat(data.Amount)),
  }));
  const dataGridColumns = [
    { field: "StoreName", headerName: "StoreName", flex: 1, type: "string" },
    { field: "Department", headerName: "Department", flex: 1, type: "string" },
    { field: "Date", headerName: "Date", flex: 1, type: "date" },
    { field: "Amount", headerName: "Amount", flex: 1, type: "number" },
    { field: "Quantity", headerName: "Quantity", flex: 1, type: "number" },
  ];
  return (
    <div>
      {conditiondepart ? (
        <ByProductCategory
          originalData={originalData}
          storeNameValue={storeNameValue}
          departmentNameValue={departmentNameValue}
          handleBackButtonClick_Department={handleBackButtonClick_Department}
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
            sx={{ height: "80vh", width: "100%" }}
          >
            {lineChart}
          </Box>

          <Box
            gridColumn="span 12"
            gridRow="span 3"
            backgroundColor={theme.palette.background.alt}
            p=".2rem"
            borderRadius="0.55rem"
            sx={{ height: 400, mb: 5 }}
          >
            <DataGrid
              rows={dataGridRows}
              columns={dataGridColumns}
              components={{
                Toolbar: GridToolbar,
              }}
            />
          </Box>
        </Box>
      )}
    </div>
  );
};

export default ByDepartment;
