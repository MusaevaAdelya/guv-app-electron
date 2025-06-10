type TableCellCategory = {
  title: string;
  type: "profit" | "loss" | "amortization";
};

function hexToRgb(hex:string) {
  const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  hex = hex.replace(shorthandRegex, (_, r, g, b) => r + r + g + g + b + b);

  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`
    : null;
}

function TableCellCategory({ title, type }: TableCellCategory) {
  const color =
    type == "profit"
      ? "#1F9254"
      : type == "loss"
      ? "#F53861"
      : "#476EE3";
  return (
    <div className="flex justify-end">

    <p className="py-0.5 px-5 rounded-2xl font-bold" style={{ backgroundColor: `rgba(${hexToRgb(color)}, 0.3)` }}>
      <span style={{ color }}>{title}</span>
    </p>
    </div>
  );
}

export default TableCellCategory;
