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
import { Bar } from "react-chartjs-2";
import { useRouter } from "next/router";
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

const BarGraph = ({ data }) => {
  const isXs = useMediaQuery("(min-width:1360px)");
  const route = useRouter();

  const getRandomNumbers = () => {
    const randomNumbers = [];
    for (let i = 0; i < 5; i++) {
      const randomNumber = Math.floor(Math.random() * 10); // Generate a random number between 0 and 9
      randomNumbers.push(randomNumber);
    }
    return randomNumbers;
  };

  const randomNumbersArray = getRandomNumbers();
  const barData = {
    labels: ["D MART", "WALLMART", "BEST BUY", "RELIANCE FRESH", "ONDOOR"],
    datasets: [
      {
        data: randomNumbersArray,
        barPercentage: 0.4,
        backgroundColor: [
          "#2C7BE5",
          "#FF6F61",
          "#FFC154",
          "#66CC99",
          "#B84EFF",
        ],
        barPercentage: 0.6,
        categoryPercentage: 0.7,
      },
    ],
  };

  const options = {
    responsive: true,
    indexAxis: "x",

    layout: {
      padding: 26,
    },
    scales: {
      x: {
        ticks: {
          display: true,
          color: "black",
          backdropColor: "black",
          padding: 5,
          whiteSpace: "pre-line",
          percentage: 0.5,
          font: {
            size: isXs ? 12 : 8,
            weight: 600,
            family: "Roboto",
          },
          autoSkip: false,
          maxRotation: 0,
          minRotation: 0,
          beginAtZero: true,
        },
        grid: {
          display: false,
          drawBorder: true,
          borderDash: [10],
          borderDashOffset: 5,
        },
      },
      y: {
        ticks: {
          display: false,
          color: "black",
          backdropColor: "black",
          font: {
            size: 12,
            weight: 600,
            family: "Roboto",
          },
          beginAtZero: true,
        },
        grid: {
          display: false,
          drawBorder: false,
          borderDash: [10],
          borderDashOffset: 5,
        },
      },
    },

    plugins: {
      legend: {
        display: false,
      },
      ChartDataLabels,
      datalabels: {
        align: "end",
        anchor: "end",
        color: "black",
        font: {
          size: isXs ? 15 : 10,
          weight: "bold",
          family: "Roboto",
        },
      },
    },
  };

  return (
    <>
      <div className="w-[100%]">
        <Bar options={options} data={barData} className="my-auto " />
      </div>
    </>
  );
};

export default BarGraph;
