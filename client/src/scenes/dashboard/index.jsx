import React, { useState, useEffect } from "react";
import FlexBetween from "components/FlexBetween";
import Header from "components/Header";
import {
  DownloadOutlined,
  Email,
  PointOfSale,
  PersonAdd,
  Traffic,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Typography,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { DataGrid , GridToolbar} from "@mui/x-data-grid";
import BreakdownChart from "components/BreakdownChart";
import OverviewChart from "components/OverviewChart";
import { useGetDashboardQuery } from "state/api";
import StatBox from "components/StatBox";
import { useDispatch, useSelector } from "react-redux";
import { fetchForecastAsync, selectForecast } from "../../forecastSlice";
import Chart from "chart.js/auto";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { Bar, getElementAtEvent } from "react-chartjs-2";
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
const Dashboard = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchForecastAsync());
  }, [dispatch]);
  const [fetchdata, setfetchData] = useState();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const fetched_columns = [
    { field: "StoreName", headerName: "StoreName", flex: 0.4, type: "string" },
    {
      field: "Department",
      headerName: "Department",
      flex: 0.5,
      type: "string",
    },
    {
      field: "ProductCategoryName",
      headerName: "ProductCategoryName",
      flex: 1,
      type: "string",
    },
    { field: "BrandName", headerName: "BrandName", flex: .6, type: "string" },
    { field: "BillDate", headerName: "BillDate", flex: 0.5, type: "date" },
    { field: "Amount", headerName: "Amount", flex: 0.2, type: "number" },
    { field: "Quantity", headerName: "Quantity", flex: 0.3, type: "number" },
  ];
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://127.0.0.1:5000/run_forecast");

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const result = await response.json();
        setfetchData(result);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);
  // console.log(fetchdata)
  const rows = fetchdata?.map((item, index) => ({
    id: index,
    StoreName: item.StoreName || "N/A",
    Quantity: item.Quantity || 0,
    ProductCategoryName: item.ProductCategoryName || "N/A",
    Department: item.Department || "N/A",
    BrandName: item.BrandName || "N/A",
    BillDate: item.BillDate
      ? new Date(item.BillDate).toLocaleDateString()
      : null,
    Amount: item.Amount || 0,
  }));
  // console.log(rows)
  const [originalData, setOriginalData] = useState([]);
  const [groupedData, setGroupedData] = useState([]);
  const [groupedBrand, setGroupedBrand] = useState([]);
  useEffect(() => {
    // Set original data after fetching
    setOriginalData(fetchdata);
  }, [fetchdata]);

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
  const [storeName, setstoreName] = useState(null);

  const handleChildValue = (value) => {
    setstoreName(value);
  };
  useEffect(() => {
    // console.log("Labelvalue", storeName);
  }, [storeName]);

  useEffect(() => {
    // Grouping and summing logic
    const groupDataByBrand = () => {
      if (!Array.isArray(originalData) || !originalData.length) {
        console.log("Not an array or empty");
        return;
      }
      let filteredData = originalData;

    // Apply filter if storeName is not null
    if (storeName !== null) {
      filteredData = originalData.filter(item => item.StoreName === storeName);
    }


      const groupedByBrand = filteredData.reduce((accumulator, item) => {
        const key = item.BrandName;
        if (!accumulator[key]) {
          accumulator[key] = {
            BrandName: item.BrandName,
            Quantity: 0,
            Amount: 0,
          };
        }
        accumulator[key].Quantity += item.Quantity || 0;
        accumulator[key].Amount += item.Amount || 0;
        return accumulator;
      }, {});

      const groupedArrayByBrand = Object.values(groupedByBrand);

      setGroupedBrand(groupedArrayByBrand);
    };

    // Call the grouping logic when the original data changes
    groupDataByBrand();
  }, [originalData,storeName]);

  const sortedData = groupedBrand.sort((a, b) => b.Amount - a.Amount);
  const topTenBrands = sortedData.slice(0, 10);

  // below for the pie chart
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
  const theme = useTheme();
  const isNonMediumScreens = useMediaQuery("(min-width: 1200px)");
  
  
 
  const barChart = groupedBrand[0] ? (
    <Bar
      data={{
        labels: topTenBrands.map((item) => item.BrandName),
        datasets: [
          {
            data: topTenBrands.map((item) => item.Amount),
            label: "Amount",
            backgroundColor: "#FFF78A", // Light Sky Blue with some transparency
            borderColor: "rgba(173, 216, 230, 1)", // Light Sky Blue without transparency
            borderWidth: 1,
          },
        ],
      }}
      options={{
        maintainAspectRatio: false, // Set to false for 100% width
        plugins: {
          legend: {
            position: "top",
            labels: {
              boxWidth:30,
              font: {
                size: 10
            }, 
              color: "white", // Set your desired font color
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
            display: false,
            text: "Top Ten Brands",
            color: theme.palette.secondary[300],
            font: { size: "10" },
          },
        },
        scales: {
          x: {
            grid: {
              display: false,
            },
            ticks: {
              color: "white",
              font: { size: "6" },
            },
            gridLines: {
              color: "red",
            },

            axis: { color: "rgb(255, 99, 132)" },
          },
          y: {
            grid: {
              display: false,
            },
            gridLines: {
              color: "red",
            },
            ticks: {
              color: "white",
              font: { size: "7" },
            },
            axisColor: "rgb(255, 99, 132)",
          },
        },
      }}
    />
  ) : null;
  return (
    <Box m=".2rem 1rem">
      <FlexBetween>
        <Header title="DASHBOARD" subtitle="Welcome To The Dashboard" />

        {/* <Box>
          <Button
            sx={{
              backgroundColor: theme.palette.secondary.light,
              color: theme.palette.background.alt,
              fontSize: "14px",
              fontWeight: "bold",
              padding: "10px 20px",
            }}
          >
            <DownloadOutlined sx={{ mr: "10px" }} />
            Download Reports
          </Button>
        </Box> */}
      </FlexBetween>

      <Box
        mt="20px"
        display="grid"
        gridTemplateColumns="repeat(12, 1fr)"
        gridAutoRows="160px"
        gap="20px"
        sx={{
          "& > div": { gridColumn: isNonMediumScreens ? undefined : "span 12" },
        }}
      >
        {/* ROW 1 */}
        <StatBox
          title="Total Sales"
          value={formattedTotalAmount}
          increase="+8%"
          icon={
            <Email
              sx={{ color: theme.palette.secondary[300], fontSize: "26px" }}
            />
          }
        />
        <StatBox
          title="Sales Today"
          value="35,000"
          increase="+21%"
          description="Since last Day"
          icon={
            <PointOfSale
              sx={{ color: theme.palette.secondary[300], fontSize: "26px" }}
            />
          }
        />
        <Box
          gridColumn="span 8"
          gridRow="span 2"
          backgroundColor={theme.palette.background.alt}
          p="1rem"
          borderRadius="0.55rem"
          textAlign="center"
        >
          {/* <OverviewChart view="sales" isDashboard={true} /> */}
          <Typography variant="h5" fontWeight="bold" color={theme.palette.secondary[300]}>
                    {storeName} Top Ten Brands
                  </Typography>
          {barChart}
        </Box>
        <StatBox
          title="Monthly Sales"
          value="1,35,02,999"
          increase="+65%"
          description="Since last month"
          icon={
            <PersonAdd
              sx={{ color: theme.palette.secondary[300], fontSize: "26px" }}
            />
          }
        />
        <StatBox
          title="Yearly Sales"
          value="12,35,02,999"
          increase="+43%"
          description="Since last Year"
          icon={
            <Traffic
              sx={{ color: theme.palette.secondary[300], fontSize: "26px" }}
            />
          }
        />

        {/* ROW 2 */}
        <Box
          gridColumn="span 8"
          gridRow="span 3"
          sx={{
            "& .MuiDataGrid-root": {
              border: "none",
              borderRadius: "5rem",
            },
            "& .MuiDataGrid-cell": {
              borderBottom: "none",
            },
            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: theme.palette.background.alt,
              color: theme.palette.secondary[100],
              borderBottom: "none",
            },
            "& .MuiDataGrid-virtualScroller": {
              backgroundColor: theme.palette.background.alt,
            },
            "& .MuiDataGrid-footerContainer": {
              backgroundColor: theme.palette.background.alt,
              color: theme.palette.secondary[100],
              borderTop: "none",
            },
            "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
              color: `${theme.palette.secondary[200]} !important`,
            },
            height:"500px"
          }}
        >
          <DataGrid rows={rows || []} columns={fetched_columns}  components={{
                Toolbar: GridToolbar,
              }}/>
        </Box>
        <Box
          gridColumn="span 4"
          gridRow="span 3"
          backgroundColor={theme.palette.background.alt}
          p=".5rem"
          borderRadius="0.55rem"
          sx={{ height:"470px", marginTop:"30px"}}
        >
          <Typography variant="h5" p=".2rem 0.2rem .6rem" sx={{ color: theme.palette.secondary[100] }}>
            Forecasted Total Sales By Store
          </Typography>
          <BreakdownChart isDashboard={true} fetchdata={groupedData} onChildValue={handleChildValue} />
          <Typography
            p="0 0.6rem"
            fontSize="0.8rem"
            sx={{ color: theme.palette.secondary[200] }}
          ></Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;

