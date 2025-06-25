import { useAppSelector } from "../redux/store";
import dayjs from "dayjs";
import { BarChart } from '@mui/x-charts/BarChart';

import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";

dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

const margin = { right: 24 };

type CustomLineChartProps = {
  className: string;
};

function CustomLineChart({ className }: CustomLineChartProps) {
  const { entries } = useAppSelector((state) => state.entries);
  const { from, to } = useAppSelector((state) => state.guv);

  const fromDate = from ? dayjs(from) : null;
  const toDate = to ? dayjs(to) : null;

  const filtered = entries.filter((entry) => {
    const entryDate = dayjs(entry.datum);
    const afterFrom = !fromDate || entryDate.isSameOrAfter(fromDate, "day");
    const beforeTo = !toDate || entryDate.isSameOrBefore(toDate, "day");
    return afterFrom && beforeTo;
  });

  const groupedByMonth: Record<string, { profit: number; loss: number }> = {};

  filtered.forEach((entry) => {
    const monthKey = dayjs(entry.datum).format("YYYY-MM");
    if (!groupedByMonth[monthKey])
      groupedByMonth[monthKey] = { profit: 0, loss: 0 };

    if (entry.type === "profit") {
      groupedByMonth[monthKey].profit += entry.betrag;
    } else if (entry.type === "loss" || entry.type === "amortization") {
      groupedByMonth[monthKey].loss += Math.abs(entry.betrag);
    }
  });

  const labels = Object.keys(groupedByMonth).sort();
  const profitData = labels.map((m) => groupedByMonth[m].profit);
  const lossData = labels.map((m) => groupedByMonth[m].loss);

  return (
    <div className={"bg-white rounded-3xl p-3 " + className}>
      <p className="text-2xl ml-6 my-3">
        Monatliche Entwicklung von Einnahmen und Ausgaben
      </p>

      <BarChart
        height={300}
        series={[
          {
            data: profitData,
            label: "Einnahmen",
            color: "var(--color-accent)",
            id: "profitId",
          },
          {
            data: lossData,
            label: "Ausgaben",
            color: "var(--color-accent-2)",
            id: "lossId",
          },
        ]}
        xAxis={[
          {
            scaleType: "band",
            data: labels.map((m) => dayjs(m).format("MMMM")),
          },
        ]}
        yAxis={[{ width: 50 }]}
        margin={margin}
      />
    </div>
  );
}

export default CustomLineChart;
