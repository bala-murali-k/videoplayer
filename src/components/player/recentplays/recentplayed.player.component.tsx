// Required imports
// Component imports
// Required objects

export function RecentlyPlayedPlayerComponent () {
    
    return (
        <div className="flex flex-col justify-center items-center w-screen">
            <div className="flex my-3 items-center gap-2 w-10/11">
                <div className="h-[0.2px] bg-gray-800 flex-1"></div>
                <p className="font-poppins text-xs text-gray-400">recently played</p>
                <div className="h-[0.2px] bg-gray-800 flex-1"></div>
            </div>
            <div className="container w-10/11 flex flex-col items-center justify-center bg-[#141420] rounded-2xl border border-[rgba(255,255,255,0.07)] px-5 py-7">
                <div className="border border-gray-800 mb-3 p-1 rounded-full bg-[#141420]">
                    <div className="flex rounded-full p-1 border border-gray-800 border-dashed bg-[#141420]">
                        <span className="material-symbols-rounded" style={{ color: '#1F2937', fontSize: '20px' }}>history</span>
                    </div>
                </div>
                <p className="font-poppins text-[17px] text-[#808091] mb-2">Nothing played yet</p>
                <p className="max-w-50 flex text-center font-poppins font-light text-[12px] text-[#595962] mb-2">Videos you open will appear here so you can jump back in quickly.</p>
            </div>
        </div>
    )
}