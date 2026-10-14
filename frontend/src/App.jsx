import { Route, Routes } from 'react-router-dom'
import Footer from './components/Footer'
import NavBar from './components/NavBar'
import About from './pages/About'
import AssetForm from './pages/AssetForm'
import AssetList from './pages/AssetList'
import Home from './pages/Home'
import './App.css'

export default function App() {
  return (
    <div className="app">
      <NavBar />
      <main className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/computers" element={<AssetList />} />
          <Route path="/add" element={<AssetForm />} />
          <Route path="/edit/:id" element={<AssetForm />} />
          <Route path="/about" element={<About />} />
          <Route path="*" element={<h1>Page not found</h1>} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}
