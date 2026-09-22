// Required imports
import { useContext, useEffect, useState } from "react"
import { PlayerContext } from "../../videoplayer.player.component"

interface PlayPauseControlProps {
    variant?: "center" | "inline"
}

export function PlayPauseControlOverlay({ variant = "center" }: PlayPauseControlProps) {
    const videoPlayerContext = useContext(PlayerContext)
    const [isPlaying, setIsPlaying] = useState<boolean>(() => {
        const p = videoPlayerContext?.player
        return Boolean(p && typeof p.paused === "function" && !p.isDisposed?.() && !p.paused())
    })

    useEffect(() => {
        const player = videoPlayerContext?.player
        if (!player || player.isDisposed?.()) return

        const handlePlay = () => setIsPlaying(true)
        const handlePause = () => setIsPlaying(false)

        player.on("play", handlePlay)
        player.on("pause", handlePause)

        return () => {
            if (player && !player.isDisposed?.()) {
                player.off("play", handlePlay)
                player.off("pause", handlePause)
            }
        }
    }, [videoPlayerContext?.player])

    if (!videoPlayerContext) {
        return null
    }

    const { player } = videoPlayerContext

    const togglePlay = () => {
        if (!player || player.isDisposed?.()) return
        if (player.paused()) {
            player.play()
        } else {
            player.pause()
        }
    }

    if (variant === "inline") {
        return (
            <button
                type="button"
                className="flex items-center justify-center w-9 h-9 rounded-lg hover:bg-[rgba(108,99,255,0.2)] text-[#E8E8FF] hover:text-white transition-all cursor-pointer"
                onClick={(e) => {
                    e.stopPropagation()
                    togglePlay()
                }}
                aria-label={isPlaying ? "Pause video" : "Play video"}
            >
                <span className="material-symbols-rounded" style={{ fontSize: "24px" }}>
                    {isPlaying ? "pause" : "play_arrow"}
                </span>
            </button>
        )
    }

    return (
        <button
            type="button"
            className="group relative flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-[rgba(108,99,255,0.3)] to-[rgba(108,99,255,0.1)] border-2 border-[rgba(108,99,255,0.45)] hover:border-[rgba(108,99,255,0.8)] transition-all duration-300 ease-in-out transform hover:scale-110 active:scale-95 pointer-events-auto cursor-pointer shadow-lg hover:shadow-[0_0_40px_rgba(108,99,255,0.3)]"
            onClick={(e) => {
                e.stopPropagation()
                togglePlay()
            }}
            aria-label={isPlaying ? "Pause video" : "Play video"}
        >
            <span className="absolute inset-0 rounded-full border-2 border-[rgba(108,99,255,0.3)] opacity-0 group-hover:opacity-100 group-hover:animate-ping transition-opacity duration-300" />
            <span className="absolute inset-1 rounded-full bg-[rgba(108,99,255,0.1)] group-hover:bg-[rgba(108,99,255,0.2)] transition-all duration-300" />
            <span
                className="material-symbols-rounded relative z-10 transition-transform duration-300 group-hover:scale-110"
                style={{
                    fontSize: "36px",
                    color: "#FFFFFF",
                }}
            >
                {isPlaying ? "pause" : "play_arrow"}
            </span>
        </button>
    )
}