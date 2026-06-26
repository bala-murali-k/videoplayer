// Required imports
import { useState } from 'react'
// Component imports
import { FileBrowserPlayerComponent } from './filebrowse/filebrowse.player.component'
import { RecentlyPlayedPlayerComponent } from './recentplays/recentplayed.player.component'
import { VideoPlayer } from './videoplayer/videoplayer.player.component'
// Required objects

export function PlayerCoreComponent ({  }) {
	
    const FORMATS = ['mp4', 'mkv', 'webm', 'avi', 'mov']
	const ACCEPT = 'video/mp4,video/matroska,video/webm,video/x-msvideo,video/quicktime'

	const [currentVideoFile, setCurrentVideoFile] = useState<File | null>(null)
	console.log('LLLLLLLLLLLLLLLLLL', currentVideoFile?.type);
	

	return (
		<div>
			{
				currentVideoFile ? 
				<VideoPlayer
					InputData={{
						selectedFile: currentVideoFile,
						fileType: currentVideoFile?.type
					}}
					InputFunction={{}}
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