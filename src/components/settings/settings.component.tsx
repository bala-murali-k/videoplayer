import { useState } from 'react'
import { Link } from 'react-router-dom'

export function SettingsComponent() {
    const [defaultSpeed, setDefaultSpeed] = useState<string>('1')
    const [loopPlayback, setLoopPlayback] = useState<boolean>(false)
    const [generateThumbnailsPref, setGenerateThumbnailsPref] = useState<boolean>(true)
    const [skipInterval, setSkipInterval] = useState<string>('10')

    const SHORTCUTS = [
        { key: 'Space / K', desc: 'Play / Pause playback' },
        { key: '← / →', desc: 'Seek backward / forward 5 seconds' },
        { key: 'J / L', desc: 'Seek backward / forward 10 seconds' },
        { key: '↑ / ↓', desc: 'Adjust volume level by 10%' },
        { key: 'M', desc: 'Toggle audio mute' },
        { key: 'F', desc: 'Toggle fullscreen mode' },
    ]

    return (
        <div className="w-full max-w-3xl mx-auto px-4 py-4 font-poppins text-white pb-12">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-800/80 pb-4 mb-6">
                <div className="flex items-center gap-3">
                    <Link
                        to="/"
                        className="w-9 h-9 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center transition-all cursor-pointer text-[#E8E8FF]"
                        aria-label="Back to player"
                    >
                        <span className="material-symbols-rounded text-xl">arrow_back</span>
                    </Link>
                    <div>
                        <h1 className="text-xl font-semibold text-[#E8E8FF]">Settings</h1>
                        <p className="text-xs text-gray-400">Manage player preferences and controls</p>
                    </div>
                </div>
            </div>

            <div className="space-y-6">
                {/* Section 1: Playback Preferences */}
                <div className="bg-[#141422] border border-[rgba(108,99,255,0.2)] rounded-2xl p-5 shadow-lg space-y-4">
                    <div className="flex items-center gap-2 text-[#8B83FF] font-medium text-sm">
                        <span className="material-symbols-rounded text-lg">play_circle</span>
                        <h2>Playback Preferences</h2>
                    </div>

                    <div className="divide-y divide-gray-800/60">
                        {/* Default Speed */}
                        <div className="flex items-center justify-between py-3">
                            <div>
                                <p className="text-sm font-medium text-gray-200">Default Playback Speed</p>
                                <p className="text-xs text-gray-400">Speed applied when starting a video</p>
                            </div>
                            <select
                                value={defaultSpeed}
                                onChange={(e) => setDefaultSpeed(e.target.value)}
                                className="bg-[#1A1A2E] border border-gray-700 text-xs text-white rounded-lg px-3 py-1.5 outline-none focus:border-[#6C63FF] cursor-pointer"
                                aria-label="Default playback speed"
                            >
                                <option value="0.5">0.5x</option>
                                <option value="0.75">0.75x</option>
                                <option value="1">1.0x (Normal)</option>
                                <option value="1.25">1.25x</option>
                                <option value="1.5">1.5x</option>
                                <option value="2">2.0x</option>
                            </select>
                        </div>

                        {/* Skip Interval */}
                        <div className="flex items-center justify-between py-3">
                            <div>
                                <p className="text-sm font-medium text-gray-200">Skip Interval</p>
                                <p className="text-xs text-gray-400">Duration for seek backward/forward buttons</p>
                            </div>
                            <select
                                value={skipInterval}
                                onChange={(e) => setSkipInterval(e.target.value)}
                                className="bg-[#1A1A2E] border border-gray-700 text-xs text-white rounded-lg px-3 py-1.5 outline-none focus:border-[#6C63FF] cursor-pointer"
                                aria-label="Skip interval duration"
                            >
                                <option value="5">5 seconds</option>
                                <option value="10">10 seconds</option>
                                <option value="15">15 seconds</option>
                                <option value="30">30 seconds</option>
                            </select>
                        </div>

                        {/* Loop Playback */}
                        <div className="flex items-center justify-between py-3">
                            <div>
                                <p className="text-sm font-medium text-gray-200">Loop Playback</p>
                                <p className="text-xs text-gray-400">Restart video automatically when finished</p>
                            </div>
                            <button
                                type="button"
                                role="switch"
                                aria-checked={loopPlayback}
                                aria-label="Toggle loop playback"
                                onClick={() => setLoopPlayback(!loopPlayback)}
                                className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                                    loopPlayback ? 'bg-[#6C63FF]' : 'bg-gray-700'
                                }`}
                            >
                                <span
                                    className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform ${
                                        loopPlayback ? 'translate-x-5' : 'translate-x-0'
                                    }`}
                                />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Section 2: Performance & Previews */}
                <div className="bg-[#141422] border border-[rgba(108,99,255,0.2)] rounded-2xl p-5 shadow-lg space-y-4">
                    <div className="flex items-center gap-2 text-[#8B83FF] font-medium text-sm">
                        <span className="material-symbols-rounded text-lg">tune</span>
                        <h2>Performance & Previews</h2>
                    </div>

                    <div className="flex items-center justify-between py-2">
                        <div>
                            <p className="text-sm font-medium text-gray-200">Hover Scrub Thumbnails</p>
                            <p className="text-xs text-gray-400">
                                Extract preview frames for hover seeking. Disable if running on low memory.
                            </p>
                        </div>
                        <button
                            type="button"
                            role="switch"
                            aria-checked={generateThumbnailsPref}
                            aria-label="Toggle hover scrub thumbnails"
                            onClick={() => setGenerateThumbnailsPref(!generateThumbnailsPref)}
                            className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                                generateThumbnailsPref ? 'bg-[#6C63FF]' : 'bg-gray-700'
                            }`}
                        >
                            <span
                                className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform ${
                                    generateThumbnailsPref ? 'translate-x-5' : 'translate-x-0'
                                }`}
                            />
                        </button>
                    </div>
                </div>

                {/* Section 3: Keyboard Shortcuts Cheatsheet */}
                <div className="bg-[#141422] border border-[rgba(108,99,255,0.2)] rounded-2xl p-5 shadow-lg space-y-4">
                    <div className="flex items-center gap-2 text-[#8B83FF] font-medium text-sm">
                        <span className="material-symbols-rounded text-lg">keyboard</span>
                        <h2>Keyboard Shortcuts</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                        {SHORTCUTS.map((sc) => (
                            <div
                                key={sc.key}
                                className="flex items-center justify-between p-2.5 rounded-xl bg-black/30 border border-white/5 text-xs"
                            >
                                <span className="text-gray-300 font-light">{sc.desc}</span>
                                <kbd className="px-2 py-1 bg-white/10 rounded-md border border-white/10 text-[#E8E8FF] font-mono text-[11px] font-semibold">
                                    {sc.key}
                                </kbd>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Section 4: About & Version */}
                <div className="bg-[#141422] border border-gray-800 rounded-2xl p-5 shadow-lg space-y-3">
                    <div className="flex items-center gap-2 text-gray-400 font-medium text-sm">
                        <span className="material-symbols-rounded text-lg">info</span>
                        <h2>About Video Player</h2>
                    </div>
                    <div className="text-xs text-gray-400 space-y-1.5 leading-relaxed">
                        <p>
                            A local, browser-based video player supporting formats including{' '}
                            <span className="text-[#8B83FF] font-mono">MP4, MKV, WebM, AVI, MOV</span>.
                        </p>
                        <p className="text-gray-500 pt-1">Version 1.0.0 • React 19 & Tailwind CSS</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

