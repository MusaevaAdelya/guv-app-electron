import DatePickerGroup from "../components/DatePickerGroup";
import Highlight from "../components/Highlight";

function Header() {
  return (
    <section className="flex flex-col lg:flex-row gap-7 ">
      <p className="text-3xl flex-grow text-text whitespace-nowrap">
        <Highlight color="accent">Gewinn-</Highlight> und{" "}
        <Highlight color="accent-2">Verlust</Highlight>rechnung
      </p>
      <div className="self-end lg:self-auto lg:ml-auto">
        <DatePickerGroup />
      </div>
    </section>
  );
}

export default Header;
