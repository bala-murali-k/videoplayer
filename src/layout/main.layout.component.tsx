// Required Imports
import { Link, Outlet } from 'react-router-dom'

export default function MainLayout() {

    return (
        <div className="min-h-screen bg-[#0A0A0F]">
            <header className="flex items-center justify-between px-4 py-3">
                <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: '#6C63FF' }}>
                        <span className="text-white material-symbols-rounded filled">play_arrow</span>
                    </div>
                    <span className="font-poppins text-[21px] font-semibold" style={{ color: '#E8E8FF' }}>Player</span>
                </div>
                <Link to="/settings">
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