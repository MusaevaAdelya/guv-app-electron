import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../redux/store";
import { fetchCategoryStatistics } from "../redux/entriesSlice";
import CustomPieChart from "./CustomPieChart";

function CategoryCharts() {
  const dispatch = useAppDispatch();
  const { categoryStatistics } = useAppSelector((state) => state.entries);
  const { from, to } = useAppSelector((state) => state.guv);
  const { entries } = useAppSelector((state) => state.entries);

  useEffect(() => {
  if (entries.length > 0) {
    dispatch(fetchCategoryStatistics());
  }
}, [dispatch, entries, from, to]);

  return (
    <div className="flex gap-6 z-10">
      <CustomPieChart
        className="flex-1"
        title="Gewinn Kategorien"
        data={categoryStatistics.profitCategories}
      />
      <CustomPieChart
        className="flex-1"
        title="Verlust Kategorien"
        data={categoryStatistics.lossCategories}
      />
    </div>
  );
}

export default CategoryCharts;
