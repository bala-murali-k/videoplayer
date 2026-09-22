// Required imports
import { useContext, useEffect, useState } from "react"
import { PlayerContext } from "../../videoplayer.player.component"

export function VolumeControlOverlay() {
    const videoPlayerContext = useContext(PlayerContext)
    const [volume, setVolume] = useState<number>(() => {
        const p = videoPlayerContext?.player
        return p && typeof p.volume === "function" && !p.isDisposed?.() ? p.volume() ?? 1 : 1
    })
    const [isMuted, setIsMuted] = useState<boolean>(() => {
        const p = videoPlayerContext?.player
        return p && typeof p.muted === "function" && !p.isDisposed?.() ? p.muted() ?? false : false
    })

    useEffect(() => {
        const player = videoPlayerContext?.player
        if (!player || player.isDisposed?.()) return

        const handleVolumeChange = () => {
            if (player.isDisposed?.()) return
            setVolume(player.volume() ?? 1)
            setIsMuted(player.muted() ?? false)
        }

        player.on("volumechange", handleVolumeChange)
        return () => {
            if (player && !player.isDisposed?.()) {
                player.off("volumechange", handleVolumeChange)
            }
        }
    }, [videoPlayerContext?.player])

    if (!videoPlayerContext) {
        return null
    }

    const { player } = videoPlayerContext

    const toggleMute = () => {
        if (!player || player.isDisposed?.()) return
        player.muted(!player.muted())
    }

    const handleVolumeSlider = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (!player || player.isDisposed?.()) return
        const newVolume = parseFloat(event.target.value)
        player.volume(newVolume)
        if (newVolume > 0 && player.muted()) {
            player.muted(false)
        }
    }

    const getVolumeIcon = () => {
        if (isMuted || volume === 0) return "volume_off"
        if (volume < 0.3) return "volume_mute"
        if (volume < 0.7) return "volume_down"
        return "volume_up"
    }

    const effectiveVolume = isMuted ? 0 : volume

    return (
        <div className="flex items-center gap-1.5 group/volume">
            <button
                type="button"
                className="flex items-center justify-center w-9 h-9 rounded-lg hover:bg-[rgba(108,99,255,0.2)] text-[#E8E8FF] hover:text-white transition-all cursor-pointer"
                onClick={(e) => {
                    e.stopPropagation()
                    toggleMute()
                }}
                aria-label={isMuted ? "Unmute audio" : "Mute audio"}
            >
                <span className="material-symbols-rounded" style={{ fontSize: "22px" }}>
                    {getVolumeIcon()}
                </span>
            </button>
            <div className="w-0 overflow-hidden group-hover/volume:w-20 transition-all duration-300 flex items-center">
                <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={effectiveVolume}
                    onClick={(e) => e.stopPropagation()}
                    onChange={handleVolumeSlider}
                    className="w-18 h-1 bg-[rgba(108,99,255,0.3)] rounded-lg appearance-none cursor-pointer accent-[#6C63FF]"
                    role="slider"
                    aria-label="Volume level"
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={Math.round(effectiveVolume * 100)}
                />
            </div>
        </div>
    )
}
