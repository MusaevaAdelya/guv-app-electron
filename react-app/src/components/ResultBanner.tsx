type ResultBannerType={
    title:string, 
    value:string,
    classStyle?:string,
    inlineStyle?:React.CSSProperties
}

function ResultBanner({title, value, classStyle,inlineStyle}:ResultBannerType) {
  return (
    <div style={inlineStyle} className={classStyle+" flex flex-col md:px-8 md:py-4 px-5 py-3" }>
        <p className="md:text-xl text-lg">{title}</p>
        <p className="md:text-4xl text-2xl">{value}</p>
    </div>
  )
}

export default ResultBanner
