import CustomLineChart from "../components/CustomLineChart";
import CustomPieChart from "../components/CustomPieChart";

const mockData1 = [
  {
    label: 'Windows',
    value: 72.72,
  },
  {
    label: 'OS X',
    value: 16.38,
  },
  {
    label: 'Linux',
    value: 3.83,
  },
  {
    label: 'Chrome OS',
    value: 2.42,
  },
  {
    label: 'Other',
    value: 4.65,
  },
];

const mockData2 = [
  {
    label: 'Android',
    value:40,
  },
  {
    label: 'iOS',
    value: 28,
  },
  {
    label: 'Other',
    value: 30,
  },
];

function ChartsSections() {
  return (
    <section className=" mt-10">
      <img
        src="/images/wave-upper.svg"
        alt="wave decoration"
        className="w-full "
      />
      <div className=" bg-black z-10 lg:-my-13 -my-1">
        <div className="container mx-auto flex  lg:flex-row flex-col gap-6 z-10 py-9">
          <CustomLineChart className="flex-1 z-10" />
          <div className="flex-1 flex gap-6 md:flex-row flex-col z-10">
            <CustomPieChart className="flex-1" title="Gewinn Categories" data={mockData1}/>
            <CustomPieChart className="flex-1" title="Verlust Categories" data={mockData2}/>
          </div>
        </div>
      </div>
      <img
        src="/images/wave-bottom.svg"
        alt="wave decoration"
        className="w-full "
      />
    </section>
  );
}

export default ChartsSections;
