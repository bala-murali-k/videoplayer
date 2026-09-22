// Required imports
import { useContext, useEffect, useRef, useState, useCallback } from "react"
import { PlayerContext } from "../videoplayer.player.component"
import { PlayPauseControlOverlay } from "./controls/playpause.overlay.videoplayer.component"
import { ProgressbarControlOverlay } from "./controls/progressbar.overlay.videoplayer.component"
import { VolumeControlOverlay } from "./controls/volume.overlay.videoplayer.component"
import { SeekControlOverlay } from "./controls/seek.overlay.videoplayer.component"
import { PlaybackRateControlOverlay } from "./controls/playbackrate.overlay.videoplayer.component"
import { FullscreenControlOverlay } from "./controls/fullscreen.overlay.videoplayer.component"
import { FileInfoControlOverlay } from "./controls/fileinfo.overlay.videoplayer.component"
import { ReturnBackControlOverlay } from "./controls/returnback.overlay.videoplayer.component"
import { SeekRippleOverlay } from "./controls/seekripple.overlay.videoplayer.component"

export function VideoPlayerOverlay() {
    const videoPlayerContext = useContext(PlayerContext)
    const [isVisible, setIsVisible] = useState<boolean>(true)
    const [rippleState, setRippleState] = useState<{ side: "left" | "right" | null; seconds: number }>({
        side: null,
        seconds: 0
    })

    const hideTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
    const tapCountRef = useRef<number>(0)
    const tapSideRef = useRef<"left" | "right" | null>(null)
    const singleTapTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
    const multiTapResetTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

    const player = videoPlayerContext?.player
    const file = videoPlayerContext?.file
    const containerRef = videoPlayerContext?.containerRef

    // Reset inactivity timer to hide controls after 2.5s ONLY when video is actively playing
    const resetHideTimer = useCallback(() => {
        setIsVisible(true)
        if (hideTimeoutRef.current) {
            clearTimeout(hideTimeoutRef.current)
            hideTimeoutRef.current = null
        }

        try {
            if (player && typeof player.paused === "function" && !player.isDisposed?.() && !player.paused()) {
                hideTimeoutRef.current = setTimeout(() => {
                    setIsVisible(false)
                }, 2500)
            }
        } catch {
            // Ignore errors
        }
    }, [player])


    // Desktop mouse movement on player container wakes up the overlay
    useEffect(() => {
        const container = containerRef?.current
        if (!container) return

        const handleContainerMouseMove = () => {
            resetHideTimer()
        }

        container.addEventListener("mousemove", handleContainerMouseMove)
        return () => {
            container.removeEventListener("mousemove", handleContainerMouseMove)
        }
    }, [containerRef, resetHideTimer])

    // Synchronize play/pause state changes with hide timer
    useEffect(() => {
        if (!player || player.isDisposed?.()) return

        const handlePlay = () => resetHideTimer()
        const handlePause = () => {
            setIsVisible(true)
            if (hideTimeoutRef.current) {
                clearTimeout(hideTimeoutRef.current)
                hideTimeoutRef.current = null
            }
        }

        player.on("play", handlePlay)
        player.on("pause", handlePause)

        return () => {
            if (player && !player.isDisposed?.()) {
                player.off("play", handlePlay)
                player.off("pause", handlePause)
            }
            if (hideTimeoutRef.current) {
                clearTimeout(hideTimeoutRef.current)
                hideTimeoutRef.current = null
            }
        }
    }, [player, resetHideTimer])

    // Clean up tap timeouts on unmount
    useEffect(() => {
        return () => {
            if (singleTapTimeoutRef.current) clearTimeout(singleTapTimeoutRef.current)
            if (multiTapResetTimeoutRef.current) clearTimeout(multiTapResetTimeoutRef.current)
            if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current)
        }
    }, [])

    if (!videoPlayerContext) {
        return null
    }

    // Handles tap/click on left or right half of the middle layer
    const handleMiddleLayerTap = (side: "left" | "right") => {
        if (singleTapTimeoutRef.current) {
            clearTimeout(singleTapTimeoutRef.current)
            singleTapTimeoutRef.current = null
        }

        if (tapSideRef.current !== side) {
            tapSideRef.current = side
            tapCountRef.current = 1
        } else {
            tapCountRef.current += 1
        }

        const count = tapCountRef.current

        if (count === 1) {
            // Wait 280ms to differentiate single tap from double tap
            singleTapTimeoutRef.current = setTimeout(() => {
                // Single tap confirmed: Toggle overlay visibility (VLC behavior)
                setIsVisible((prev) => {
                    const next = !prev
                    if (next) {
                        resetHideTimer()
                    } else {
                        if (hideTimeoutRef.current) {
                            clearTimeout(hideTimeoutRef.current)
                            hideTimeoutRef.current = null
                        }
                    }
                    return next
                })
                tapCountRef.current = 0
                tapSideRef.current = null
            }, 280)
        } else {
            // Multi-tap confirmed (2nd tap, 3rd tap, etc.)
            if (multiTapResetTimeoutRef.current) {
                clearTimeout(multiTapResetTimeoutRef.current)
            }

            // Calculate accumulated seconds: 2 taps = 10s, 3 taps = 20s, 4 taps = 30s...
            const accumulatedSeconds = (count - 1) * 10
            const delta = side === "left" ? -10 : 10

            if (player && !player.isDisposed?.()) {
                const current = player.currentTime() ?? 0
                const duration = player.duration() ?? 0
                player.currentTime(Math.max(0, Math.min(duration, current + delta)))
            }

            setRippleState({ side, seconds: accumulatedSeconds })

            // Keep accumulator open for next rapid tap
            multiTapResetTimeoutRef.current = setTimeout(() => {
                tapCountRef.current = 0
                tapSideRef.current = null
                setRippleState({ side: null, seconds: 0 })
            }, 600)
        }
    }

    return (
        <div
            className="absolute inset-0 z-20 flex flex-col justify-between overflow-hidden select-none pointer-events-none"
            onMouseMove={resetHideTimer}
        >
            {/* Multi-Tap Seek Ripple Animation */}
            <SeekRippleOverlay side={rippleState.side} seconds={rippleState.seconds} />

            {/* Top Bar: Return back, filename, file info */}
            <header
                className={`flex items-center justify-between p-4 bg-gradient-to-b from-black/90 via-black/40 to-transparent transition-opacity duration-300 z-30 ${
                    isVisible ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                }`}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center gap-3 min-w-0">
                    <ReturnBackControlOverlay />
                    <span className="font-poppins text-xs md:text-sm font-medium text-white/90 truncate max-w-[200px] sm:max-w-md drop-shadow">
                        {file?.name || "Video"}
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    <FileInfoControlOverlay />
                </div>
            </header>

            {/* Middle Area: Left & Right tap zones + Center Play/Pause */}
            <div className="relative flex-1 flex items-center justify-center pointer-events-auto">
                {/* Left Tap Zone (Double/Multi tap to rewind 10s/20s..., single tap to toggle overlay) */}
                <div
                    className="absolute left-0 top-0 bottom-0 w-1/2 cursor-pointer z-10"
                    onClick={() => handleMiddleLayerTap("left")}
                    role="presentation"
                />

                {/* Right Tap Zone (Double/Multi tap to forward 10s/20s..., single tap to toggle overlay) */}
                <div
                    className="absolute right-0 top-0 bottom-0 w-1/2 cursor-pointer z-10"
                    onClick={() => handleMiddleLayerTap("right")}
                    role="presentation"
                />

                {/* Center Play/Pause button (Visible when overlay is visible) */}
                <div
                    className={`relative z-20 transition-opacity duration-300 pointer-events-auto flex items-center justify-center ${
                        isVisible ? "opacity-100" : "opacity-0 pointer-events-none"
                    }`}
                >
                    <PlayPauseControlOverlay variant="center" />
                </div>
            </div>

            {/* Bottom Bar: Progress bar + controls row */}
            <footer
                className={`p-2 sm:p-4 bg-gradient-to-t from-black/95 via-black/50 to-transparent space-y-1 transition-opacity duration-300 z-30 ${
                    isVisible ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                }`}
                onClick={(e) => e.stopPropagation()}
            >
                <ProgressbarControlOverlay />

                <div className="flex items-center justify-between px-4 pt-1">
                    <div className="flex items-center gap-1 sm:gap-2">
                        <PlayPauseControlOverlay variant="inline" />
                        <SeekControlOverlay />
                        <VolumeControlOverlay />
                    </div>

                    <div className="flex items-center gap-1 sm:gap-2">
                        <PlaybackRateControlOverlay />
                        <FullscreenControlOverlay />
                    </div>
                </div>
            </footer>
        </div>
    )
}
