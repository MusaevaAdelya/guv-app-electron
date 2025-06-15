import CustomLineChart from "../components/CustomLineChart";
import CategoryCharts from "../components/CategoryCharts"; // ✅ Используем реальные данные

function ChartsSections() {
  return (
    <section className="mt-10">
      <img
        src="/images/wave-upper.svg"
        alt="wave decoration"
        className="w-full"
      />
      <div className="bg-black z-10 lg:-my-13 -my-1">
        <div className="container mx-auto flex lg:flex-row flex-col gap-6 z-10 py-9">
          <CustomLineChart className="flex-1 z-10" />
          <CategoryCharts />
        </div>
      </div>
      <img
        src="/images/wave-bottom.svg"
        alt="wave decoration"
        className="w-full"
      />
    </section>
  );
}

export default ChartsSections;
