import ResultBanner from "../components/ResultBanner";
import BannerGroup from "../components/BannerGroup";

function ResultSection() {
  return (
    <section className="flex flex-col lg:flex-row gap-5 mt-10">
      <BannerGroup className="flex-1 gap-5">
        <ResultBanner
          title="Einkommen"
          value="40.000 €"
          classStyle="rounded-3xl flex-1"
          inlineStyle={{
            backgroundColor: "var(--color-accent)",
            color: "var(--color-text)",
          }}
        />
        <ResultBanner
          title="Entkommen"
          value="20.000 €"
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
        value="20.000 €"
        classStyle="rounded-l-3xl border-3 border-dashed border-accent-2 flex-1"
        />
      <ResultBanner
        title="Netto"
        value="20.000 €"
        classStyle="rounded-r-3xl border-3 border-dashed border-accent flex-1"
        />
        </BannerGroup>
    </section>
  );
}

export default ResultSection;
