import { site } from '../config'

export default function Hero() {
  return (
    <section id="top" className="hero">
      <div className="wrap">
        <div className="hero-eyebrow">{site.tagline}</div>
        <h1>{site.name}</h1>
        <p className="hero-line">{site.heroLine}</p>
        <a href="#work" className="hero-cta">
          View the work ↓
        </a>
      </div>
    </section>
  )
}
