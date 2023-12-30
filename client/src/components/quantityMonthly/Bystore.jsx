import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchForecastAsync, selectForecast } from "../../forecastSlice";
import Chart from "chart.js/auto";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { Bar, getElementAtEvent } from "react-chartjs-2";
import ByDepartment from "./ByDepartment";
import { baseColors } from "theme";
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
const Bystore = () => {
  const dispatch = useDispatch();
  const chartRef = useRef(null);
  const [data, setData] = useState();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [labelvalue, setlabelvalue] = useState([]);
  const theme= useTheme();
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
  //   console.log(data)
  const [originalData, setOriginalData] = useState([]);
  const [groupedData, setGroupedData] = useState([]);
  const [storeNameValue, setStoreNameValue] = useState([]);
  const [monthValue, setMonthNameValue] = useState([]);
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
      const monthNames = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ];
      const groupedByStoreAndDate = originalData.reduce((accumulator, item) => {
        const storeKey = item.StoreName;
        const date = new Date(item.BillDate);

        // Extract year and month from the date
        const year = date.getFullYear();
        const month = monthNames[date.getMonth()];

        // Create a unique key for each store and date combination
        const key = `${storeKey}-${year}-${month}`;

        if (!accumulator[key]) {
          accumulator[key] = {
            StoreName: storeKey,
            Year: year,
            Month: month,
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

  // Log the groupedData after it has been updated
  // console.log(groupedData);
  const storeData = {};

  groupedData.forEach((entry) => {
    const storeName = entry.StoreName;
    const month = entry.Month;
    const quantity = entry.Quantity;

    if (!storeData[storeName]) {
      storeData[storeName] = {};
    }

    if (storeData[storeName][month]) {
      storeData[storeName][month] += quantity;
    } else {
      storeData[storeName][month] = quantity;
    }
  });
  console.log(storeData);
  //{this one for handling the bar click : section}
  const handleSortClick = () => {
    // Sort the data based on the "Amount" property
    const newSortedData = groupedData.slice().sort((a, b) => b.Quantity - a.Quantity);

    // Update the state to trigger a re-render with the sorted data
    setGroupedData(newSortedData);
  };
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
    setMonthNameValue(month);
    setStoreNameValue(shopName);
    setCondition(true);
  };
  useEffect(() => {
    // console.log("Labelvalue", monthValue,storeNameValue);
  }, [monthValue, storeNameValue]);

  const labels = Object.keys(storeData);
  const datasets = Object.entries(storeData).map(
    ([storeName, monthlyquantity], index) => ({
      label: storeName,
      data: Object.values(monthlyquantity),
      backgroundColor:  baseColors[index + 1],
      borderColor: "rgba(75, 192, 192, 1)",
      borderWidth: 1,
    })
  );
  // console.log(labels)
  // console.log(datasets)

  const barChart = groupedData[0] ? (
    <Bar
      data={{
        labels: Object.keys(storeData[labels[0]]), // Use the months from the first store as labels
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
            // stacked:true,
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
            // stacked:true,
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
  ) : 'Loading';
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
          <Button variant="contained" onClick={handleSortClick}>
            Sort
          </Button>

          <Box
            gridColumn="span 12"
            gridRow="span 1"
            backgroundColor={theme.palette.background.alt}
            p=".2rem"
            borderRadius="0.55rem"
            sx={{ height: "80vh", width: "100%" ,mb:5}}
          >
            {barChart}
          </Box>
        </Box>
      )}
    </div>
  );
};

export default Bystore;
