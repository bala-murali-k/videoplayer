// Required Imports
import { Link, Outlet } from 'react-router-dom'

export default function MainLayout() {
    return (
        <div className="min-h-screen bg-[#0A0A0F]">
            <header className="flex items-center justify-between px-4 py-3">
                <Link to="/" className="flex items-center gap-2" aria-label="Video Player Home">
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-[#6C63FF]">
                        <span className="text-white material-symbols-rounded filled text-base">play_arrow</span>
                    </div>
                    <span className="font-poppins text-[21px] font-semibold text-[#E8E8FF]">Player</span>
                </Link>
                <Link
                    to="/settings"
                    className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white/10 transition-colors"
                    aria-label="Settings"
                >
                    <span className="text-white material-symbols-rounded filled">more_vert</span>
                </Link>
            </header>

            <main className="pt-2">
                <div className="max-w-screen mx-auto">
                    <Outlet />
                </div>
            </main>
        </div>
    )
}