import { PieChart } from '@mui/x-charts/PieChart';


const valueFormatter = (item: { value: number }) => `${item.value}%`;

type CustomPieChart={
  className:string,
  title:string,
  data:{label:string, value:number}[]
}

function CustomPieChart({className, title, data}:CustomPieChart) {
  return (
    <div className={'bg-white flex flex-col rounded-3xl '+className}>
      <p className="text-2xl ml-6 my-6">{title}</p>
      <PieChart
      series={[
        {
          data,
          highlightScope: { fade: 'global', highlight: 'item' },
          faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' },
          valueFormatter,
        },
      ]}
      height={200}
      width={200}
    />
    </div>
  )
}

export default CustomPieChart