// Required imports
import { useContext, useState } from "react"
import { PlayerContext } from "../../videoplayer.player.component"
import { formatFileSize, formatVideoTime } from "../../../../../utils/helperfunctions"

export function FileInfoControlOverlay() {
    const videoPlayerContext = useContext(PlayerContext)
    const [isOpen, setIsOpen] = useState<boolean>(false)

    if (!videoPlayerContext) {
        return null
    }

    const { file, player } = videoPlayerContext

    const isSafe = !!player && typeof player.isDisposed === "function" && !player.isDisposed()
    const duration = isSafe && player ? player.duration?.() ?? 0 : 0
    const videoWidth = isSafe && player ? player.videoWidth?.() ?? 0 : 0
    const videoHeight = isSafe && player ? player.videoHeight?.() ?? 0 : 0

    return (
        <>
            <button
                type="button"
                className="flex items-center justify-center w-9 h-9 rounded-lg hover:bg-[rgba(108,99,255,0.2)] text-[#E8E8FF] hover:text-white transition-all cursor-pointer"
                onClick={() => setIsOpen(true)}
                aria-label="Video details"
            >
                <span className="material-symbols-rounded" style={{ fontSize: "20px" }}>
                    info
                </span>
            </button>

            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in"
                    onClick={() => setIsOpen(false)}
                >
                    <div
                        className="bg-[#141422] border border-[rgba(108,99,255,0.3)] rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-4"
                        onClick={(e) => e.stopPropagation()}
                        role="dialog"
                        aria-modal="true"
                        aria-label="Video file details"
                    >
                        <div className="flex items-center justify-between border-b border-gray-800 pb-3">
                            <div className="flex items-center gap-2">
                                <span className="material-symbols-rounded text-[#8B83FF]">description</span>
                                <h3 className="font-poppins font-semibold text-white text-base">File Information</h3>
                            </div>
                            <button
                                type="button"
                                className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                                onClick={() => setIsOpen(false)}
                                aria-label="Close details"
                            >
                                <span className="material-symbols-rounded text-lg">close</span>
                            </button>
                        </div>

                        <div className="space-y-3 font-poppins text-xs">
                            <div className="flex flex-col gap-1">
                                <span className="text-gray-400 font-medium">Filename</span>
                                <span className="text-white font-mono break-all bg-black/30 p-2 rounded-lg border border-white/5">
                                    {file?.name || "Unknown File"}
                                </span>
                            </div>

                            <div className="grid grid-cols-2 gap-3 pt-1">
                                <div className="bg-black/30 p-2.5 rounded-lg border border-white/5">
                                    <span className="text-gray-400 block mb-1">File Size</span>
                                    <span className="text-white font-mono font-medium">
                                        {file?.size ? formatFileSize(file.size) : "Unknown"}
                                    </span>
                                </div>

                                <div className="bg-black/30 p-2.5 rounded-lg border border-white/5">
                                    <span className="text-gray-400 block mb-1">Duration</span>
                                    <span className="text-white font-mono font-medium">
                                        {duration > 0 ? formatVideoTime(duration) : "--:--"}
                                    </span>
                                </div>

                                <div className="bg-black/30 p-2.5 rounded-lg border border-white/5">
                                    <span className="text-gray-400 block mb-1">Format / MIME</span>
                                    <span className="text-white font-mono font-medium truncate">
                                        {file?.type || "video/*"}
                                    </span>
                                </div>

                                <div className="bg-black/30 p-2.5 rounded-lg border border-white/5">
                                    <span className="text-gray-400 block mb-1">Resolution</span>
                                    <span className="text-white font-mono font-medium">
                                        {videoWidth > 0 && videoHeight > 0 ? `${videoWidth} × ${videoHeight}` : "Detecting..."}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end pt-2">
                            <button
                                type="button"
                                className="px-4 py-2 bg-[rgba(108,99,255,0.25)] hover:bg-[rgba(108,99,255,0.4)] border border-[rgba(108,99,255,0.4)] text-white text-xs font-poppins font-medium rounded-xl transition-all cursor-pointer"
                                onClick={() => setIsOpen(false)}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

