import { useState } from "react"
import type { FrameType } from "./FrameGenerator.constaints"

export const useLogic = () => {
    const [frameType, setFrameType] = useState<FrameType>("classic")
    const [frameColor, setFrameColor] = useState<string>("#000000")
    const [frameWidth, setFrameWidth] = useState<number>(10)
    const [filmStock, setFilmStock] = useState<string>("Kodak Gold")
    const [filmSpeed, setFilmSpeed] = useState<number>(200)
    const [frameIndex, setFrameIndex] = useState<number>(1)
    const [bwFilter, setBWFilter] = useState<boolean>(false)
    return {frameType, setFrameType, frameColor, setFrameColor, frameWidth, setFrameWidth, filmStock, setFilmStock, filmSpeed, setFilmSpeed, frameIndex, setFrameIndex, bwFilter, setBWFilter}
}
export type useLogicResult = ReturnType<typeof useLogic>