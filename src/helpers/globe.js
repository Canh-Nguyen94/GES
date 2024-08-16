export function calcPosFromLatLngRad(lat, lng, multiply) {
  var phi = (90 - lat) * (Math.PI / 180)
  var theta = (lng + 180) * (Math.PI / 180)

  let x = -multiply * (Math.sin(phi) * Math.cos(theta))
  let z = multiply * Math.sin(phi) * Math.sin(theta)
  let y = multiply * Math.cos(phi)

  return { x, y, z }
}

export async function loadFile(url) {
  const req = await fetch(url)
  return req.text()
}

export function parseData(text) {
  const data = []
  const settings = { data }
  let max
  let min
  // split into lines
  text.split('\n').forEach((line) => {
    // split the line by whitespace
    const parts = line.trim().split(/\s+/)
    if (parts.length === 2) {
      // only 2 parts, must be a key/value pair
      settings[parts[0]] = parseFloat(parts[1])
    } else if (parts.length > 2) {
      // more than 2 parts, must be data
      const values = parts.map((v) => {
        const value = parseFloat(v)
        if (value === settings.NODATA_value) {
          return undefined
        }

        max = Math.max(max === undefined ? value : max, value)
        min = Math.min(min === undefined ? value : min, value)
        return value
      })
      data.push(values)
    }
  })
  return Object.assign(settings, { min, max })
}

export const places = [
  { lat: 16.06778, lng: 108.22083 }, // Da Nang, Vietnam
  { lat: 40.71278, lng: -74.006 }, // New York City, USA
  { lat: 48.8566, lng: 2.3522 }, // Paris, France
  { lat: 35.6895, lng: 139.6917 }, // Tokyo, Japan
  { lat: -33.8688, lng: 151.2093 }, // Sydney, Australia
  { lat: 51.5074, lng: -0.1278 }, // London, UK
  { lat: 34.0522, lng: -118.2437 }, // Los Angeles, USA
  { lat: 55.7558, lng: 37.6173 }, // Moscow, Russia
  { lat: 19.4326, lng: -99.1332 }, // Mexico City, Mexico
  { lat: 28.6139, lng: 77.209 }, // New Delhi, India
  { lat: -22.9068, lng: -43.1729 }, // Rio de Janeiro, Brazil
  { lat: -34.6037, lng: -58.3816 }, // Buenos Aires, Argentina
  { lat: -12.0464, lng: -77.0428 }, // Lima, Peru
  { lat: -23.5505, lng: -46.6333 }, // São Paulo, Brazil
  { lat: -1.2921, lng: 36.8219 }, // Nairobi, Kenya
  { lat: 6.5244, lng: 3.3792 }, // Lagos, Nigeria
  { lat: -26.2041, lng: 28.0473 }, // Johannesburg, South Africa
  { lat: -33.9249, lng: 18.4241 }, // Cape Town, South Africa
  { lat: -4.4419, lng: 15.2663 } // Kinshasa, Democratic Republic of the Congo
]
