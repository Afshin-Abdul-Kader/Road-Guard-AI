import { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

const COLOR = {
  CRITICAL: '#b3261e',
  HIGH: '#d4560f',
  MEDIUM: '#a37d00',
  LOW: '#2f7d4f',
}

const esc = (s) => String(s ?? '').replace(/[<>&]/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;' }[c]))

/** OpenStreetMap view of open issues. Marker colour = severity. */
export default function IssueMap({ issues = [], onSelect }) {
  const el = useRef(null)
  const map = useRef(null)
  const layer = useRef(null)

  useEffect(() => {
    if (map.current || !el.current) return
    map.current = L.map(el.current, { scrollWheelZoom: false }).setView([13.036, 80.175], 13)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(map.current)
    layer.current = L.layerGroup().addTo(map.current)
    return () => {
      map.current?.remove()
      map.current = null
    }
  }, [])

  useEffect(() => {
    if (!layer.current) return
    layer.current.clearLayers()

    const points = issues.filter((i) => i.lat && i.lng)
    points.forEach((issue) => {
      const icon = L.divIcon({
        className: '',
        html: `<div class="mapmark" style="background:${COLOR[issue.severity] || '#5d6f75'}"></div>`,
        iconSize: [18, 18],
        iconAnchor: [9, 9],
      })
      const marker = L.marker([issue.lat, issue.lng], { icon }).addTo(layer.current)
      marker.bindPopup(
        `<strong>${esc(issue.issue_type)}</strong><br>${esc(issue.location)}, ${esc(issue.area)}<br>` +
          `Priority ${esc(issue.priority_score)} &middot; ${esc(String(issue.status).replace('_', ' '))}`,
      )
      if (onSelect) marker.on('dblclick', () => onSelect(issue))
    })

    if (points.length && map.current) {
      map.current.fitBounds(
        L.latLngBounds(points.map((p) => [p.lat, p.lng])).pad(0.25),
        { maxZoom: 14 },
      )
    }
  }, [issues, onSelect])

  return (
    <>
      <div className="map" ref={el} />
      <div className="map-legend">
        <span><i style={{ background: COLOR.CRITICAL }} /> Critical</span>
        <span><i style={{ background: COLOR.HIGH }} /> High</span>
        <span><i style={{ background: COLOR.MEDIUM }} /> Medium</span>
        <span><i style={{ background: COLOR.LOW }} /> Low</span>
      </div>
    </>
  )
}
