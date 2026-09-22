// types
export type Thumbnail = {
    interval: {
        start: number;
        end: number;
    };
    image: string;
}

export function formatVideoTime(seconds: number): string {
    if (!Number.isFinite(seconds) || seconds < 0) {
        return "0:00"
    }

    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = Math.floor(seconds % 60)

    const paddedMinutes =
        hours > 0 ? String(minutes).padStart(2, "0") : String(minutes)

    const paddedSeconds = String(secs).padStart(2, "0")

    if (hours > 0) {
        return `${hours}:${paddedMinutes}:${paddedSeconds}`
    }

    return `${minutes}:${paddedSeconds}`
}

export function formatFileSize(bytes: number): string {
    if (!Number.isFinite(bytes) || bytes <= 0) return "0 B"
    const units = ["B", "KB", "MB", "GB", "TB"]
    const i = Math.floor(Math.log(bytes) / Math.log(1024))
    const formattedSize = (bytes / Math.pow(1024, i)).toFixed(1)
    return `${formattedSize} ${units[i]}`
}

export async function generateThumbnails(
    video: HTMLVideoElement,
    maxThumbnails: number = 15
): Promise<Thumbnail[]> {
    const duration = video.duration
    if (!Number.isFinite(duration) || duration <= 0) {
        return []
    }

    const canvas = document.createElement("canvas")
    const context = canvas.getContext("2d")

    if (!context) {
        return []
    }

    const width = 160
    const height = 90
    canvas.width = width
    canvas.height = height

    const thumbnailCount = Math.min(maxThumbnails, Math.max(1, Math.floor(duration)))
    const interval = duration / thumbnailCount
    const thumbnailArray: Thumbnail[] = []

    // Attempt to use an offscreen video element to avoid interrupting the main video playback
    const videoSource = video.currentSrc || video.src
    let targetVideo: HTMLVideoElement = video
    let isOffscreen = false

    if (videoSource) {
        try {
            const offscreen = document.createElement("video")
            offscreen.muted = true
            offscreen.playsInline = true
            offscreen.preload = "auto"
            offscreen.src = videoSource

            // Wait for metadata on offscreen video with a timeout
            await new Promise<void>((resolve) => {
                const timer = setTimeout(() => resolve(), 2000)
                offscreen.addEventListener("loadedmetadata", () => {
                    clearTimeout(timer)
                    resolve()
                }, { once: true })
            })

            if (offscreen.duration && Number.isFinite(offscreen.duration)) {
                targetVideo = offscreen
                isOffscreen = true
            }
        } catch {
            targetVideo = video
            isOffscreen = false
        }
    }

    const originalTime = targetVideo.currentTime
    const wasPaused = targetVideo.paused

    try {
        for (let i = 0; i < thumbnailCount; i++) {
            const start = i * interval
            const end = Math.min((i + 1) * interval, duration)

            await new Promise<void>((resolve) => {
                const timeoutId = setTimeout(() => {
                    targetVideo.removeEventListener("seeked", onSeeked)
                    resolve()
                }, 500) // 500ms seek safety timeout

                const onSeeked = () => {
                    clearTimeout(timeoutId)
                    try {
                        context.drawImage(targetVideo, 0, 0, width, height)
                        thumbnailArray.push({
                            interval: { start, end },
                            image: canvas.toDataURL("image/webp", 0.7)
                        })
                    } catch {
                        // Ignore frame capture failure on protected or empty frame
                    }
                    resolve()
                }

                targetVideo.addEventListener("seeked", onSeeked, { once: true })
                targetVideo.currentTime = Math.min(start, duration - 0.1)
            })
        }
    } finally {
        if (!isOffscreen) {
            // Restore original state if live video element was used
            targetVideo.currentTime = originalTime
            if (!wasPaused) {
                targetVideo.play().catch(() => {})
            }
        } else {
            // Cleanup offscreen element
            targetVideo.src = ""
            targetVideo.load()
            targetVideo.remove()
        }
    }

    return thumbnailArray
}

export function getThumbnail(hoverTime: number, thumbnailList: Thumbnail[]): string | null {
    if (!thumbnailList || thumbnailList.length === 0) return null
    const thumbnail = thumbnailList.find(
        ({ interval }) =>
            hoverTime >= interval.start &&
            hoverTime < interval.end
    )

    return thumbnail?.image ?? null
}