import { site } from '../config'

export default function Footer() {
  return (
    <footer className="footer">
      <span>
        © {new Date().getFullYear()} {site.name}
      </span>
      <span>Built with React</span>
    </footer>
  )
}
