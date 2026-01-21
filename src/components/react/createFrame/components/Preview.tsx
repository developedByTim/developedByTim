import type { useLogicResult } from "../useLogic"
import css from './Preview.module.css'
interface PreviewProps {
    logic: useLogicResult
    className?:string
}
const url = 'https://images.unsplash.com/photo-1600354587397-681c16c184bf?q=80&w=1760&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'

export default function Preview({logic, className}: PreviewProps) {
    const renderFrame = () => {
        switch (logic.frameType) {
            case "classic":
                return <div style={{ padding: `${logic.frameWidth}px`, backgroundColor: logic.frameColor }}><img src={url}/></div>;
            case "35":
            case "120":
               return <div style={{ padding: `4%`, backgroundColor: logic.frameColor, position: 'relative', color: logic.bwFilter ? '#ddd':'#ffc376' }} className={css.filmFrame}>
                <span className={css.frameIndex}>
                    <span className={css.frameIndexArrow}><svg  viewBox="0 0 970 640" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M969.75 319.563L-3.00981e-05 639.127L-2.16094e-06 4.91636e-05L969.75 319.563Z" fill="currentColor"/>
</svg></span>
                    <span>{logic.frameIndex}</span>
                    
                    </span>
                <img src={url}/>
                <span className={css.filmInfo}>{camelCaseToUpperSpaced(logic.filmStock)} {logic.filmSpeed}</span>
                </div>;
        }
    }
    return <div className={className}>
        {renderFrame()}
    </div>
}
 function camelCaseToUpperSpaced(value: string) {
  return value
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .toUpperCase()
}