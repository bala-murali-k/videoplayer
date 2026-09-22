// Required imports
import { useContext, useEffect, useState } from "react"
import { PlayerContext } from "../../videoplayer.player.component"

export function FullscreenControlOverlay() {
    const videoPlayerContext = useContext(PlayerContext)
    const [isFullscreen, setIsFullscreen] = useState<boolean>(() => {
        return !!document.fullscreenElement
    })

    useEffect(() => {
        const handleFullscreenChange = () => {
            setIsFullscreen(!!document.fullscreenElement)
        }

        document.addEventListener("fullscreenchange", handleFullscreenChange)
        return () => {
            document.removeEventListener("fullscreenchange", handleFullscreenChange)
        }
    }, [])

    if (!videoPlayerContext) {
        return null
    }

    const { containerRef, player } = videoPlayerContext

    const toggleFullscreen = async () => {
        try {
            if (!document.fullscreenElement) {
                const target = containerRef?.current || player?.el()
                if (target?.requestFullscreen) {
                    await target.requestFullscreen()
                }
            } else {
                if (document.exitFullscreen) {
                    await document.exitFullscreen()
                }
            }
        } catch {
            // Fallback to player fullscreen method if container fullscreen fails
            if (player?.isFullscreen()) {
                player.exitFullscreen()
            } else {
                player?.requestFullscreen()
            }
        }
    }

    return (
        <button
            type="button"
            className="flex items-center justify-center w-9 h-9 rounded-lg hover:bg-[rgba(108,99,255,0.2)] text-[#E8E8FF] hover:text-white transition-all cursor-pointer"
            onClick={toggleFullscreen}
            aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
        >
            <span className="material-symbols-rounded" style={{ fontSize: "22px" }}>
                {isFullscreen ? "fullscreen_exit" : "fullscreen"}
            </span>
        </button>
    )
}

