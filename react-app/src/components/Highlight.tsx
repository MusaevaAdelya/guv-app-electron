import type { Props } from '../types/types'

type HightlightProps=Props &{
    color:string
}


function Highlight({children, color}:HightlightProps) {
  return (
    <span className={`bg-${color}/70 rounded-4xl p-1`}>{children}</span>
  )
}

export default Highlight