import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchForecastAsync, selectForecast } from "../../../forecastSlice";
import { BarChart } from "@mui/x-charts/BarChart";
import { Line } from "react-chartjs-2";
import Chart from "chart.js/auto";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { Bar, getElementAtEvent } from "react-chartjs-2";
import { baseColors } from "theme";
import ByDepartment from "./ByDepartment";
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

const ByStore = () => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const chartRef = useRef(null);

  const [data, setData] = useState();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [labelvalue, setlabelvalue] = useState([]);
  useEffect(() => {
    dispatch(fetchForecastAsync());
  }, [dispatch]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://127.0.0.1:5000/run_forecast");

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const result = await response.json();
        setData(result);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);
  // console.log(data)

  const [originalData, setOriginalData] = useState([]);
  const [groupedData, setGroupedData] = useState([]);
  useEffect(() => {
    // Set original data after fetching
    setOriginalData(data);
  }, [data]);

  useEffect(() => {
    // Grouping and summing logic
    const groupData = () => {
      if (!Array.isArray(originalData) || !originalData.length) {
        console.log("Not an array or empty");
        return;
      }

      const groupedByStoreAndDate = originalData.reduce((accumulator, item) => {
        const storeKey = item.StoreName;
        const date = new Date(item.BillDate);

        // Extract year, month, and day from the date
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();

        // Create a unique key for each store and date combination
        const key = `${storeKey}-${year}-${month}-${day}`;

        if (!accumulator[key]) {
          accumulator[key] = {
            StoreName: storeKey,
            Date: `${month}/${day}/${year}`, // You can store the full date object if needed
            Quantity: 0,
            Amount: 0,
          };
        }

        accumulator[key].Quantity += item.Quantity || 0;
        accumulator[key].Amount += item.Amount || 0;

        return accumulator;
      }, {});

      const groupedArrayByStoreAndDate = Object.values(groupedByStoreAndDate);

      setGroupedData(groupedArrayByStoreAndDate);
    };

    // Call the grouping logic when the original data changes
    groupData();
  }, [originalData]);
  //  console.log(groupedData)
  const storeData = {};

  groupedData.forEach((entry) => {
    const storeName = entry.StoreName;
    const date = entry.Date;
    const quantity = entry.Quantity;

    if (!storeData[date]) {
      storeData[date] = {};
    }

    if (storeData[date][storeName]) {
      storeData[date][storeName] += quantity;
    } else {
      storeData[date][storeName] = quantity;
    }
  });
  const [storeNameValue, setStoreNameValue] = useState([]);
  const [condition, setCondition] = useState(false);
  const handleBackButtonClick = () => {
    setCondition(false); // Set condition to null when back button is clicked
  };
  const handleClick = (e) => {
    const currindex = getElementAtEvent(chartRef.current, e)[0].index;
    const currdatasetIndex = getElementAtEvent(chartRef.current, e)[0]
      .datasetIndex;
    const labels = chartRef.current.data.labels;
    const month = labels[currindex];
    const datasets = chartRef.current.data.datasets;
    const shopName = datasets[currdatasetIndex].label;
    setStoreNameValue(shopName);
    setCondition(true);
  };

  useEffect(() => {
    console.log("Labelvalue", storeNameValue);
  }, [storeNameValue]);
  let max = 0;
  for (const date in storeData) {
    for (const storeName in storeData[date]) {
      const amount = storeData[date][storeName];
      if (amount > max) {
        max = amount;
      }
    }
  }
  max = max + 10;
  let labels;
  let datasets;
  if (storeData && Object.keys(storeData).length > 0) {
    labels = Object.keys(storeData);
    datasets = Object.entries(storeData[labels[0]]).map(
      ([storeName, _], index) => ({
        label: storeName,
        data: labels.map((date) => storeData[date][storeName] || 0),
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
  // console.log(labels,datasets)

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
            text: "Total Forecasted Sales By Shop",
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
  ) : 'Loading';

  const dataGridRows = groupedData.map((data, index) => ({
    id: index,
    StoreName: data.StoreName,
    Date: data.Date,
    Quantity: data.Quantity,
    Amount: Math.round(parseFloat(data.Amount)),
  }));
  const dataGridColumns = [
    { field: "StoreName", headerName: "StoreName", flex: 1, type: "string" },
    { field: "Date", headerName: "Date", flex: 1, type: "date" },
    { field: "Amount", headerName: "Amount", flex: 1, type: "number" },
    { field: "Quantity", headerName: "Quantity", flex: 1, type: "number" },
  ];

  return (
    <div>
      {condition ? (
        <ByDepartment
          originalData={originalData}
          storeNameValue={storeNameValue}
          onBackButtonClick={handleBackButtonClick}
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
            sx={{ height: "100vh", width: "100%" }}
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

export default ByStore;
