// Required imports
import { useState } from 'react'
// Component imports
import { FileBrowserPlayerComponent } from './filebrowse/filebrowse.player.component'
import { VideoPlayer } from './videoplayer/videoplayer.player.component'

const FORMATS = ['mp4', 'mkv', 'webm', 'avi', 'mov']
const ACCEPT = 'video/mp4,video/matroska,video/webm,video/x-msvideo,video/quicktime'

export function PlayerCoreComponent() {
    const [currentVideoFile, setCurrentVideoFile] = useState<File | null>(null)

    const handleFileSelect = (file: File) => {
        setCurrentVideoFile(file)
    }

    const handleReturnBack = () => {
        setCurrentVideoFile(null)
    }

    return (
        <div className="w-full flex flex-col items-center">
            {currentVideoFile ? (
                <VideoPlayer
                    selectedFile={currentVideoFile}
                    fileType={currentVideoFile.type}
                    onReturnBack={handleReturnBack}
                />
            ) : (
                <FileBrowserPlayerComponent
                    supportedFormats={FORMATS}
                    acceptedFiles={ACCEPT}
                    onFileSelect={handleFileSelect}
                />
            )}
            {/* Recently Played is skipped for now as requested */}
        </div>
    )
}
