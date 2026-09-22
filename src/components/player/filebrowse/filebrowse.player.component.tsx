// Required imports
import React, { useRef, useState } from "react"

export interface FileBrowserPlayerProps {
    supportedFormats: string[]
    acceptedFiles: string
    onFileSelect: (file: File) => void
}

export function FileBrowserPlayerComponent({
    supportedFormats,
    acceptedFiles,
    onFileSelect
}: FileBrowserPlayerProps) {
    const inputReference = useRef<HTMLInputElement>(null)
    const [isDragging, setIsDragging] = useState<boolean>(false)

    function handleOnChange(event: React.ChangeEvent<HTMLInputElement>) {
        const files = event.target.files
        if (!files || files.length === 0) return
        onFileSelect(files[0])
    }

    function handleOnDragOver(event: React.DragEvent<HTMLDivElement>) {
        event.preventDefault()
        event.stopPropagation()
        setIsDragging(true)
    }

    function handleOnDragLeave(event: React.DragEvent<HTMLDivElement>) {
        event.preventDefault()
        event.stopPropagation()
        setIsDragging(false)
    }

    function handleOnDrop(event: React.DragEvent<HTMLDivElement>) {
        event.preventDefault()
        event.stopPropagation()
        setIsDragging(false)

        const files = event.dataTransfer?.files
        if (files && files.length > 0) {
            onFileSelect(files[0])
        }
    }

    function handleKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault()
            inputReference.current?.click()
        }
    }

    return (
        <div className="flex flex-col justify-center items-center w-full px-4">
            <input
                ref={inputReference}
                type="file"
                accept={acceptedFiles}
                className="hidden"
                onChange={handleOnChange}
            />
            <div
                className={`w-full max-w-2xl flex flex-col items-center justify-center rounded-2xl px-6 py-12 cursor-pointer border-2 border-dashed transition-all duration-300 ${
                    isDragging
                        ? "bg-[rgba(108,99,255,0.22)] border-[#6C63FF] scale-[1.01] shadow-[0_0_30px_rgba(108,99,255,0.25)]"
                        : "bg-[rgba(108,99,255,0.08)] border-[rgba(108,99,255,0.3)] hover:border-[rgba(108,99,255,0.5)] hover:bg-[rgba(108,99,255,0.12)]"
                }`}
                role="button"
                tabIndex={0}
                aria-label="Drop video file or click to browse files."
                onClick={() => inputReference.current?.click()}
                onKeyDown={handleKeyDown}
                onDragOver={handleOnDragOver}
                onDragLeave={handleOnDragLeave}
                onDrop={handleOnDrop}
            >
                <div className="rounded-full border border-[rgba(108,99,255,0.4)] p-4 mb-4 bg-[rgba(108,99,255,0.15)] flex items-center justify-center shadow-[0_0_20px_rgba(108,99,255,0.2)]">
                    <span className="material-symbols-outlined" style={{ color: "#8B83FF", fontSize: "36px" }}>
                        cloud_upload
                    </span>
                </div>
                <p className="font-poppins text-lg font-semibold mb-2" style={{ color: "#E8E8FF" }}>
                    Drop your video here
                </p>
                <p className="font-poppins text-xs text-center mb-4 leading-relaxed font-light" style={{ color: "#A8A8C0" }}>
                    or tap below to browse files from your device
                </p>
                <span className="font-poppins font-medium text-sm text-white mb-4 border border-[rgba(108,99,255,0.4)] bg-[rgba(108,99,255,0.2)] rounded-xl px-5 py-2.5 shadow-sm pointer-events-none">
                    Browse Files
                </span>
                <div className="flex justify-center flex-wrap gap-2">
                    {supportedFormats.map((data: string, index: number) => (
                        <div key={`${index}-${data}`} className="border border-gray-800 bg-[#12121c] rounded-md px-2 py-0.5">
                            <p className="uppercase text-[11px] text-gray-400 font-mono">{data}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}