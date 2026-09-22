import { Routes, Route } from "react-router-dom"
import './App.css'
import MainLayout from './layout/main.layout.component'
import Player from './pages/player/index'
import Settings from './pages/settings/index'

function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Player />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/about" element={<div className="p-6 text-white font-poppins">About Video Player</div>} />
      </Route>
    </Routes>
  )
}

export default App
