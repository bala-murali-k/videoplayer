interface SeekRippleOverlayProps {
    side: "left" | "right" | null
    seconds: number
}

export function SeekRippleOverlay({ side, seconds }: SeekRippleOverlayProps) {
    if (!side || seconds <= 0) return null

    return (
        <div
            className={`absolute top-0 bottom-0 ${
                side === "left" ? "left-0" : "right-0"
            } w-1/3 z-30 pointer-events-none flex items-center justify-center`}
        >
            <div
                className={`w-full h-full flex flex-col items-center justify-center bg-white/10 backdrop-blur-xs transition-all duration-300 animate-in fade-in zoom-in-95 ${
                    side === "left" ? "rounded-r-full pl-4" : "rounded-l-full pr-4"
                }`}
            >
                <div className="flex items-center justify-center gap-1 text-white">
                    <span className="material-symbols-rounded text-3xl animate-bounce">
                        {side === "left" ? "fast_rewind" : "fast_forward"}
                    </span>
                </div>
                <span className="font-poppins font-bold text-white text-sm tracking-wide mt-1 drop-shadow-md">
                    {side === "left" ? `-${seconds}s` : `+${seconds}s`}
                </span>
            </div>
        </div>
    )
}

