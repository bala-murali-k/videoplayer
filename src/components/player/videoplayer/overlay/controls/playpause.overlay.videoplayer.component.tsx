// Required imports
import { useContext, useEffect, useState } from "react"
import { PlayerContext } from "../../videoplayer.player.component"
// Component imports
// Required objects

export function PlayPauseControlOverlay () {

    // Necessary variables
    const videoPlayerContext = useContext(PlayerContext)
    if (!videoPlayerContext) {
        return null
    }
    const [isPlaying, setIsPlaying] = useState<boolean>(false)

    useEffect(() => {
        const player = videoPlayerContext.player
        if (!player) return

        const handlePlay = () => { setIsPlaying(true) }
        const handlePause = () => { setIsPlaying(false) }
        setIsPlaying(!player.paused())
        player.on('play', handlePlay)
        player.on('pause', handlePause)

        return () => {
            player.off('play', handlePlay)
            player.off('pause', handlePause)
        }
    }, [videoPlayerContext.player])

    return (
        <div className='absolute inset-0 flex items-center justify-center'>
            <div className='container w-10/11 h-full relative flex items-center justify-center'>
                <button
                    className="group relative flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br from-[rgba(108,99,255,0.2)] to-[rgba(108,99,255,0.05)] border-2 border-[rgba(108,99,255,0.4)] hover:bg-gradient-to-br hover:from-[rgba(108,99,255,0.35)] hover:to-[rgba(108,99,255,0.15)] hover:border-[rgba(108,99,255,0.7)] transition-all duration-300 ease-in-out transform hover:scale-110 active:scale-95 touch-manipulation shadow-lg hover:shadow-[0_0_40px_rgba(108,99,255,0.2)]"
                    onClick={() => {
                        console.log('The button is clicked bruh');
                        if (!videoPlayerContext.player) return
                        if (videoPlayerContext.player.paused()) {
                            videoPlayerContext.player.play()
                            return
                        }
                        videoPlayerContext.player.pause()
                    }}
                >
                    <span className="absolute inset-0 rounded-full border-2 border-[rgba(108,99,255,0.2)] opacity-0 group-hover:opacity-100 group-hover:animate-ping transition-opacity duration-300"></span>
                    <span className="absolute inset-1 rounded-full bg-[rgba(108,99,255,0.08)] group-hover:bg-[rgba(108,99,255,0.15)] transition-all duration-300"></span>
                    <span
                        className="material-symbols-outlined relative z-10 transition-all duration-300 ease-in-out group-hover:scale-110"
                        style={{
                            fontSize: '36px',
                            color: 'rgba(232,232,255,0.85)',
                        }}
                    >
                        {isPlaying ? 'pause' : 'play_arrow'}
                    </span>
                </button>
            </div>
        </div>
    )
}