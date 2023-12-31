import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchForecastAsync, selectForecast } from "../../forecastSlice";
import Chart from "chart.js/auto";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { Bar, getElementAtEvent } from "react-chartjs-2";
import ByDepartment from "./ByDepartment";
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
  const theme = useTheme();
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
        const key = `${storeKey}-${month}-${year}`;

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

  // Object to store total amount for each month
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
  const storeData = {};

  groupedData.forEach((entry) => {
    const storeName = entry.StoreName;
    const month = entry.Month;
    const amount = entry.Amount;

    if (!storeData[storeName]) {
      storeData[storeName] = {};
    }

    if (storeData[storeName][month]) {
      storeData[storeName][month] += amount;
    } else {
      storeData[storeName][month] = amount;
    }
  });
  // console.log(storeData);
  //{this one for handling the bar click : section}
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
    ([storeName, monthlySales], index) => ({
      label: storeName,
      data: Object.values(monthlySales),
      backgroundColor: baseColors[index + 1],
      borderColor: "rgba(75, 192, 192, 1)",
      borderWidth: 1,
    })
  );
  // console.log(labels)
  // console.log(datasets)
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
  ) : (
    "Loading"
  );
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
      )}
    </div>
  );
};

export default Bystore;
