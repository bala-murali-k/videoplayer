import { Routes, Route } from "react-router-dom"
import './App.css'
import MainLayout from './layout/main.layout.component'
import Player from './pages/player/index'

function App() {

  return (
    <>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Player />} />
          <Route path="/about" element={<>this is the about</>} />
        </Route>
      </Routes>
    </>
  )
}

export default App
