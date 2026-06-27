// types
type Thumbnail = {
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

export async function generateThumbnails(video: HTMLVideoElement, maxThumbnails: number = 20) {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");

    if (!context) {
        throw new Error("Unable to create canvas context.");
    }

    const width = 160;
    const height = 90;

    canvas.width = width;
    canvas.height = height;

    const duration = video.duration;

    const thumbnailCount = Math.min(maxThumbnails, Math.max(1, Math.ceil(duration)));
    const interval = duration / thumbnailCount;

    const originalTime = video.currentTime;
    const wasPaused = video.paused;

    const thumbnailArray = [];

    for (let i = 0; i < thumbnailCount; i++) {

        const start = i * interval;
        const end = Math.min((i + 1) * interval, duration);

        await new Promise<void>((resolve) => {

            const onSeeked = () => {

                context.drawImage(video, 0, 0, width, height);

                thumbnailArray.push({
                    interval: {
                        start,
                        end
                    },
                    image: canvas.toDataURL("image/webp", 0.8)
                });

                resolve();
            };

            video.addEventListener("seeked", onSeeked, { once: true });

            video.currentTime = start;
        });
    }

    await new Promise<void>((resolve) => {

        const onSeeked = () => {

            if (!wasPaused) {
                video.play().catch(() => {});
            }

            resolve();
        };

        video.addEventListener("seeked", onSeeked, { once: true });

        video.currentTime = originalTime;
    });

    return thumbnailArray;
}

export function getThumbnail (hoverTime: number, thumbnailList: Thumbnail[]): string | null {
    const thumbnail = thumbnailList.find(
        ({ interval }) =>
            hoverTime >= interval.start &&
            hoverTime < interval.end
    )
    
    return thumbnail?.image ?? null
}