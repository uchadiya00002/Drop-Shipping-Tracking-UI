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

const ReasonBar = ({ data }) => {
  const isXs = useMediaQuery("(min-width:1360px)");
  // const route = useRouter();

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
    labels: ["Road Repair", "Product Damage", "Item Shortage", "Missing"],
    datasets: [
      {
        data: randomNumbersArray,
        backgroundColor: ["#2C7BE5", "#FF6F61", "#FFC154", "#66CC99"],
        barPercentage: 0.3,
        borderColor: "#5196DB",
        barPercentage: 0.6,
        categoryPercentage: 0.7,
      },
    ],
  };

  const printElementAtEvent = (element) => {
    if (!element.length) return;
    const { datasetIndex, index } = element[0];
    route.push({
      pathname: "/transactionalData",
      query: {
        reason: barData.labels[index],
      },
    });
  };

  const options = {
    responsive: true,
    indexAxis: "x",
    onClick: (evt, item) => {
      printElementAtEvent(item);
    },
    layout: {
      padding: {
        left: 25,
        right: 25,
        top: 25,
        bottom: 25,
      },
    },
    scales: {
      x: {
        ticks: {
          display: true,

          color: "black",
          backdropColor: "black",
          font: {
            size: isXs ? 12 : 8,
            weight: 600,
            family: "Roboto",
          },
          autoSkip: false,
          maxRotation: 0,
          minRotation: 0,
          beginAtZero: false,
        },
        grid: {
          display: false,
          drawBorder: true,
        },
      },
      y: {
        ticks: {
          display: false,
          color: "black",
          backdropColor: "black",
          font: {
            size: isXs ? 15 : 12,
            weight: 600,
            family: "Roboto",
          },
          beginAtZero: false,
        },
        grid: {
          display: false,
          drawBorder: false,
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
      title: {
        display: false,
        text: "Based On Delayed Orders",
        color: "black",
        align: "end",
        position: "top",
        font: {
          size: isXs ? 15 : 13,
          family: "Roboto",
        },
      },
    },
  };

  return (
    <>
      <div className="w-[100%]">
        <Bar options={options} data={barData} />
      </div>
    </>
  );
};

export default ReasonBar;
