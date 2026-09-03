import { site } from '../config'

export default function Footer() {
  return (
    <footer className="footer">
      <span>
        © {new Date().getFullYear()} {site.name}. All rights reserved. Images may not be
        reproduced, downloaded, or used without written permission.
      </span>
    </footer>
  )
}
