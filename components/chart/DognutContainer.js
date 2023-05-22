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

const DognutContainer = ({ count }) => {
  const isXs = useMediaQuery("(max-width:1360px)");

  const pendingCount = count?.totalPendingCount;
  const approvedCount = count?.totalAcceptedCount;
  const rejectedCount = count?.totalRejectedCount;

  const totalOrders = pendingCount + approvedCount + rejectedCount;

  const dougnutData = {
    labels: ["Pending", "Approved", "Rejected"],
    datasets: [
      {
        data: [2, 6, 2],
        backgroundColor: ["#FFCC66", "#66CC99", "#FF6666"],
        // borderColor: ["#ffc000", "#a8d08c", "#ff0000"],
        borderWidth: 0,
        barPercentage: isXs ? 0.8 : 0.7,
        categoryPercentage: 0.8,
        barThickness: "flex",

        yAxisID: "percentage",
      },
    ],
  };

  const maxVal = Math.max(...dougnutData.datasets[0].data) * 1.5;
  const option = {
    responsive: true,
    maintainAspectRatio: false,
    layout: {
      padding: {
        left: 10,
        right: 10,
        top: 10,
        bottom: 0,
      },
    },
    onClick: (evt, item) => {
      printElementAtEvent(item);
    },
    cutout: "60%",
    scales: {
      percentage: {
        ticks: {
          color: "black",
          backdropColor: "black",

          font: {
            size: isXs ? 13 : 15,
            weight: 600,
            family: "Roboto",
          },

          beginAtZero: true,
          stepSize: maxVal,
        },
        max: maxVal,
        callback: function (value, index, values) {
          if (value === 0 || value === maxVal) {
            return value;
          }
          return null;
        },
        grid: {
          display: true,
          drawBorder: false,
          borderDash: [0],
          borderDashOffset: 25,
        },
      },
      x: {
        ticks: {
          display: false,
          color: "black",
          backdropColor: "black",
          whiteSpace: "pre-line",
          percentage: 0.5,

          font: {
            size: isXs ? 8 : 12,
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
          drawBorder: false,
          borderDash: [10],
          borderDashOffset: 5,
          drawTicks: false,
        },
      },
    },
    plugins: {
      legend: {
        display: true,
        position: "bottom",
        align: "center",

        labels: {
          generateLabels: function (chart) {
            const data = chart.data;
            if (data.labels.length && data.datasets.length) {
              return data.labels.map(function (label, i) {
                const meta = chart.getDatasetMeta(0);
                const style = meta.controller.getStyle(i);
                return {
                  text: label,
                  fillStyle: style.backgroundColor,
                  hidden:
                    isNaN(data.datasets[0].data[i]) || meta.data[i].hidden,
                  lineWidth: style.borderWidth,
                  strokeStyle: style.borderColor,
                  pointStyle: "rect",
                };
              });
            }
            return [];
          },
          usePointStyle: true,
          boxWidth: 10,
          font: {
            size: isXs ? 10 : 13,
            weight: 600,
            family: "Roboto",
          },
        },
      },
      ChartDataLabels,
      datalabels: {
        display: function (context) {
          return context.dataset.data[context.dataIndex] !== 0;
        },
        align: "end",
        anchor: "end",
        color: "black",
        font: {
          size: isXs ? 13 : 15,
          weight: "bold",
          family: "Roboto",
        },
      },
      title: {
        display: false,
        text: "Order Approval Status",
        align: "center",
        color: "black",
        font: {
          size: 15,
          family: "Roboto",
        },
        padding: { top: 0, left: 50, right: 0, bottom: 20 },
      },
    },
    labels: {
      render: "percentage",
      precision: 2,
      padding: {
        top: isXs ? 10 : 15,
      },
    },
  };

  return (
    <>
      <Bar data={dougnutData} options={option} />
    </>
  );
};

export default DognutContainer;
