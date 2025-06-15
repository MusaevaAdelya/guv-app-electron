import { useEffect } from "react";
import { LineChart, lineElementClasses } from "@mui/x-charts/LineChart";
import { useAppDispatch, useAppSelector } from "../redux/store";
import { fetchStatistics } from "../redux/entriesSlice";
import dayjs from "dayjs";

const margin = { right: 24 };

type CustomLineChartProps = {
  className: string;
};

function CustomLineChart({ className }: CustomLineChartProps) {
  const dispatch = useAppDispatch();
  const { statistics } = useAppSelector((state) => state.entries);

  useEffect(() => {
    dispatch(fetchStatistics());
  }, [dispatch]);

  const merged: Record<string, { profit: number; loss: number }> = {};

  statistics?.profits?.forEach((e) => {
    const month = dayjs(e.datum).format("MMMM");
    merged[month] = merged[month] || { profit: 0, loss: 0 };
    merged[month].profit += e.betrag;
  });

  statistics?.losses?.forEach((e) => {
    const month = dayjs(e.datum).format("MMMM");
    merged[month] = merged[month] || { profit: 0, loss: 0 };
    merged[month].loss += Math.abs(e.betrag);
  });

  const labels = Object.keys(merged);
  const profitData = labels.map((m) => merged[m].profit);
  const lossData = labels.map((m) => merged[m].loss);

  return (
    <div className={"bg-white rounded-3xl p-3 " + className}>
      <p className="text-2xl ml-6 my-3">Company performance</p>
      <LineChart
        height={300}
        series={[
          {
            data: profitData,
            label: "Gewinn",
            area: true,
            showMark: false,
            color: "var(--color-accent)",
          },
          {
            data: lossData,
            label: "Verlust",
            area: true,
            showMark: false,
            color: "var(--color-accent-2)",
          },
        ]}
        xAxis={[{ scaleType: "point", data: labels }]}
        yAxis={[{ width: 50 }]}
        sx={{
          [`& .${lineElementClasses.root}`]: {
            strokeWidth: 2.5,
          },
          fontSize: "2rem",
        }}
        margin={margin}
      />
    </div>
  );
}

export default CustomLineChart;
