import { useEffect, useState } from 'react'

// Automatically picks up every image dropped into src/photos — no code
// changes needed when you add or remove files.
const modules = import.meta.glob('/src/photos/*.{jpg,jpeg,png,webp,JPG,JPEG,PNG,WEBP}', {
  eager: true,
  import: 'default',
})

const photos = Object.entries(modules)
  .sort(([a], [b]) => a.localeCompare(b, undefined, { numeric: true }))
  .map(([path, src]) => ({
    src,
    alt: path.split('/').pop().replace(/\.[^.]+$/, '').replace(/[-_]/g, ' '),
  }))

export default function Gallery() {
  const [activeIndex, setActiveIndex] = useState(null)
  const isOpen = activeIndex !== null

  useEffect(() => {
    if (!isOpen) return

    function onKeyDown(e) {
      if (e.key === 'Escape') setActiveIndex(null)
      if (e.key === 'ArrowRight') setActiveIndex((i) => (i + 1) % photos.length)
      if (e.key === 'ArrowLeft') setActiveIndex((i) => (i - 1 + photos.length) % photos.length)
    }

    document.addEventListener('keydown', onKeyDown)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = ''
    }
  }, [isOpen])

  return (
    <section id="work">
      <div className="wrap">
        <div className="section-head">
          <h2>Selected Work</h2>
          {photos.length > 0 && (
            <span className="count">
              {photos.length} photo{photos.length === 1 ? '' : 's'}
            </span>
          )}
        </div>

        {photos.length === 0 ? (
          <div className="gallery-empty">
            No photos yet. Drop your image files into <code>src/photos</code> and they'll
            show up here automatically.
          </div>
        ) : (
          <div className="gallery-grid">
            {photos.map((photo, i) => (
              <button
                key={photo.src}
                className="gallery-item"
                onClick={() => setActiveIndex(i)}
                aria-label={`Open photo: ${photo.alt}`}
              >
                <img src={photo.src} alt={photo.alt} loading="lazy" />
              </button>
            ))}
          </div>
        )}
      </div>

      {isOpen && (
        <div className="lightbox" onClick={() => setActiveIndex(null)}>
          <img
            src={photos[activeIndex].src}
            alt={photos[activeIndex].alt}
            onClick={(e) => e.stopPropagation()}
          />
          <button
            className="lightbox-close"
            onClick={() => setActiveIndex(null)}
            aria-label="Close"
          >
            ✕
          </button>
          {photos.length > 1 && (
            <>
              <button
                className="lightbox-prev"
                onClick={(e) => {
                  e.stopPropagation()
                  setActiveIndex((activeIndex - 1 + photos.length) % photos.length)
                }}
                aria-label="Previous photo"
              >
                ‹
              </button>
              <button
                className="lightbox-next"
                onClick={(e) => {
                  e.stopPropagation()
                  setActiveIndex((activeIndex + 1) % photos.length)
                }}
                aria-label="Next photo"
              >
                ›
              </button>
              <div className="lightbox-counter">
                {activeIndex + 1} / {photos.length}
              </div>
            </>
          )}
        </div>
      )}
    </section>
  )
}
