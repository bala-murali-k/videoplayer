// Required imports
import { useContext } from "react"
import { PlayerContext } from "../../videoplayer.player.component"

export function SeekControlOverlay() {
    const videoPlayerContext = useContext(PlayerContext)

    if (!videoPlayerContext) {
        return null
    }

    const { player } = videoPlayerContext

    const handleSeekRelative = (deltaSeconds: number) => {
        if (!player) return
        const current = player.currentTime() ?? 0
        const duration = player.duration() ?? 0
        const target = Math.max(0, Math.min(duration, current + deltaSeconds))
        player.currentTime(target)
    }

    return (
        <div className="flex items-center gap-1">
            <button
                type="button"
                className="flex items-center justify-center w-9 h-9 rounded-lg hover:bg-[rgba(108,99,255,0.2)] text-[#E8E8FF] hover:text-white transition-all cursor-pointer"
                onClick={() => handleSeekRelative(-10)}
                aria-label="Rewind 10 seconds"
            >
                <span className="material-symbols-rounded" style={{ fontSize: "22px" }}>
                    replay_10
                </span>
            </button>
            <button
                type="button"
                className="flex items-center justify-center w-9 h-9 rounded-lg hover:bg-[rgba(108,99,255,0.2)] text-[#E8E8FF] hover:text-white transition-all cursor-pointer"
                onClick={() => handleSeekRelative(10)}
                aria-label="Forward 10 seconds"
            >
                <span className="material-symbols-rounded" style={{ fontSize: "22px" }}>
                    forward_10
                </span>
            </button>
        </div>
    )
}

