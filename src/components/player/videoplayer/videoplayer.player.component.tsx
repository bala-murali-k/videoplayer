// Required imports
import { useEffect, useRef, createContext } from 'react'
import videojs from 'video.js'
import 'video.js/dist/video-js.css'
// Component imports
import { VideoPlayerOverlay } from './overlay/overlay.videoplayer.component'

export type PlayerContextType = ReturnType<typeof videojs> | null

export const PlayerContext = createContext<PlayerContextType>(null)

export function VideoPlayer ({ InputData }: any) {

    // necessary variables
    const videoReference = useRef<HTMLDivElement>(null)
    const playerReference = useRef<ReturnType<typeof videojs> | null>(null)
    const urlReference = useRef<string | null>(null)

    // side effects
    useEffect(() => {
        if (!videoReference.current) return

        // create object url
        urlReference.current = URL.createObjectURL(InputData?.selectedFile)
        const videoElement = document.createElement('video-js')
        videoElement.classList.add('video-js','vjs-big-play-centered')
        videoReference.current.appendChild(videoElement)

        playerReference.current = videojs(videoElement, {
            controls: false,
            autoplay: false,
            preload: 'auto',
            fluid: true,
            aspectRatio: '16:9'
        })
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
            <div className='container w-10/11'>
                <div ref={videoReference} />
            </div>
            <PlayerContext.Provider value={playerReference.current}>
                <VideoPlayerOverlay />
            </PlayerContext.Provider>
        </div>
    )
}
