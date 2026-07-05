// Required imports
import { generateThumbnails } from '../../../utils/helperfunctions'
import { useEffect, useRef, createContext, useState } from 'react'
import videojs from 'video.js'
import 'video.js/dist/video-js.css'
// Component imports
import { VideoPlayerOverlay } from './overlay/overlay.videoplayer.component'

export type PlayerContextType = {
    player: ReturnType<typeof videojs> | null
    thumbnail: any[]
}

export const PlayerContext = createContext<PlayerContextType | null>(null)

export function VideoPlayer ({ InputData, InputFunction }: any) {

    // necessary variables
    const videoReference = useRef<HTMLDivElement>(null)
    const playerReference = useRef<ReturnType<typeof videojs> | null>(null)
    const [playerState, setPlayerState] = useState<ReturnType<typeof videojs> | null>(null)
    const [thumbnailList, setThumbnailList] = useState<any[]>([])
    const urlReference = useRef<string | null>(null)

    // side effects
    useEffect(() => {
        if (!videoReference.current) return

        // create object url
        urlReference.current = URL.createObjectURL(InputData?.selectedFile)
        const videoElement = document.createElement('video-js')
        videoElement.classList.add('video-js','vjs-big-play-centered')
        videoReference.current.appendChild(videoElement)

        const videoPlayer = videojs(videoElement, {
            controls: false,
            autoplay: false,
            preload: 'auto',
            fluid: true,
            aspectRatio: '16:9'
        })
        playerReference.current = videoPlayer
        setPlayerState(videoPlayer)
        return () => {
            if (playerReference.current) {
                playerReference.current.dispose()
                playerReference.current = null
            }

            if (urlReference.current) {
                URL.revokeObjectURL(urlReference.current)
                urlReference.current = null
            }
        }
    }, [])

    useEffect(() => {
        if (!playerState) return

        const handleLoadedMetaData = async () => {
            const video = playerState.tech().el() as HTMLVideoElement
            const thumbnailsArray: any[] = await generateThumbnails(video)
            setThumbnailList(thumbnailsArray)
            InputFunction?.handleLoading(false)
            InputFunction?.handleLoadingStage((prev: any) => ({ ...prev, thumbnailGeneration: true }))
        }

        const handlePlayerReady = () => {
            InputFunction?.handleLoadingStage((prev: any) => ({ ...prev, playerReady: true }))
        }

        const handleVideoReady = () => {
            InputFunction?.handleLoadingStage((prev: any) => ({ ...prev, videoReady: true }))
        }

        playerState?.ready(handlePlayerReady)
        playerState?.one('loadeddata', handleVideoReady)
        playerState?.one('loadedmetadata', handleLoadedMetaData)

    }, [playerState])

    useEffect(() => {
        if (!playerReference.current) return
        if (!InputData?.selectedFile) return

        if (urlReference.current) {
            URL.revokeObjectURL(urlReference.current)
        }

        urlReference.current = URL.createObjectURL(InputData.selectedFile)
        playerReference.current.src({
            src: urlReference.current,
            type: InputData.fileType
        })
        playerReference.current.load()

    }, [InputData?.selectedFile])
    // functions

    return (
        <div className="flex flex-col justify-center items-center relative w-screen">
            <div className='relative container w-10/11'>
                {
                    InputData?.loading ?
                        <div className='absolute inset-0 h-full bg-[#0a0a1a] bg-gradient-to-br from-[#0a0a1a] via-[#1a1a3e] to-[#0a0a1a] overflow-hidden flex items-center justify-center' style={{ zIndex: 50 }}>

                            {/* Animated Gradient Orbs */}
                            <div className='absolute top-[-20%] left-[-10%] w-[40%] h-[40%] rounded-full bg-[rgba(108,99,255,0.15)] blur-3xl animate-pulse' style={{ animationDuration: '4s' }}></div>
                            <div className='absolute bottom-[-20%] right-[-10%] w-[40%] h-[40%] rounded-full bg-[rgba(108,99,255,0.08)] blur-3xl animate-pulse' style={{ animationDuration: '5s', animationDelay: '1s' }}></div>

                            {/* Center Loading Content */}
                            <div className='relative z-10 flex flex-col items-center gap-8'>

                                {/* Premium Spinner with Rings */}
                                <div className='relative w-24 h-24'>
                                    {/* Outer Ring */}
                                    <div className='absolute inset-0 rounded-full border-[3px] border-[rgba(108,99,255,0.1)]'></div>

                                    {/* Rotating Gradient Ring */}
                                    <div className='absolute inset-0 rounded-full border-[3px] border-transparent border-t-[#6C63FF] border-r-[#8B83FF] animate-spin' style={{ animationDuration: '1.2s' }}></div>

                                    {/* Counter Rotating Ring */}
                                    <div className='absolute inset-[8px] rounded-full border-[2px] border-transparent border-b-[#A78BFA] border-l-[#6C63FF] animate-spin' style={{ animationDuration: '0.8s', animationDirection: 'reverse' }}></div>

                                    {/* Inner Dot with Pulse */}
                                    <div className='absolute inset-[20px] rounded-full bg-[rgba(108,99,255,0.12)] flex items-center justify-center'>
                                        <div className='w-3 h-3 rounded-full bg-gradient-to-r from-[#6C63FF] to-[#A78BFA] animate-ping' style={{ animationDuration: '1.5s' }}></div>
                                    </div>

                                    {/* Floating Particles */}
                                    <div className='absolute -top-2 -right-2 w-2 h-2 rounded-full bg-[#6C63FF] animate-pulse' style={{ animationDuration: '0.8s' }}></div>
                                    <div className='absolute -bottom-1 -left-1 w-1.5 h-1.5 rounded-full bg-[#A78BFA] animate-pulse' style={{ animationDuration: '1.2s', animationDelay: '0.3s' }}></div>
                                </div>

                                {/* Loading Text */}
                                <div className='text-center space-y-3'>
                                    <div className='flex items-center justify-center gap-2'>
                                        <p className='font-poppins text-[18px] font-semibold bg-gradient-to-r from-[#E8E8FF] to-[#A78BFA] bg-clip-text text-transparent'>
                                            {!InputData?.loadingStage?.playerReady && !InputData?.loadingStage?.videoReady && !InputData?.loadingStage?.thumbnailGeneration && "Initializing Player"}
                                            {InputData?.loadingStage?.playerReady && !InputData?.loadingStage?.videoReady && !InputData?.loadingStage?.thumbnailGeneration && "Loading Video Content"}
                                            {InputData?.loadingStage?.playerReady && InputData?.loadingStage?.videoReady && !InputData?.loadingStage?.thumbnailGeneration && "Generating Preview"}
                                            {InputData?.loadingStage?.playerReady && InputData?.loadingStage?.videoReady && InputData?.loadingStage?.thumbnailGeneration && "Ready to Play!"}
                                        </p>
                                        <span className='flex gap-1'>
                                            <span className='w-1.5 h-1.5 rounded-full bg-[#6C63FF] animate-bounce' style={{ animationDelay: '0s' }}></span>
                                            <span className='w-1.5 h-1.5 rounded-full bg-[#6C63FF] animate-bounce' style={{ animationDelay: '0.2s' }}></span>
                                            <span className='w-1.5 h-1.5 rounded-full bg-[#6C63FF] animate-bounce' style={{ animationDelay: '0.4s' }}></span>
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Grid Pattern Overlay */}
                            <div className='absolute inset-0 opacity-[0.03]' style={{
                                backgroundImage: `
                    linear-gradient(rgba(108,99,255,0.5) 1px, transparent 1px),
                    linear-gradient(90deg, rgba(108,99,255,0.5) 1px, transparent 1px)
                `,
                                backgroundSize: '40px 40px'
                            }}></div>
                        </div> : null
                }
                <div ref={videoReference} />
            </div>
            <PlayerContext.Provider value={{ player: playerState, thumbnail: thumbnailList}}>
                <VideoPlayerOverlay />
            </PlayerContext.Provider>
        </div>
    )
}
