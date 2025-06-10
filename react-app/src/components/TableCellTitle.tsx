import {BanknotesIcon} from "@heroicons/react/24/outline"

type TableCellTitleProps={
    title:string, 
    type:"profit"|"loss"|"amortization"
}

function TableCellTitle({title, type}:TableCellTitleProps) {
  return (
    <p className="flex gap-4"><BanknotesIcon style={{color:type=="profit"?"var(--color-accent)":(type=="loss"?"var(--color-accent-2)":"var(--color-accent-3)")}} className="w-7"/>{title}</p>
  )
}

export default TableCellTitle