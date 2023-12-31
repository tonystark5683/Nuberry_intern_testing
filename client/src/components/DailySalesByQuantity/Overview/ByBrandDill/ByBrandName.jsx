import React, { useEffect, useState, useRef } from "react";
import { BarChart } from "@mui/x-charts/BarChart";
import { Line } from "react-chartjs-2";
import Chart from "chart.js/auto";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { Bar, getElementAtEvent } from "react-chartjs-2";
import { baseColors } from "theme";
import {
  Box,
  Button,
  Typography,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { Switch } from "antd";
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
import ByProductCategory from "./ByProductCategory";
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

const ByBrandName = ({
  originalData,
  storeNameValue,
  departmentNameValue,
  handleDisplayClick,
  handleDisplayClickfortrue,
}) => {
  const [groupedData, setGroupedData] = useState([]);
  const chartRef = useRef(null);
  const theme = useTheme();
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

      // Group data by ProductCategory and day for the selected store and department
      const groupedData = filteredData.reduce((accumulator, item) => {
        const BrandNameKey = item.BrandName;
        const date = new Date(item.BillDate);
        const departmentKey = item.Department;
        const storeKey = item.StoreName;
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();
        const key = `${storeKey}-${departmentKey}-${BrandNameKey}-${year}-${month}-${day}`;

        if (!accumulator[key]) {
          accumulator[key] = {
            StoreName: storeKey,
            Department: departmentKey,
            BrandName: BrandNameKey,
            Date: `${day}/${month}/${year}`,
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
  // console.log(groupedData);
  const [brandNameValue, setBrandNameValue] = useState([]);
  const [conditionbrand, setConditionbrand] = useState(false);
  const handleBackButtonClick_Brand = () => {
    setConditionbrand(false);
  };
  const handleClick = (e) => {
    const currindex = getElementAtEvent(chartRef.current, e)[0].index;
    const currdatasetIndex = getElementAtEvent(chartRef.current, e)[0]
      .datasetIndex;
    const labels = chartRef.current.data.labels;
    const Date = labels[currindex];
    const datasets = chartRef.current.data.datasets;
    const BrandName = datasets[currdatasetIndex].label;
    setBrandNameValue(BrandName);
    setConditionbrand(true);
    handleDisplayClick();
  };

  useEffect(() => {
    console.log("Labelvalue", brandNameValue);
  }, [brandNameValue]);

  const storeData = {};

  groupedData.forEach((entry) => {
    const brand = entry.BrandName;
    const date = entry.Date;
    const quantity = entry.Quantity;

    if (!storeData[date]) {
      storeData[date] = {};
    }

    if (storeData[date][brand]) {
      storeData[date][brand] += quantity;
    } else {
      storeData[date][brand] = quantity;
    }
  });
  // console.log(storeData);
  let max = 0;
  for (const date in storeData) {
    for (const brand in storeData[date]) {
      const amount = storeData[date][brand];
      if (amount > max) {
        max = amount;
      }
    }
  }
  max = max + 5;
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
        fill: false, // Set fill to false for line chart
        pointRadius: 3, // Set point radius
        pointHoverRadius: 5,
        pointHoverBorderWidth: 3,
      })
    );
    // Use datasets in your chart
  } else {
    // Handle the case when storeData is null or empty
    console.log("storeData is null or empty");
  }
  // console.log(labels, datasets);
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
            limits: {
              y: { min: 0, max: max },
            },
            pan: {
              enabled: true,
              mode: "xy",
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
            text: "Total Forecasted Quantity By BrandName",
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
          backgroundColor: "#FFF",
          titleFontSize: 16,
          titleFontColor: "#0066ff",
          bodyFontColor: "#000",
          bodyFontSize: 14,
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
              color: theme.palette.secondary[200],
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
              color: theme.palette.secondary[200],
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
          font: { size: "1" },
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
    BrandName: data.BrandName,
    Date: data.Date,
    Amount: Math.round(parseFloat(data.Amount)),
    Quantity: data.Quantity,
  }));
  const dataGridColumns = [
    { field: "StoreName", headerName: "StoreName", flex: 1, type: "string" },
    { field: "Department", headerName: "Department", flex: 1, type: "string" },
    {
      field: "BrandName",
      headerName: "BrandName",
      flex: 1,
      type: "string",
    },
    { field: "Date", headerName: "Date", flex: 1, type: "date" },
    { field: "Amount", headerName: "Amount", flex: 1, type: "number" },
    { field: "Quantity", headerName: "Quantity", flex: 1, type: "number" },
  ];
  return (
    <div>
      {conditionbrand ? (
        <ByProductCategory
          originalData={originalData}
          storeNameValue={storeNameValue}
          departmentNameValue={departmentNameValue}
          handleBackButtonClick_Brand={handleBackButtonClick_Brand}
          brandNameValue={brandNameValue}
          handleDisplayClickfortrue={handleDisplayClickfortrue}
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
            backgroundColor={theme.palette.background.alt}
            p=".2rem"
            borderRadius="0.55rem"
            sx={{ height: "80vh", width: "100%" }}
          >
            {lineChart}
          </Box>

          <Box
            gridColumn="span 12"
            gridRow="span 2"
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

export default ByBrandName;