// Dashboard Component Documentation
// Introduction
// The Dashboard component is a crucial part of the forecasting application designed for managing and visualizing sales data for five stores: Adyar, Chrompet, Shanti Colony, Sarath Mall, and Velacherry. Each store is further divided into seven departments, with various product categories and brands.

// Installation
// Ensure that you have the necessary dependencies installed:

// bash
// Copy code
// npm install @mui/material @mui/x-data-grid react-chartjs-2 chart.js chartjs-plugin-datalabels
// Usage
// Import the Dashboard component and include it in your application:

// jsx
// Copy code
// import Dashboard from 'path-to-your-dashboard-component';

// // Inside your component or route
// <Dashboard />
// Features
// Mui DataGrid Table:

// Displays detailed sales data in a Material-UI DataGrid table with grid toolbar options.
// Total Forecast Sales:

// Provides an overview of total forecasted sales with monthly, yearly, and daily breakdowns.
// Includes a comparison with past sales to highlight increases.
// Top Ten Brands Bar Graph:

// Visualizes the top ten brands based on sales in a bar graph.
// Store-wise Pie Chart:

// Represents the total sales of each store using a pie chart.
// Data Fetching:

// Utilizes asynchronous data fetching from the backend using the useGetDashboardQuery hook.
// Code Structure
// The component is organized into various sections:

// Header and Toolbar:

// Displays a header with the title "DASHBOARD" and subtitle.
// Includes a toolbar with options (commented out in the code).
// StatBoxes:

// Presents key statistics such as total sales, sales today, monthly sales, and yearly sales.
// OverviewChart:

// Contains a chart for visualizing sales data (commented out in the code).
// Bar Chart:

// Renders a bar chart for the top ten brands based on sales.
// DataGrid:

// Utilizes Material-UI DataGrid to showcase detailed sales data.
// BreakdownChart:

// Displays a breakdown chart showing forecasted total sales by store.
// Data Fetching
// Fetches data from the backend API using the fetchForecastAsync action and useGetDashboardQuery hook.
// Dependencies
// Relies on various dependencies, including Material-UI, React-ChartJS, and Chart.js.
// Deployment
// Ensure that the backend API (http://127.0.0.1:5000/run_forecast) is accessible for data fetching.

// Additional Considerations
// Custom styling is applied using the MUI theme and media queries for responsive design.
// Future Enhancements
// Discuss any planned future enhancements or features.