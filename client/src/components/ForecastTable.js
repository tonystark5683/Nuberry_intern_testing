// ForecastTable.jsx
import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchForecastAsync, selectForecast } from "../forecastSlice";
import { BarChart } from "@mui/x-charts/BarChart";
import { Line } from "react-chartjs-2";
import Chart from "chart.js/auto";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { Bar, getElementAtEvent } from "react-chartjs-2";
import GoupedDataStore from "./GoupedDataStore";
import { baseColors } from "theme";
import FlexBetween from "./FlexBetween";
import {
  Box,
  Button,
  Typography,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import {
  DownloadOutlined,
  Email,
  PointOfSale,
  PersonAdd,
  Traffic,
} from "@mui/icons-material";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { DataGrid } from "@mui/x-data-grid";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);
Chart.register(ChartDataLabels);

const ForecastTable = () => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const chartRef = useRef(null);
  //  const labels = ["January", "February", "March", "April", "May", "June"];
  //  const test_data = {
  //    labels: labels,
  //    datasets: [
  //      {
  //        label: "My First dataset",
  //        backgroundColor: "rgb(255, 99, 132)",
  //        borderColor: "rgb(0,0,255)",
  //        data: [20, 10, 5, 2, 20, 30, 45],
  //      },
  //    ],
  //  };
  const [data, setData] = useState();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [labelvalue, setlabelvalue] = useState([]);
  useEffect(() => {
    dispatch(fetchForecastAsync());
  }, [dispatch]);
  const columns = [
    { field: "StoreName", headerName: "StoreName", flex: 1, type: "string" },
    { field: "Department", headerName: "Department", flex: 1, type: "string" },
    {
      field: "ProductCategoryName",
      headerName: "ProductCategoryName",
      flex: 1,
      type: "string",
    },
    { field: "BrandName", headerName: "BrandName", flex: 1, type: "string" },
    { field: "BillDate", headerName: "BillDate", flex: 1, type: "date" },
    { field: "Amount", headerName: "Amount", flex: 1, type: "number" },
    { field: "Quantity", headerName: "Quantity", flex: 1, type: "number" },
  ];
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
  const rows = data?.map((item, index) => ({
    id: index,
    StoreName: item.StoreName || "N/A",
    Quantity: item.Quantity || 0,
    ProductCategoryName: item.ProductCategoryName || "N/A",
    Department: item.Department || "N/A",
    BrandName: item.BrandName || "N/A",
    BillDate: item.BillDate || null,
    Amount: item.Amount || 0,
  }));
  // console.log('Rows',typeof(rows))
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

      const groupedByStore = originalData.reduce((accumulator, item) => {
        const key = item.StoreName;
        if (!accumulator[key]) {
          accumulator[key] = {
            StoreName: item.StoreName,
            Quantity: 0,
            Amount: 0,
          };
        }
        accumulator[key].Quantity += item.Quantity || 0;
        accumulator[key].Amount += item.Amount || 0;
        return accumulator;
      }, {});

      const groupedArrayByStore = Object.values(groupedByStore);

      setGroupedData(groupedArrayByStore);
    };

    // Call the grouping logic when the original data changes
    groupData();
  }, [originalData]);
  // console.log(groupedData)

  const handleSortClick = () => {
    // Sort the data based on the "Amount" property
    const newSortedData = groupedData
      .slice()
      .sort((a, b) => b.Amount - a.Amount);

    // Update the state to trigger a re-render with the sorted data
    setGroupedData(newSortedData);
  };
  const [condition, setCondition] = useState(false);
  const handleBackButtonClick = () => {
    setCondition(false); // Set condition to null when back button is clicked
  };
  const handleClick = (e) => {
    // console.log("event,", getElementAtEvent(chartRef.current, e));
    const currindex = getElementAtEvent(chartRef.current, e)[0].index;
    // console.log(currindex);
    const value = groupedData[currindex].StoreName;
    // console.log(value)
    setlabelvalue(value);
    setCondition(true);
  };
  useEffect(() => {
    // This block will run every time labelvalue changes
    // console.log("Labelvalue", labelvalue);
  }, [labelvalue]);
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
        labels: groupedData.map((data) => data.StoreName),
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
            text: "Total Forecasted Sales By Shop",
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
  ) : (
    "Loading"
  );

  return (
    <>
      {/* <h2>Forecast Table</h2> */}
      <div>
        {/* <DataGrid
        rows={rows|| []}
        columns={columns}
      /> */}

        {/* <BarChart
      xAxis={[{ scaleType: 'band', data: groupedData.map(item => item.BillDate) }]}
      series={[{ data: groupedData.map(item => item.Amount) }]}
      
      height={400}
    >
      
    </BarChart> */}

        {/* <Bar data={test_data} /> */}

        {condition ? (
          <GoupedDataStore
            originalData={originalData}
            labelvalue={labelvalue}
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
              display="flex"
              justifyContent="space-between"
              borderRadius="0.55rem"
            >
              <Button variant="contained" onClick={handleSortClick}>
                Sort
              </Button>
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
        )}
      </div>
    </>
  );
};

export default ForecastTable;
