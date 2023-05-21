import React from "react";

const chapter = [
  { duration: "15 min" },
  { duration: "30 min" },
  { duration: "45 min" },
  { duration: "60 min" },
];

const TotalDuration = () => {
  const totalMinutes = chapter.reduce((acc, cur) => {
    const durationInMinutes = parseInt(cur.duration.split(" ")[0]);
    return acc + durationInMinutes;
  }, 0);

  return (
    <div>
      <h1>Total Duration:</h1>
      <p>{totalMinutes} min</p>
    </div>
  );
};

export default TotalDuration;
