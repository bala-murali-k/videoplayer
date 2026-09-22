// Required imports
import { formatVideoTime, getThumbnail } from "../../../../../utils/helperfunctions"
import { useContext, useEffect, useRef, useState } from "react"
import { PlayerContext } from "../../videoplayer.player.component"
// Component imports
// Required objects

export function ProgressbarControlOverlay() {

    // Necessary variables
    const videoPlayerContext = useContext(PlayerContext)
    if (!videoPlayerContext) {
        return null
    }
    const progressBarReference = useRef<HTMLDivElement>(null)
    const [currentTime, setCurrentTime] = useState<number>(0)
    const [duration, setDuration] = useState<number>(0)
    const [hoverState, setHoverState] = useState({
        isHovering: false,
        position: 0,
        time: 0
    })
    const progressPercentage = Math.min(100, Math.max(0, duration > 0 ? (currentTime / duration) * 100 : 0))

    useEffect(() => {
        const player = videoPlayerContext.player
        if (!player || player.duration() == null) return

        const updateProgress = () => {
            setCurrentTime(player.currentTime() ?? 0)
            setDuration(player.duration() || 0)
        }

        updateProgress()
        player.on('loadedmetadata', updateProgress)
        player.on('durationchange', updateProgress)
        player.on('timeupdate', updateProgress)

        return () => {
            player.off('loadedmetadata', updateProgress)
            player.off('durationchange', updateProgress)
            player.off('timeupdate', updateProgress)
        }
    }, [videoPlayerContext.player])

    return (
        <div className='absolute inset-0 flex items-end justify-center'>
            <div className="container w-10/11 max-w-2xl px-4 py-2">
                <div className="relative flex items-center gap-4">
                    <span className="font-poppins text-xs font-medium min-w-[40px]" style={{ color: '#E8E8FF' }}>
                        {formatVideoTime(currentTime)}
                    </span>
                    <div
                        ref={progressBarReference}
                        className="relative flex-1 h-1 bg-[rgba(108,99,255,0.15)] rounded-full cursor-pointer group/progress transition-all duration-300 hover:h-1.5"
                        onClick={(event) => {
                            const player = videoPlayerContext.player
                            if (!player || !progressBarReference.current) return;
                            const duration = player.duration() ?? 0
                            const rect = progressBarReference.current.getBoundingClientRect();
                            const clickX = event.clientX - rect.left;
                            const percent = clickX / rect.width;
                            const seekTime = percent * duration;
                            player.currentTime(seekTime);
                        }}
                        onMouseMove={(event) => {
                            if (!progressBarReference.current || !duration) return;

                            const rect = progressBarReference.current.getBoundingClientRect();
                            const clickX = event.clientX - rect.left;
                            const percent = Math.min(1, Math.max(0, clickX / rect.width));
                            const time = percent * duration;

                            setHoverState({
                                isHovering: true,
                                position: percent,
                                time: time
                            });
                        }}
                        onMouseEnter={() => setHoverState(prev => ({ ...prev, isHovering: true }))}
                        onMouseLeave={() => setHoverState({ isHovering: false, position: 0, time: 0 })}
                    >
                        {/* Hover Preview Tooltip with Image and Time */}
                        {hoverState.isHovering && duration > 0 && (
                            <div
                                className="absolute -top-[118px] px-3 py-2 bg-[rgba(30,30,46,0.95)] backdrop-blur-sm rounded-xl pointer-events-none border border-[rgba(108,99,255,0.2)] shadow-2xl transition-opacity duration-200 z-20"
                                style={{
                                    left: `${hoverState.position * 100}%`,
                                    transform: 'translateX(-50%)'
                                }}
                            >
                                {/* Preview Image */}
                                <div className="relative w-[120px] h-[68px] rounded-lg overflow-hidden bg-[rgba(108,99,255,0.1)] mb-1.5">
                                    <img
                                        src={getThumbnail(hoverState.time, videoPlayerContext?.thumbnail) || ''}
                                        alt="Preview"
                                        className="w-full h-full object-cover"
                                    />

                                    {/* Time badge on preview */}
                                    <div className="absolute bottom-1 right-1 px-1.5 py-0.5 bg-black/80 backdrop-blur-sm rounded text-[9px] font-medium font-poppins" style={{ color: '#E8E8FF' }}>
                                        {formatVideoTime(hoverState.time)}
                                    </div>
                                </div>

                                {/* Time and Duration */}
                                <div className="flex items-center justify-center gap-1.5 text-[11px] font-poppins" style={{ color: '#E8E8FF' }}>
                                    <span className="text-[#6C63FF] font-semibold">{formatVideoTime(hoverState.time)}</span>
                                    <span className="text-[rgba(232,232,255,0.3)]">/</span>
                                    <span className="text-[rgba(232,232,255,0.6)]">{formatVideoTime(duration)}</span>
                                </div>

                                {/* Triangle pointer */}
                                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-[rgba(30,30,46,0.95)] rotate-45 border-r border-b border-[rgba(108,99,255,0.2)]"></div>
                            </div>
                        )}

                        <div
                            className="h-full bg-gradient-to-r from-[rgba(108,99,255,0.6)] to-[#6C63FF] rounded-full transition-all duration-300 ease-in-out relative"
                            style={{ width: `${progressPercentage}%` }}
                        >
                            <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 group/thumb">
                                <div
                                    className="absolute -top-10 left-1/2 -translate-x-1/2 px-2.5 py-1.5 bg-[rgba(30,30,46,0.95)] backdrop-blur-sm rounded-lg text-[11px] font-poppins opacity-0 group-hover/progress:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap border border-[rgba(108,99,255,0.2)] shadow-lg"
                                    style={{ color: '#E8E8FF' }}
                                >
                                    {formatVideoTime(currentTime)} / {formatVideoTime(duration)}
                                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-[rgba(30,30,46,0.95)] rotate-45 border-r border-b border-[rgba(108,99,255,0.2)]"></div>
                                </div>

                                <div className="relative">
                                    <div className="absolute inset-0 w-3 h-3 bg-[#6C63FF] rounded-full opacity-0 group-hover/progress:opacity-40 transition-opacity duration-300 scale-150 blur-md"></div>
                                    <div className="absolute inset-0 w-3 h-3 bg-[#6C63FF] rounded-full opacity-0 group-hover/progress:opacity-20 transition-opacity duration-300 scale-125 blur-sm"></div>
                                    <div className="w-3 h-3 bg-white rounded-full opacity-0 group-hover/progress:opacity-100 transition-opacity duration-300 shadow-[0_0_20px_rgba(108,99,255,0.5)]"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <span className="font-poppins text-xs font-medium min-w-[40px]" style={{ color: 'rgba(232,232,255,0.5)' }}>
                        - &nbsp; {formatVideoTime(duration - currentTime)}
                    </span>
                </div>
            </div>
        </div>
    )
}