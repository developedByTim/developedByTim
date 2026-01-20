import type { useLogicResult } from "../useLogic"

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
               return <div style={{ padding: `${logic.frameWidth}px`, backgroundColor: logic.frameColor }}><img src={url}/></div>;
        }
    }
    return <div className={className}>
        {renderFrame()}
    </div>
}