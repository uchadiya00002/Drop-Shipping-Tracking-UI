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
  let labels = [];
  let actualData = [];
  let count = [];
  let isCritical = [];
  let supplierName = [];
  let supplierId = [];

  data &&
    data[0] &&
    Object.keys(data[0]).map((key) => {
      labels.push(key);
      actualData.push(data[0][key]);
    });

  actualData.map((data, idx) => {
    const suppData = data?.supplierName.split(" ");
    count.push(data?.count);
    supplierName.push(suppData);
    isCritical.push(data?.isCritical);
    supplierId.push(data?.supplierId);
  });
  const sum = count?.reduce((acc, curr) => acc + curr, 0);
  const barData = {
    labels: supplierName,
    datasets: [
      {
        data: count,
        barPercentage: 0.4,
        backgroundColor: isCritical?.map((val, idx) =>
          val ? "red" : "#5196DB"
        ),
        barPercentage: count?.length <= 2 ? 0.2 : 0.6,
        categoryPercentage: count?.length <= 2 ? 0.5 : 0.7,
      },
    ],
  };

  const printElementAtEvent = (element) => {
    if (!element.length) return;
    const { datasetIndex, index } = element[0];
    route.push({
      pathname: "/order/purchaseOrder",
      query: {
        supplierId: supplierId[index],
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
      {sum === 0 ? (
        <div className="flex justify-center items-center my-auto h-56 text-lg font-semibold">
          No Orders
        </div>
      ) : (
        <div className="w-[90%]">
          <Bar options={options} data={barData} className="my-auto " />
        </div>
      )}
    </>
  );
};

export default BarGraph;
