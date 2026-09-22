// Required imports
// Component imports
import { PlayPauseControlOverlay } from "./controls/playpause.overlay.videoplayer.component"
import { ProgressbarControlOverlay } from "./controls/progressbar.overlay.videoplayer.component"
// Required objects

export function VideoPlayerOverlay () {
    return (
        <div className='absolute h-full inset-0 flex items-center justify-center'>
            <div className='container h-full'>
                <div className="grid h-full grid-rows-[1fr_1fr_1fr]">
                    <div className=""></div>
                    <div className="relative">
                        <PlayPauseControlOverlay />
                    </div>
                    <div className="relative">
                        <ProgressbarControlOverlay />
                    </div>
                </div>
            </div>
        </div>
    )
}
