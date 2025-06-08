import { LineChart, lineElementClasses } from "@mui/x-charts/LineChart";

const margin = { right: 24 };
const pData = [2400, 1398, 9800, 3908, 4800, 3800, 4300];
const amtData = [2400, 2210, 0, 2000, 2181, 2500, 2100];
const xLabels = [
  "Page A",
  "Page B",
  "Page C",
  "Page D",
  "Page E",
  "Page F",
  "Page G",
];

type CustomLineChart={
  className:string
}

function CustomLineChart({className}:CustomLineChart) {
  return (
    <div className={"bg-white rounded-3xl p-3 "+className}>
      <p className="text-2xl ml-6 my-3">Company performance</p>
      <LineChart
        height={300}
        series={[
          {
            data: pData,
            label: "Gewinn",
            area: true,
            showMark: false,
            color:"var(--color-accent)",
          },
          {
            data: amtData,
            label: "Verlust",
            area: true,
            showMark: false,
            color:"var(--color-accent-2)"
          },
        ]}
        xAxis={[{ scaleType: "point", data: xLabels, }]}
        yAxis={[{ width: 50 }]}
        sx={{
          [`& .${lineElementClasses.root}`]: {
            strokeWidth: 2.5,
          },
          fontSize:"2rem"
        }}
        margin={margin}
        
      />
    </div>
  );
}

export default CustomLineChart;
