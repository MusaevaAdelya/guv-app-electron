import type { Props } from '../types/types'

type HightlightProps=Props &{
    color:string
}


function Highlight({children, color}:HightlightProps) {
  return (
    <span className="rounded-4xl p-1" style={{backgroundColor: `color-mix(in srgb, ${color} 70%, transparent)`}}>{children}</span>
  )
}

export default Highlight