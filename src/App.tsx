import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom'
import Layout from './components/Layout'
import ScrollToTop from './components/ScrollToTop'
import Home from './pages/Home'
import About from './pages/About'
import ServicesHub from './pages/ServicesHub'
import Patent from './pages/services/Patent'
import IndustrialDesign from './pages/services/IndustrialDesign'
import Prototyping from './pages/services/Prototyping'
import Electronic from './pages/services/Electronic'
import Mechanical from './pages/services/Mechanical'
import Packaging from './pages/services/Packaging'
import Manufacturing from './pages/services/Manufacturing'
import EventGallery from './pages/EventGallery'
import VideoGallery from './pages/VideoGallery'
import Blogs from './pages/Blogs'
import BlogDetail from './pages/BlogDetail'
import Story from './pages/Story'
import Contact from './pages/Contact'
import Terms from './pages/Terms'
import Privacy from './pages/Privacy'
import PartnerDetail from './pages/PartnerDetail'
import Chat from './pages/Chat'
import { ThemeProvider } from './context/ThemeContext'
import { ToastProvider } from './context/ToastContext'

// Wrapper component for routes that need Layout
function LayoutWrapper() {
  return (
    <Layout>
      <Outlet />
    </Layout>
  )
}

function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <Router>
          <ScrollToTop />
          <Routes>
            {/* Routes with Layout (Header & Footer) */}
            <Route element={<LayoutWrapper />}>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/services" element={<ServicesHub />} />
              <Route path="/services/patent" element={<Patent />} />
              <Route path="/services/industrial-design" element={<IndustrialDesign />} />
              <Route path="/services/prototyping" element={<Prototyping />} />
              <Route path="/services/electronic" element={<Electronic />} />
              <Route path="/services/mechanical" element={<Mechanical />} />
              <Route path="/services/packaging" element={<Packaging />} />
              <Route path="/services/manufacturing" element={<Manufacturing />} />
              <Route path="/story" element={<Story />} />
              <Route path="/event-gallery" element={<EventGallery />} />
              <Route path="/video-gallery" element={<VideoGallery />} />
              <Route path="/blogs" element={<Blogs />} />
              <Route path="/blogs/:slug" element={<BlogDetail />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/partner/:slug" element={<PartnerDetail />} />
              <Route path="/chat" element={<Chat />} />
            </Route>
          </Routes>
        </Router>
      </ToastProvider>
    </ThemeProvider>
  )
}

export default App

