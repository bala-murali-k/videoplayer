// Required imports
import { useState, useEffect } from 'react'
// Component imports
import { FileBrowserPlayerComponent } from './filebrowse/filebrowse.player.component'
import { RecentlyPlayedPlayerComponent } from './recentplays/recentplayed.player.component'
import { VideoPlayer } from './videoplayer/videoplayer.player.component'
// Required objects

export function PlayerCoreComponent ({  }) {
	
	// Necessary variables
  	const FORMATS = ['mp4', 'mkv', 'webm', 'avi', 'mov']
	const ACCEPT = 'video/mp4,video/matroska,video/webm,video/x-msvideo,video/quicktime'
	const [currentVideoFile, setCurrentVideoFile] = useState<File | null>(null)
	const [isVideoLoading, setIsVideoLoading] = useState<boolean>(false)
	const [loadingStages, setLoadingStages] = useState({
		videoReady: false,
		playerReady: false,
		thumbnailGeneration: false
	})

	// Side effects
	useEffect(() => {
		setIsVideoLoading(true)
	}, [currentVideoFile])
	

	return (
		<div>
			{
				currentVideoFile ? 
				<VideoPlayer
					InputData={{
						selectedFile: currentVideoFile,
						fileType: currentVideoFile?.type,
						loading: isVideoLoading,
						loadingStage: loadingStages,
					}}
					InputFunction={{
						handleLoading: (state: boolean) => {
							setIsVideoLoading(state)
						},
						handleLoadingStage: (stage: any) => {
							setLoadingStages(stage)
						}
					}}
				/> :
				<FileBrowserPlayerComponent
					InputData={{
						supportedFormats: FORMATS,
						AcceptedFiles: ACCEPT,
						files: currentVideoFile,
					}}
					InputFunction={{
						handleFileStore: (fileChange: any) => {
							setCurrentVideoFile(fileChange)
						},
					}}
				/>
			}
			<RecentlyPlayedPlayerComponent />
		</div>
	)
}
