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
  let labels = [];
  let actualData = [];
  count?.collab &&
    Object.keys(count?.collab).map((key) => {
      labels.push(key);
      actualData.push(count?.collab[key]);
    });

  console.log(count?.collab);
  const sum =
    count?.collab?.orderedCount +
    count?.collab?.shippedCount +
    count?.collab?.partiallyShippedCount +
    count?.collab?.receivedCount +
    count?.collab?.partiallyReceivedCount +
    count?.collab?.rejectedCount +
    count?.collab?.partiallyRejectedCount +
    count?.collab?.servicedCount +
    count?.collab?.partiallyServicedCount;
  console.log(sum);
  function createDiagonalPattern(color = "black") {
    let shape = document.createElement("canvas");
    shape.width = 5;
    shape.height = 3;
    let c = shape.getContext("2d");
    c.strokeStyle = color;
    c.beginPath();
    c.moveTo(5, 0);
    c.lineTo(5, 0);
    c.stroke();
    c.beginPath();
    c.moveTo(0, 0);
    c.lineTo(5, 0);
    c.stroke();
    return c.createPattern(shape, "repeat");
  }

  const halfChartData = {
    datasets: [
      {
        label: "# of Votes",
        // data: [2, 2, 2, 2, 2, 2, 2, 2, 2],
        data: [
          count?.collab?.orderedCount,
          count?.collab?.shippedCount,
          count?.collab?.partiallyShippedCount,
          count?.collab?.receivedCount,
          count?.collab?.partiallyReceivedCount,
          count?.collab?.rejectedCount,
          count?.collab?.partiallyRejectedCount,
          count?.collab?.servicedCount,
          count?.collab?.partiallyServicedCount,
        ],
        backgroundColor: [
          "#2196F3",
          "#8faadc",
          createDiagonalPattern("#8faadc"),
          "#92d050",
          createDiagonalPattern("#92d050"),
          "#ff0000",
          createDiagonalPattern("#ff0000"),
          "#ff8c00",
          createDiagonalPattern("#FF8C00"),
        ],
        borderColor: [
          "#2196F31",
          "#8faadc",
          createDiagonalPattern("#8faadc"),
          "#92d050",
          createDiagonalPattern("#92d050"),
          "#ff0000",
          createDiagonalPattern("#ff0000"),
          "#FF8C00",
          createDiagonalPattern("#FF8C00"),
        ],
        borderWidth: 0,
      },
    ],
    labels: [
      "Ordered",
      "Shipped",
      "Part. Shipped",
      "Received",
      "Part. Received",
      "Rejected",
      "Part. Rejected",
      "Serviced",
      "Part. Serviced",
    ],
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
        position: "right",
        labels: {
          padding: 8,
          boxWidth: isXs ? 10 : 15,

          font: {
            size: isXs ? 8 : 13,
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
  console.log(sum);
  return (
    <>
      {sum === 0 ? (
        <div className="flex justify-center items-center my-auto h-36 text-lg font-semibold">
          No Orders
        </div>
      ) : (
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
      )}
    </>
  );
};

export default CriticalPartChart;
