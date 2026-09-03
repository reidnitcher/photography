import { site } from '../config'

export default function Contact() {
  return (
    <section id="contact">
      <div className="wrap">
        <div className="section-head">
          <h2>Get in touch</h2>
        </div>
        <div className="contact">
          <a className="contact-email" href={`mailto:${site.email}`}>
            {site.email}
          </a>
          {site.location && <div className="contact-meta">{site.location}</div>}
          {site.social.length > 0 && (
            <div className="social-links">
              {site.social.map((s) => (
                <a key={s.url} href={s.url} target="_blank" rel="noreferrer">
                  {s.label}
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
