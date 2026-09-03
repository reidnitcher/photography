import Nav from './components/Nav'
import Hero from './components/Hero'
import Gallery from './components/Gallery'
import About from './components/About'
// Contact section is hidden for now — re-add <Contact /> below (and the
// nav link in Nav.jsx) when ready to show it again.
// import Contact from './components/Contact'
import Footer from './components/Footer'

export default function App() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Gallery />
        <About />
      </main>
      <Footer />
    </>
  )
}
