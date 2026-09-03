import { site } from '../config'

export default function About() {
  return (
    <section id="about">
      <div className="wrap">
        <div className="section-head">
          <h2>About</h2>
        </div>
        <div className="about">
          <p>{site.about}</p>
        </div>
      </div>
    </section>
  )
}
