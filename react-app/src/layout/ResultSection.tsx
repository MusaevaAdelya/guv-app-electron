import ResultBanner from "../components/ResultBanner";
import BannerGroup from "../components/BannerGroup";
import { useAppSelector } from "../redux/store";
import dayjs from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

function ResultSection() {
  const { entries } = useAppSelector((state) => state.entries);
  const { from, to } = useAppSelector((state) => state.guv);

  const fromDate = from ? dayjs(from) : null;
  const toDate = to ? dayjs(to) : null;

  const filtered = entries.filter((entry) => {
    const date = dayjs(entry.datum);
    const inRange =
      (!fromDate || date.isSameOrAfter(fromDate, "day")) &&
      (!toDate || date.isSameOrBefore(toDate, "day"));
    return inRange;
  });

  const income = filtered
    .filter((e) => e.type === "profit")
    .reduce((sum, e) => sum + e.betrag, 0);

  const outcome = filtered
    .filter((e) => e.type === "loss" || e.type === "amortization")
    .reduce((sum, e) => sum + Math.abs(e.betrag), 0); // чтобы было положительное число

  const tax = filtered
    .filter((e) => e.type === "loss")
    .reduce((sum, e) => sum + e.umsatzsteuer, 0);

  const brutto = income - outcome;
  const netto = brutto - tax;

  const format = (value: number) =>
    value.toLocaleString("de-DE", { minimumFractionDigits: 2 }) + " €";

  return (
    <section className="flex flex-col lg:flex-row gap-5 mt-10">
      <BannerGroup className="flex-1 gap-5">
        <ResultBanner
          title="Einnahmen"
          value={format(income)}
          classStyle="rounded-3xl flex-1"
          inlineStyle={{
            backgroundColor: "var(--color-accent)",
            color: "var(--color-text)",
          }}
        />
        <ResultBanner
          title="Ausgaben"
          value={format(outcome)}
          classStyle="rounded-3xl flex-1"
          inlineStyle={{
            backgroundColor: "var(--color-accent-2)",
            color: "white",
          }}
        />
      </BannerGroup>

      <BannerGroup className="flex-1">
        <ResultBanner
          title="Brutto"
          value={format(brutto)}
          classStyle="rounded-l-3xl border-3 border-dashed border-accent-2 flex-1"
        />
        <ResultBanner
          title="Netto"
          value={format(netto)}
          classStyle="rounded-r-3xl border-3 border-dashed border-accent flex-1"
        />
      </BannerGroup>
    </section>
  );
}

export default ResultSection;
