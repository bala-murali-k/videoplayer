// Required imports
import { formatVideoTime, getThumbnail } from "../../../../../utils/helperfunctions"
import { useContext, useEffect, useRef, useState } from "react"
import { PlayerContext } from "../../videoplayer.player.component"

export function ProgressbarControlOverlay() {
    const videoPlayerContext = useContext(PlayerContext)
    const progressBarReference = useRef<HTMLDivElement>(null)
    const [currentTime, setCurrentTime] = useState<number>(0)
    const [duration, setDuration] = useState<number>(0)
    const [hoverState, setHoverState] = useState({
        isHovering: false,
        position: 0,
        time: 0
    })

    useEffect(() => {
        const player = videoPlayerContext?.player
        if (!player || player.isDisposed?.()) return

        const updateProgress = () => {
            if (player.isDisposed?.()) return
            setCurrentTime(player.currentTime() ?? 0)
            setDuration(player.duration() || 0)
        }

        updateProgress()
        player.on("loadedmetadata", updateProgress)
        player.on("durationchange", updateProgress)
        player.on("timeupdate", updateProgress)

        return () => {
            if (player && !player.isDisposed?.()) {
                player.off("loadedmetadata", updateProgress)
                player.off("durationchange", updateProgress)
                player.off("timeupdate", updateProgress)
            }
        }
    }, [videoPlayerContext?.player])

    if (!videoPlayerContext) {
        return null
    }

    const { player, thumbnails } = videoPlayerContext
    const progressPercentage = Math.min(100, Math.max(0, duration > 0 ? (currentTime / duration) * 100 : 0))
    const hoverThumbnail = hoverState.isHovering && duration > 0 ? getThumbnail(hoverState.time, thumbnails) : null

    const handleSeek = (fraction: number) => {
        if (!player || player.isDisposed?.() || duration <= 0) return
        const clampedFraction = Math.min(1, Math.max(0, fraction))
        player.currentTime(clampedFraction * duration)
    }

    const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
        if (!player || player.isDisposed?.() || duration <= 0) return
        if (event.key === "ArrowLeft") {
            event.preventDefault()
            const newTime = Math.max(0, (player.currentTime() ?? 0) - 5)
            player.currentTime(newTime)
        } else if (event.key === "ArrowRight") {
            event.preventDefault()
            const newTime = Math.min(duration, (player.currentTime() ?? 0) + 5)
            player.currentTime(newTime)
        } else if (event.key === "Home") {
            event.preventDefault()
            player.currentTime(0)
        } else if (event.key === "End") {
            event.preventDefault()
            player.currentTime(duration)
        }
    }

    return (
        <div className="w-full px-4 py-2" onClick={(e) => e.stopPropagation()}>
            <div className="relative flex items-center gap-3">
                <span className="font-poppins text-xs font-medium min-w-[40px] text-[#E8E8FF]">
                    {formatVideoTime(currentTime)}
                </span>
                <div
                    ref={progressBarReference}
                    role="slider"
                    tabIndex={0}
                    aria-label="Video seek slider"
                    aria-valuemin={0}
                    aria-valuemax={Math.round(duration)}
                    aria-valuenow={Math.round(currentTime)}
                    aria-valuetext={`${formatVideoTime(currentTime)} of ${formatVideoTime(duration)}`}
                    className="relative flex-1 h-1.5 bg-[rgba(108,99,255,0.2)] hover:h-2 rounded-full cursor-pointer group/progress transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-[#6C63FF]"
                    onClick={(event) => {
                        event.stopPropagation()
                        if (!progressBarReference.current || duration <= 0) return
                        const rect = progressBarReference.current.getBoundingClientRect()
                        const clickX = event.clientX - rect.left
                        handleSeek(clickX / rect.width)
                    }}
                    onMouseMove={(event) => {
                        if (!progressBarReference.current || duration <= 0) return
                        const rect = progressBarReference.current.getBoundingClientRect()
                        const clickX = event.clientX - rect.left
                        const percent = Math.min(1, Math.max(0, clickX / rect.width))
                        setHoverState({
                            isHovering: true,
                            position: percent,
                            time: percent * duration
                        })
                    }}
                    onMouseEnter={() => setHoverState((prev) => ({ ...prev, isHovering: true }))}
                    onMouseLeave={() => setHoverState({ isHovering: false, position: 0, time: 0 })}
                    onKeyDown={handleKeyDown}
                >
                    {/* Hover Preview Tooltip with Image and Time */}
                    {hoverState.isHovering && duration > 0 && (
                        <div
                            className="absolute -top-[124px] px-2.5 py-2 bg-[rgba(18,18,30,0.96)] backdrop-blur-md rounded-xl pointer-events-none border border-[rgba(108,99,255,0.3)] shadow-2xl z-30 transition-all"
                            style={{
                                left: `${Math.min(92, Math.max(8, hoverState.position * 100))}%`,
                                transform: "translateX(-50%)"
                            }}
                        >
                            {/* Preview Image */}
                            {hoverThumbnail ? (
                                <div className="relative w-[130px] h-[74px] rounded-lg overflow-hidden bg-[rgba(108,99,255,0.1)] mb-1.5 border border-white/10">
                                    <img
                                        src={hoverThumbnail}
                                        alt="Preview thumbnail"
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute bottom-1 right-1 px-1.5 py-0.5 bg-black/80 backdrop-blur-sm rounded text-[9px] font-medium font-poppins text-white">
                                        {formatVideoTime(hoverState.time)}
                                    </div>
                                </div>
                            ) : (
                                <div className="w-[110px] py-1 text-center font-poppins text-[10px] text-gray-400">
                                    {formatVideoTime(hoverState.time)}
                                </div>
                            )}

                            {/* Time and Duration */}
                            <div className="flex items-center justify-center gap-1.5 text-[11px] font-poppins text-[#E8E8FF]">
                                <span className="text-[#8B83FF] font-semibold">{formatVideoTime(hoverState.time)}</span>
                                <span className="text-white/30">/</span>
                                <span className="text-white/60">{formatVideoTime(duration)}</span>
                            </div>

                            {/* Triangle pointer */}
                            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-[rgba(18,18,30,0.96)] rotate-45 border-r border-b border-[rgba(108,99,255,0.3)]" />
                        </div>
                    )}

                    {/* Progress Fill */}
                    <div
                        className="h-full bg-gradient-to-r from-[rgba(108,99,255,0.7)] to-[#8B83FF] rounded-full relative"
                        style={{ width: `${progressPercentage}%` }}
                    >
                        {/* Thumb */}
                        <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 group/thumb">
                            <div className="relative">
                                <div className="absolute inset-0 w-3.5 h-3.5 bg-[#6C63FF] rounded-full opacity-0 group-hover/progress:opacity-50 transition-opacity duration-200 scale-150 blur-sm" />
                                <div className="w-3.5 h-3.5 bg-white rounded-full opacity-90 group-hover/progress:opacity-100 group-hover/progress:scale-125 transition-all duration-200 shadow-[0_0_12px_rgba(108,99,255,0.8)]" />
                            </div>
                        </div>
                    </div>
                </div>
                <span className="font-poppins text-xs font-medium min-w-[40px] text-white/50">
                    - {formatVideoTime(Math.max(0, duration - currentTime))}
                </span>
            </div>
        </div>
    )
}