import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { StoreContext, useStoreReducer } from './store/useStore'
import Navigation from './components/Navigation'
import Home from './pages/Home'
import MySets from './pages/MySets'
import Inventory from './pages/Inventory'
import Generator from './pages/Generator'
import Plans from './pages/Plans'
import BuiltCircuits from './pages/BuiltCircuits'
import Modules from './pages/Modules'
import Settings from './pages/Settings'
import ImageManager from './pages/ImageManager'
import CircuitBuilder from './pages/CircuitBuilder'

function AppInner() {
  return (
    <div className="flex flex-col min-h-dvh">
      <main className="flex-1 safe-bottom overflow-y-auto">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/sets" element={<MySets />} />
          <Route path="/inventaire" element={<Inventory />} />
          <Route path="/generateur" element={<Generator />} />
          <Route path="/plans" element={<Plans />} />
          <Route path="/circuits" element={<BuiltCircuits />} />
          <Route path="/modules" element={<Modules />} />
          <Route path="/parametres" element={<Settings />} />
          <Route path="/images" element={<ImageManager />} />
          <Route path="/builder" element={<CircuitBuilder />} />
        </Routes>
      </main>
      <Navigation />
    </div>
  )
}

export default function App() {
  const store = useStoreReducer()
  return (
    <StoreContext.Provider value={store}>
      <BrowserRouter basename="/marble-rush-builder">
        <AppInner />
      </BrowserRouter>
    </StoreContext.Provider>
  )
}
