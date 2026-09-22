// Required imports
import { useContext, useEffect, useRef, useState } from "react"
import { PlayerContext } from "../../videoplayer.player.component"

const RATES = [0.5, 0.75, 1, 1.25, 1.5, 2]

export function PlaybackRateControlOverlay() {
    const videoPlayerContext = useContext(PlayerContext)
    const [rate, setRate] = useState<number>(() => {
        const p = videoPlayerContext?.player
        return p && typeof p.playbackRate === "function" && !p.isDisposed?.() ? p.playbackRate() ?? 1 : 1
    })
    const [isOpen, setIsOpen] = useState<boolean>(false)
    const menuRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const player = videoPlayerContext?.player
        if (!player || player.isDisposed?.()) return

        const handleRateChange = () => {
            if (player.isDisposed?.()) return
            setRate(player.playbackRate() ?? 1)
        }

        player.on("ratechange", handleRateChange)
        return () => {
            if (player && !player.isDisposed?.()) {
                player.off("ratechange", handleRateChange)
            }
        }
    }, [videoPlayerContext?.player])

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                setIsOpen(false)
            }
        }

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside)
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
        }
    }, [isOpen])

    if (!videoPlayerContext) {
        return null
    }

    const { player } = videoPlayerContext

    const handleSelectRate = (newRate: number) => {
        if (!player || player.isDisposed?.()) return
        player.playbackRate(newRate)
        setIsOpen(false)
    }

    return (
        <div className="relative" ref={menuRef} onClick={(e) => e.stopPropagation()}>
            <button
                type="button"
                className="flex items-center justify-center px-2 h-9 rounded-lg hover:bg-[rgba(108,99,255,0.2)] text-[#E8E8FF] hover:text-white transition-all text-xs font-mono font-medium cursor-pointer"
                onClick={() => setIsOpen(!isOpen)}
                aria-label={`Playback speed: ${rate}x`}
                aria-haspopup="menu"
                aria-expanded={isOpen}
            >
                {rate}x
            </button>

            {isOpen && (
                <div
                    className="absolute bottom-11 right-0 bg-[rgba(18,18,30,0.96)] backdrop-blur-md rounded-xl border border-[rgba(108,99,255,0.3)] shadow-2xl py-1.5 min-w-[75px] z-30"
                    role="menu"
                >
                    {RATES.map((r) => (
                        <button
                            key={r}
                            type="button"
                            role="menuitem"
                            className={`w-full px-3 py-1 text-xs font-mono text-left transition-colors cursor-pointer flex items-center justify-between ${
                                rate === r
                                    ? "text-[#8B83FF] bg-[rgba(108,99,255,0.15)] font-semibold"
                                    : "text-gray-300 hover:bg-white/5 hover:text-white"
                            }`}
                            onClick={() => handleSelectRate(r)}
                        >
                            <span>{r}x</span>
                            {rate === r && (
                                <span className="material-symbols-rounded text-sm">check</span>
                            )}
                        </button>
                    ))}
                </div>
            )}
        </div>
    )
}
