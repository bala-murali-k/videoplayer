// Required imports
import React, { useRef } from "react"
// Component imports
// Required objects

export function FileBrowserPlayerComponent ({ InputData, InputFunction }: any) {

	const inputReference = useRef<HTMLInputElement>(null)

    // Functions
    function handleOnChange (event: React.ChangeEvent<HTMLInputElement>) {
        const file = event?.target.files
        if (!file) return
        InputFunction?.handleFileStore(file[0])
        console.log('The recieved file is ', event?.target.files);
    }

    function handleOnDrop (event: React.DragEvent) {
        event?.preventDefault()
        event?.stopPropagation()
        console.log('This is the drop event : ', event?.dataTransfer?.files);
    }
    
	return (
		<div className="flex flex-col justify-center items-center w-screen">
            <input ref={inputReference} type="file" accept={InputData?.AcceptedFiles} className="hidden" onChange={(event) => { handleOnChange(event) }} />
            <div
                className="container w-10/11 flex flex-col items-center justify-center bg-[rgba(108,99,255,0.12)] rounded-2xl px-5 py-9 cursor-pointer border border-dashed border-[rgba(108,99,255,0.3)]"
                role="button"
                tabIndex={0}
                onClick={() => { inputReference.current?.click() }}
                onDragOver={ (event) => {event?.stopPropagation(), event?.preventDefault() }}
                onDrop={(event) => { handleOnDrop(event) }}
            >
                <div className="rounded-full border border-[rgba(108,99,255,0.3)] p-4 mb-3 bg-[rgba(108,99,255,0.1)] flex items-center justify-center">
                    <span className="material-symbols-outlined text-9xl" style={{ color: '#6C63FF', fontSize: '30px' }}>cloud_upload</span>
                </div>
                <p className="font-poppins text-[17px] font-semibold mb-2" style={{ color: '#E8E8FF' }}>Drop your video here</p>
                <p className="font-poppins text-[11px] text-center mb-3 leading-relaxed font-light" style={{ color: '#E8E8FF' }}>or tap below to browse files from your device</p>
                <button className="font-poppins font-medium text-sm text-white mb-3.5 border border-gray-600 rounded-xl px-5 py-2 cursor-pointer">Browse Files</button>
                <div className="flex justify-center flex-wrap gap-2">
                    {
                        InputData?.supportedFormats?.map((data: string) => (
                            <div className="border border-gray-800 rounded-md px-1.5 py-0.5">
                                <p className="uppercase text-[11px] text-gray-400">{data}</p>
                            </div>
                        ))
                    }
                </div>
            </div>
		</div>
	)
}