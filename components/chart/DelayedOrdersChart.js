import React from "react";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  Title,
  LinearScale,
  CategoryScale,
  BarElement,
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { Doughnut } from "react-chartjs-2";
import { useMediaQuery } from "@mui/material";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  ChartDataLabels
);

const DelayedOrdersChart = ({ data }) => {
  const isXs = useMediaQuery("(max-width:1360px)");
  const getRandomNumbers = () => {
    const randomNumbers = [];
    for (let i = 0; i < 5; i++) {
      const randomNumber = Math.floor(Math.random() * 10); // Generate a random number between 0 and 9
      randomNumbers.push(randomNumber);
    }
    return randomNumbers;
  };

  const randomNumbersArray = getRandomNumbers();
  const dougnutData = {
    labels: ["Delayed", "7D", "7-14D", "15-30D", "30+"],
    datasets: [
      {
        data: randomNumbersArray,
        backgroundColor: ["red", "#F17B33", "#facd59", "#66a2df", "#93d354"],
        borderWidth: 0,
      },
    ],
  };

  const option = {
    responsive: true,
    maintainAspectRatio: false,
    layout: {
      padding: {
        left: 25,
        right: 25,
        top: 25,
        bottom: 25,
      },
    },

    cutout: "65%",
    plugins: {
      legend: {
        display: true,
        position: "bottom",
        labels: {
          boxWidth: isXs ? 10 : 15,
          font: {
            size: isXs ? 9 : 12,
            weight: "bold",
            family: "Roboto",
          },
        },
      },
      ChartDataLabels,
      datalabels: {
        display: function (context) {
          return context.dataset.data[context.dataIndex] !== 0;
        },

        align: "start",
        borderColor: "black",
        anchor: "end",
        color: "#e7e6e6",
        font: {
          size: 10,
          weight: "bold",
          family: "Roboto",
        },
        padding: 2,
      },
      title: {
        display: true,
        text: "Purchase Order Status",
        align: "left",
        position: "top",
        color: "black",
        font: {
          size: isXs ? 15 : 18,
          family: "Roboto",
        },
        padding: {
          top: isXs ? 5 : 10,
          bottom: isXs ? 8 : 10,
        },
      },
    },
    labels: {
      render: "percentage",
      precision: 2,
      padding: {
        top: isXs ? 5 : 10,
      },
    },
  };

  return (
    <>
      <div className="w-full">
        <Doughnut data={dougnutData} options={option} />
      </div>
    </>
  );
};

export default DelayedOrdersChart;
