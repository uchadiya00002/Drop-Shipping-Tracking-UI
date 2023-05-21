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
  const sum = Object.values(data && data[1]).reduce(
    (acc, curr) => acc + curr,
    0
  );

  const totalOrdersForDeliver = data[1]?.forDelivery || 0;

  const delayed = data[1]?.delay || 0;

  const dueIn7d = data[1]?.dueIn7d || 0;
  const dueIn7To14d = data[1]?.dueIn7To14d || 0;
  const dueIn14To30d = data[1]?.dueIn14To30d || 0;
  const dueIn30dPlus = data[1]?.dueIn30dPlus || 0;
  // const delayedPercentage = (data[1]?.delay / totalOrdersForDeliver) * 100;

  // const dueIn7dPercentage = (data[1]?.dueIn7d / totalOrdersForDeliver) * 100;
  // const dueIn7To14dPercentage =
  //   (data[1]?.dueIn7To14d / totalOrdersForDeliver) * 100;
  // const dueIn14To30dPercentage =
  //   (data[1]?.dueIn14To30d / totalOrdersForDeliver) * 100;
  // const dueIn30dPlusPercentage =
  //   (data[1]?.dueIn30dPlus / totalOrdersForDeliver) * 100;
  const dougnutData = {
    labels: ["Delayed", "7D", "7-14D", "15-30D", "30+"],
    datasets: [
      {
        data: [delayed, dueIn7d, dueIn7To14d, dueIn14To30d, dueIn30dPlus],
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
        top: 10,
        bottom: 0,
        left: 10,
        right: 10,
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
        formatter: (value, context) => {
          if (value == 0) {
            return;
          } else {
            return `${Math.round((value / data[1]?.forDelivery) * 100).toFixed(
              0
            )}%`;
          }
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
        text: "Aging Report PO",
        align: "center",
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
      {totalOrdersForDeliver === 0 ? (
        <div className="flex justify-center items-center my-auto h-60 text-lg font-semibold">
          No Orders
        </div>
      ) : (
        <div className="h-full">
          <Doughnut data={dougnutData} options={option} />
        </div>
      )}
    </>
  );
};

export default DelayedOrdersChart;
