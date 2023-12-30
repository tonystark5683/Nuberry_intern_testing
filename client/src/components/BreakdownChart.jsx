import React from "react";
import { ResponsivePie } from "@nivo/pie";
import { Box, Typography, useTheme } from "@mui/material";
import { useGetSalesQuery } from "state/api";
import Chart from "chart.js/auto";
import ChartDataLabels from "chartjs-plugin-datalabels";
Chart.register(ChartDataLabels);

const BreakdownChart = ({ isDashboard = false , fetchdata , onChildValue}) => {
  
  const theme = useTheme();

  if (!fetchdata) return "Loading...";

  const colors = ['#EC8F5E', '#FFCD4B', '#F1EB90', '#FECDA6', '#F9B572'];

  const formattedData = fetchdata.map((item,index) => ({
    id: item.StoreName,
    label: item.StoreName,
    value: Math.round(parseFloat(item.Amount)),
    color: colors[index % colors.length],
}));
const totalAmount = fetchdata.reduce((sum, item) => sum + Math.round(parseFloat(item.Amount)), 0);

const formattedTotalAmount = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0, // Remove decimal part
  minimumFractionDigits: 0, // Ensure at least 0 decimal places
  useGrouping: true, // Enable grouping separator
}).format(totalAmount);

console.log(formattedData)
  return (
    <Box
      height={isDashboard ? "440px" : "100%"}
      width={undefined}
      minHeight={isDashboard ? "325px" : undefined}
      minWidth={isDashboard ? "325px" : undefined}
      position="relative"
    >
      <ResponsivePie
         data={formattedData.map(item => ({
          id: item.id,
          label: item.label,
          value: item.value,
          color: item.color,
        }))}
        onClick={(event, slice) => {
          const StoreName=event.label;
          console.log("Click Event:", event.label,event.value);
          if (onChildValue) {
            onChildValue(StoreName);
          }
        }}
        innerRadius={0.5}
        padAngle={0.7}
        cornerRadius={3}
        activeOuterRadiusOffset={8}
        borderWidth={1}
        theme={{
          axis: {
            domain: {
              line: {
                stroke: theme.palette.secondary[200],
              },
            },
            legend: {
              text: {
                fill: theme.palette.secondary[200],
              },
            },
            ticks: {
              line: {
                stroke: theme.palette.secondary[200],
                strokeWidth: 1,
              },
              text: {
                fill: theme.palette.secondary[200],
              },
            },
          },
          legends: {
            text: {
              fill: theme.palette.secondary[200],
            },
          },
          tooltip: {
            container: {
              color: theme.palette.primary.main,
            },
          },
          
        }}
        colors={{ datum: "data.color" }}
        margin={
          isDashboard
            ? { top: 10, right: 45, bottom: 70, left: 30 }
            : { top: 10, right: 45, bottom: 50, left: 55 }
        }
        sortByValue={true}
        borderColor={{
          from: "color",
          modifiers: [["darker", 0.2]],
        }}
        enableArcLinkLabels={!isDashboard}
        arcLinkLabelsTextColor={theme.palette.secondary[200]}
        arcLinkLabelsThickness={2}
        arcLinkLabelsColor={{ from: "color" }}
        arcLabelsSkipAngle={10}
        arcLabelsTextColor={{
          from: "color",
          modifiers: [["darker", 2]],
        }}
        legends={[
          {
            anchor: "bottom",
            direction: "row",
            justify: false,
            translateX: isDashboard ? 0 : 0,
            translateY: isDashboard ? 36 : 50,
            itemsSpacing: 2.5,
            itemWidth: 65,
            itemHeight: 30,
            itemTextColor: "#999",
            itemDirection: "top-to-bottom",
            itemOpacity: 1,
            symbolSize: 15,
            symbolShape: "triangle",
            effects: [
              {
                on: "hover",
                style: {
                  itemTextColor: 'white',
                },
              },
            ],
          },
        ]}
      />
      <Box
        position="absolute"
        top="50%"
        left="50%"
        color={theme.palette.secondary[400]}
        textAlign="center"
        pointerEvents="none"
        sx={{
          transform: isDashboard
            ? "translate(-75%, -170%)"
            : "translate(-50%, -100%)",
        }}
      >
        <Typography variant="h6">
         {formattedTotalAmount}
        </Typography>
      </Box>
    </Box>
  );
};

export default BreakdownChart;
