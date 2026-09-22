// Required imports
import { useContext } from "react"
import { PlayerContext } from "../../videoplayer.player.component"

export function ReturnBackControlOverlay() {
    const videoPlayerContext = useContext(PlayerContext)

    if (!videoPlayerContext) {
        return null
    }

    const { onReturnBack } = videoPlayerContext

    return (
        <button
            type="button"
            className="flex items-center justify-center w-10 h-10 rounded-xl bg-black/40 hover:bg-[rgba(108,99,255,0.3)] border border-white/10 hover:border-[rgba(108,99,255,0.5)] text-[#E8E8FF] hover:text-white backdrop-blur-md transition-all cursor-pointer shadow-lg"
            onClick={onReturnBack}
            aria-label="Return to file browser"
        >
            <span className="material-symbols-rounded" style={{ fontSize: "22px" }}>
                arrow_back
            </span>
        </button>
    )
}

