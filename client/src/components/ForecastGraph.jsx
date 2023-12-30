import { useRef, useState } from "react";
import Chart from "chart.js/auto";
import { Bar, getElementAtEvent } from "react-chartjs-2";
import { StoreData } from "../Data";
import Button from '@mui/material/Button';
const ForecastGraph = () => {
  const chartref = useRef(null);
  const [index, setIndex] = useState([]);
  const [userData, setUserData] = useState({
    labels: StoreData.map((data) => data.name),
    datasets: [
      {
        label: "Total_Sales",
        data: StoreData.map((data) => data.Sales),
        backgroundColor: [
          "rgba(75,192,192,1)",
          "#ecf0f1",
          "#50AF95",
          "#f3ba2f",
          "#2a71d0",
        ],
        borderColor: "black",
        borderWidth: 2,
      },
    ],
  });
  const handleStateChange = (currindex) => {
    setUserData(
      index.length === 0
        ? {
            labels: StoreData[currindex].departments.map(
              (departmentName) => departmentName.department
            ),
            datasets: [
              {
                label: "Department_Wise_sales",
                data: StoreData[currindex].departments.map(
                  (departmentName) => departmentName.sales
                ),

                backgroundColor: [
                  "rgba(75,192,192,1)",
                  "#ecf0f1",
                  "#50AF95",
                  "#f3ba2f",
                  "#2a71d0",
                ],
              },
            ],
          }
        : {
            labels: Object.keys(
              StoreData[index[index.length - 1]].departments[currindex]
                .subCategory
            ),
            datasets: [
              {
                label: "Department_Wise_sales",
                data: Object.values(
                  StoreData[index[index.length - 1]].departments[currindex]
                    .subCategory
                ),
              },
            ],
          }
    );
  };

  const handleBackChange = (currindex) => {
    setUserData(
      index.length === 2
        ? {
            labels: StoreData[currindex].departments.map(
              (departmentName) => departmentName.department
            ),
            datasets: [
              {
                label: "Department_Wise_sales",
                data: StoreData[currindex].departments.map(
                  (departmentName) => departmentName.sales
                ),
                backgroundColor: [
                  "rgba(75,192,192,1)",
                  "#ecf0f1",
                  "#50AF95",
                  "#f3ba2f",
                  "#2a71d0",
                ],
              },
            ],
          }
        : {
            labels: StoreData.map((data) => data.name),
            datasets: [
              {
                label: "Total_Sales",
                data: StoreData.map((data) => data.Sales),
                backgroundColor: [
                  "rgba(75,192,192,1)",
                  "#ecf0f1",
                  "#50AF95",
                  "#f3ba2f",
                  "#2a71d0",
                ],
                borderColor: "black",
                borderWidth: 2,
              },
            ],
          }
    );
  };

  // IF YOU SEE THIS COMMENT: I HAVE GOOD EYESIGHT
  const handleClick = (e) => {
    console.log("event,", getElementAtEvent(chartref.current, e));
    const currindex = getElementAtEvent(chartref.current, e)[0].index;

    handleStateChange(currindex);
    if (index.length < 2) {
      setIndex((prevIndex) => [...prevIndex, currindex]);
    }
  };
  console.log("count", index);
  const handleBackClick = (e) => {
    const indexVal = index.length - 1;
    handleBackChange(index[indexVal]);
    setIndex((prevIndex) => prevIndex.splice(indexVal, 1));
  };

  return (
    <div className="App" >
      <div style={{ width: 700, display: "flex", flexDirection: "column" }}>
        
        <Button variant="contained" onClick={handleBackClick} style={{ width: '100px', height: '40px' }}>Back</Button>
        <Bar ref={chartref} data={userData} onClick={handleClick} />
      </div>
    </div>
  );
};

export default ForecastGraph;
