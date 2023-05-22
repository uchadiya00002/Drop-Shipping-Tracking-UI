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
import { Doughnut, Pie } from "react-chartjs-2";
import { useMediaQuery } from "@mui/material";
// Register the plugin to all charts:
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  ChartDataLabels,
  Title
);

const CriticalPartChart = ({ count }) => {
  const isXs = useMediaQuery("(max-width:1360px)");

  // function createDiagonalPattern(color = "black") {
  //   let shape = document.createElement("canvas");
  //   shape.width = 5;
  //   shape.height = 3;
  //   let c = shape.getContext("2d");
  //   c.strokeStyle = color;
  //   c.beginPath();
  //   c.moveTo(5, 0);
  //   c.lineTo(5, 0);
  //   c.stroke();
  //   c.beginPath();
  //   c.moveTo(0, 0);
  //   c.lineTo(5, 0);
  //   c.stroke();
  //   return c.createPattern(shape, "repeat");
  // }
  const getRandomNumbers = () => {
    const randomNumbers = [];
    for (let i = 0; i < 4; i++) {
      const randomNumber = Math.floor(Math.random() * 10); // Generate a random number between 0 and 9
      randomNumbers.push(randomNumber);
    }
    return randomNumbers;
  };

  const randomNumbersArray = getRandomNumbers();
  console.log(randomNumbersArray);
  const halfChartData = {
    datasets: [
      {
        label: "# of Votes",
        data: randomNumbersArray,
        backgroundColor: ["#F85D79", "#2C7BE5", "#41a890", "#F17B33"],
        borderWidth: 0,
      },
    ],
    labels: ["Ordered", "Shipped", "Received", "Rejected"],
  };

  const halfChartOption = {
    cutout: "65%",
    responsive: true,
    maintainAspectRatio: false,
    rotation: 0,
    layout: {
      padding: isXs ? 6 : 10,
    },

    plugins: {
      legend: {
        display: true,
        position: "bottom",
        labels: {
          padding: 10,
          boxWidth: isXs ? 10 : 15,

          font: {
            size: isXs ? 10 : 13,
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
        align: "center",
        borderRadius: 10,
        borderColor: "black",
        offset: -10,
        padding: 6,
        color: "black",

        padding: {
          left: 7,
          right: 7,
          top: 5,
          bottom: 5,
          minWidth: 20,
        },
        font: {
          size: isXs ? 10 : 12,
          weight: "bold",
          family: "Roboto",
        },
      },
      title: {
        display: false,
        text: "Grand Total: 100%",
        position: "top",
        align: "center",
        anchor: "center",
        padding: isXs ? 10 : 10,
      },
    },
    labels: {
      render: "percentage",
      precision: 2,
    },
  };
  return (
    <>
      <div
        id="myChart"
        className=" mx-2 lg:mx-1 whitespace-nowrap lg:h-[190px] h-[220px] min-h-[120px] "
      >
        <Doughnut
          className="col-span-1  flex-col-reverse "
          data={halfChartData}
          options={halfChartOption}
        />
      </div>
    </>
  );
};

export default CriticalPartChart;
