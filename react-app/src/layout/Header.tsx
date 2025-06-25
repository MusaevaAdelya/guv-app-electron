import DatePickerGroup from "../components/DatePickerGroup";
import Highlight from "../components/Highlight";
import ExportToExcelButton from "../components/ExportToExcelButton";


function Header() {
  return (
    <section className="flex flex-col lg:flex-row gap-7 ">
      <p className="md:text-3xl text-2xl flex-grow text-text whitespace-nowrap">
        <Highlight color="var(--color-accent)">Gewinn-</Highlight> und{" "}
        <Highlight color="var(--color-accent-2)">Verlust</Highlight>rechnung
      </p>
      <div className="self-end lg:self-auto lg:ml-auto">
        <DatePickerGroup />
      </div>
      <ExportToExcelButton/>
      
    </section>
  );
}

export default Header;
