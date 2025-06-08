import type { Props } from "../types/types"

type BannerGroupProps=Props &{
  className?:string
}

function BannerGroup({className, children }:BannerGroupProps) {
  return (
    <div className={"flex "+className}>
        {children}
    </div>
  )
}

export default BannerGroup