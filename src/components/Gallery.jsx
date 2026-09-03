import { useEffect, useMemo, useRef, useState } from 'react'

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

function targetRowHeight(width) {
  if (width < 480) return 190
  if (width < 768) return 230
  if (width < 1200) return 280
  return 320
}

function rowGap(width) {
  return Math.min(20, Math.max(10, width * 0.016))
}

// Groups photos into rows and scales each row so it fills the full
// container width exactly — a "justified" layout, like Flickr/Google
// Photos, so mixed portrait/landscape shots read as one continuous wall
// instead of ragged independent columns.
function buildJustifiedRows(items, containerWidth, targetHeight, gap) {
  const rows = []
  let row = []
  let aspectSum = 0

  items.forEach((item) => {
    row.push(item)
    aspectSum += item.aspect
    const widthAtTarget = aspectSum * targetHeight + gap * (row.length - 1)
    if (widthAtTarget >= containerWidth) {
      const availableWidth = containerWidth - gap * (row.length - 1)
      const height = availableWidth / aspectSum
      rows.push({ height, items: row.map((it) => ({ ...it, width: it.aspect * height })) })
      row = []
      aspectSum = 0
    }
  })

  if (row.length) {
    const widthAtTarget = aspectSum * targetHeight + gap * (row.length - 1)
    // Leave a sparse trailing row at its natural size rather than
    // stretching a couple of photos to fill the whole width.
    const fillsRow = widthAtTarget >= containerWidth * 0.9
    const height = fillsRow ? (containerWidth - gap * (row.length - 1)) / aspectSum : targetHeight
    rows.push({ height, items: row.map((it) => ({ ...it, width: it.aspect * height })) })
  }

  return rows
}

export default function Gallery() {
  const [activeIndex, setActiveIndex] = useState(null)
  const [dims, setDims] = useState({})
  const [containerWidth, setContainerWidth] = useState(0)
  const containerRef = useRef(null)
  const isOpen = activeIndex !== null

  // Load each photo's natural dimensions once, so rows can be built from
  // real aspect ratios rather than a forced box.
  useEffect(() => {
    let cancelled = false
    photos.forEach((photo) => {
      const img = new Image()
      img.onload = () => {
        if (cancelled) return
        setDims((prev) =>
          prev[photo.src] ? prev : { ...prev, [photo.src]: { w: img.naturalWidth, h: img.naturalHeight } },
        )
      }
      img.src = photo.src
    })
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const observer = new ResizeObserver((entries) => {
      const width = entries[0]?.contentRect.width
      if (width) setContainerWidth(width)
    })
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const gap = containerWidth ? rowGap(containerWidth) : 12

  const rows = useMemo(() => {
    if (!containerWidth) return null
    const items = photos.map((photo, index) => {
      const d = dims[photo.src]
      return d ? { ...photo, index, aspect: d.w / d.h } : null
    })
    if (items.some((item) => item === null)) return null
    return buildJustifiedRows(items, containerWidth, targetRowHeight(containerWidth), gap)
  }, [dims, containerWidth, gap])

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
          <div className="gallery-grid" ref={containerRef} style={{ rowGap: gap }}>
            {rows &&
              rows.map((row, ri) => (
                <div className="gallery-row" key={ri} style={{ height: row.height, gap }}>
                  {row.items.map((item) => (
                    <button
                      key={item.src}
                      className="gallery-item"
                      style={{ width: item.width, height: row.height }}
                      onClick={() => setActiveIndex(item.index)}
                      aria-label={`Open photo: ${item.alt}`}
                    >
                      <img
                        src={item.src}
                        alt={item.alt}
                        loading="lazy"
                        draggable={false}
                        onContextMenu={(e) => e.preventDefault()}
                      />
                    </button>
                  ))}
                </div>
              ))}
          </div>
        )}
      </div>

      {isOpen && (
        <div className="lightbox" onClick={() => setActiveIndex(null)}>
          <img
            src={photos[activeIndex].src}
            alt={photos[activeIndex].alt}
            draggable={false}
            onClick={(e) => e.stopPropagation()}
            onContextMenu={(e) => e.preventDefault()}
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
