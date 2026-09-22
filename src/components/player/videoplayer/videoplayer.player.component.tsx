// Required imports
import { generateThumbnails, type Thumbnail } from '../../../utils/helperfunctions'
import { useEffect, useRef, createContext, useState, useCallback } from 'react'
import videojs from 'video.js'
import 'video.js/dist/video-js.css'
// Component imports
import { VideoPlayerOverlay } from './overlay/overlay.videoplayer.component'

export type PlayerContextType = {
    player: ReturnType<typeof videojs> | null
    thumbnails: Thumbnail[]
    file: File | null
    containerRef: React.RefObject<HTMLDivElement | null>
    onReturnBack: () => void
}

// eslint-disable-next-line react-refresh/only-export-components
export const PlayerContext = createContext<PlayerContextType | null>(null)

export interface VideoPlayerProps {
    selectedFile: File
    fileType?: string
    onReturnBack: () => void
}

export function VideoPlayer({ selectedFile, fileType, onReturnBack }: VideoPlayerProps) {
    const containerReference = useRef<HTMLDivElement>(null)
    const videoReference = useRef<HTMLDivElement>(null)
    const playerReference = useRef<ReturnType<typeof videojs> | null>(null)
    const [playerState, setPlayerState] = useState<ReturnType<typeof videojs> | null>(null)
    const [thumbnailList, setThumbnailList] = useState<Thumbnail[]>([])
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const urlReference = useRef<string | null>(null)

    // Keyboard shortcuts handler
    const handleKeyDown = useCallback((event: KeyboardEvent) => {
        const target = event.target as HTMLElement | null
        if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)) {
            return
        }

        const player = playerReference.current
        if (!player || (typeof player.isDisposed === 'function' && player.isDisposed())) return

        switch (event.key.toLowerCase()) {
            case ' ':
            case 'k':
                event.preventDefault()
                if (player.paused()) {
                    player.play()
                } else {
                    player.pause()
                }
                break

            case 'arrowleft': {
                event.preventDefault()
                const current = player.currentTime() ?? 0
                player.currentTime(Math.max(0, current - 5))
                break
            }

            case 'arrowright': {
                event.preventDefault()
                const current = player.currentTime() ?? 0
                const duration = player.duration() ?? 0
                player.currentTime(Math.min(duration, current + 5))
                break
            }

            case 'j': {
                event.preventDefault()
                const current = player.currentTime() ?? 0
                player.currentTime(Math.max(0, current - 10))
                break
            }

            case 'l': {
                event.preventDefault()
                const current = player.currentTime() ?? 0
                const duration = player.duration() ?? 0
                player.currentTime(Math.min(duration, current + 10))
                break
            }

            case 'arrowup': {
                event.preventDefault()
                const volume = player.volume() ?? 1
                player.volume(Math.min(1, volume + 0.1))
                if (player.muted()) player.muted(false)
                break
            }

            case 'arrowdown': {
                event.preventDefault()
                const volume = player.volume() ?? 1
                player.volume(Math.max(0, volume - 0.1))
                break
            }

            case 'm':
                event.preventDefault()
                player.muted(!player.muted())
                break

            case 'f':
                event.preventDefault()
                if (!document.fullscreenElement) {
                    const target = containerReference.current || player.el()
                    target?.requestFullscreen?.()
                } else {
                    document.exitFullscreen?.()
                }
                break

            default:
                break
        }
    }, [])

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown)
        return () => {
            window.removeEventListener('keydown', handleKeyDown)
        }
    }, [handleKeyDown])

    // VideoJS Initialization & Source Lifecycle
    useEffect(() => {
        if (!videoReference.current) return

        setIsLoading(true)

        const videoElement = document.createElement('video-js')
        videoElement.classList.add('video-js', 'vjs-big-play-centered', 'vjs-fill')
        videoReference.current.appendChild(videoElement)

        const fileUrl = URL.createObjectURL(selectedFile)
        urlReference.current = fileUrl

        const videoPlayer = videojs(videoElement, {
            controls: false,
            autoplay: false,
            preload: 'auto',
            fill: true,
            responsive: true,
            sources: [{
                src: fileUrl,
                type: fileType || selectedFile.type || 'video/mp4'
            }]
        })

        playerReference.current = videoPlayer
        setPlayerState(videoPlayer)

        let thumbnailsStarted = false
        const markReady = () => {
            setIsLoading(false)

            if (!thumbnailsStarted) {
                thumbnailsStarted = true
                const videoEl = videoPlayer.tech?.()?.el?.() as HTMLVideoElement | undefined
                if (videoEl) {
                    generateThumbnails(videoEl)
                        .then((thumbnails) => {
                            setThumbnailList(thumbnails)
                        })
                        .catch(() => {
                            // Non-fatal, thumbnails can fail without affecting playback
                        })
                }
            }
        }

        videoPlayer.ready(() => {
            markReady()
        })
        videoPlayer.one('loadedmetadata', markReady)
        videoPlayer.one('loadeddata', markReady)
        videoPlayer.one('canplay', markReady)

        // Safety fallback timer to ensure loading screen never hangs
        const safetyTimer = setTimeout(markReady, 600)

        return () => {
            clearTimeout(safetyTimer)
            if (playerReference.current) {
                try {
                    playerReference.current.dispose()
                } catch {
                    // Ignore dispose errors during teardown
                }
                playerReference.current = null
            }
            setPlayerState(null)
            if (urlReference.current) {
                URL.revokeObjectURL(urlReference.current)
                urlReference.current = null
            }
        }
    }, [selectedFile, fileType])

    return (
        <div className="flex flex-col justify-center items-center relative w-full px-4">
            <div
                ref={containerReference}
                className="relative w-full max-w-5xl rounded-2xl overflow-hidden shadow-2xl bg-black aspect-video flex items-center justify-center border border-white/5"
            >
                {/* Non-blocking loading spinner in center behind overlay */}
                {isLoading && (
                    <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none bg-black/40">
                        <div className="flex flex-col items-center gap-4">
                            <div className="w-12 h-12 rounded-full border-3 border-transparent border-t-[#6C63FF] border-r-[#8B83FF] animate-spin" />
                            <p className="font-poppins text-xs font-medium text-white/80">Loading video...</p>
                        </div>
                    </div>
                )}

                <div ref={videoReference} className="w-full h-full flex items-center justify-center overflow-hidden" />

                <PlayerContext.Provider
                    value={{
                        player: playerState,
                        thumbnails: thumbnailList,
                        file: selectedFile,
                        containerRef: containerReference,
                        onReturnBack
                    }}
                >
                    <VideoPlayerOverlay key={`${selectedFile.name}-${selectedFile.lastModified}`} />
                </PlayerContext.Provider>
            </div>
        </div>
    )
}
