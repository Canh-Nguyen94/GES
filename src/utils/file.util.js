import { blankFetch } from '@helpers/fetch.helper'

export const downloadXLSX = (data, name) => {
  const blob = new Blob([data], {
    type: 'data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8,'
  })
  const blobURL = window.URL.createObjectURL(blob)

  // Create new tag for download file
  const anchor = document.createElement('a')
  anchor.download = name
  anchor.href = blobURL
  anchor.dataset.downloadurl = [
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    anchor.download,
    anchor.href
  ].join(':')
  anchor.click()

  // Remove URL.createObjectURL. The browser should not save the reference to the file.
  setTimeout(() => {
    // For Firefox it is necessary to delay revoking the ObjectURL
    URL.revokeObjectURL(blobURL)
  }, 100)
}

// Download file of the current url
export const downloadFile = (blobObject, fileName, onError) => {
  try {
    const blob = window.URL.createObjectURL(blobObject)
    const anchor = document.createElement('a')

    anchor.style.display = 'none'
    anchor.href = blob
    anchor.download = fileName
    document.body.appendChild(anchor)

    anchor.click()

    window.URL.revokeObjectURL(blob)
  } catch (error) {
    onError?.(error)
  }
}

export const entryForFiles = (files, limit) => {
  let totalSize = 0

  for (let i = 0; i < files.length; i++) {
    totalSize += files[i].size
  }

  // Convert total size from bytes to megabytes
  const totalSizeInMB = totalSize / (1024 * 1024)
  if (totalSizeInMB <= limit) {
    return true
  }

  return false
}

export async function getThumbnailForVideo(videoUrl) {
  const video = document.createElement('video')
  const canvas = document.createElement('canvas')
  video.style.display = 'none'
  canvas.style.display = 'none'

  await new Promise((resolve) => {
    video.addEventListener('loadedmetadata', () => {
      video.width = video.videoWidth
      video.height = video.videoHeight
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      video.currentTime = video.duration * 0.25
    })
    video.addEventListener('seeked', () => resolve())
    video.src = videoUrl
  })

  canvas.getContext('2d').drawImage(video, 0, 0, video.videoWidth, video.videoHeight)
  const fileUrl = canvas.toDataURL('image/png')
  return fileUrl
}

export function dataURLtoFile(dataurl, filename) {
  var arr = dataurl.split(','),
    mime = arr[0].match(/:(.*?);/)[1],
    bstr = atob(arr[arr.length - 1]),
    n = bstr.length,
    u8arr = new Uint8Array(n)
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n)
  }
  return new File([u8arr], filename, { type: mime })
}

export const getFileInfoFromExternalLink = async (externalLink) => {
  const response = await blankFetch(externalLink)
  const type = response.headers.get('content-type')
  const size = response.headers.get('content-length')

  return {
    type,
    size
  }
}

export function removeExtension(filename) {
  if (filename) return filename.replace(/\.[^/.]+$/, '')

  return ''
}

export const downloadFileFromURL = async (fileUrl, name) => {
  const response = await blankFetch(fileUrl)
  const blob = await response.blob()
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = name
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  setTimeout(() => {
    URL.revokeObjectURL(url)
  }, 100)
}

export const urlToBase64 = async (url) => {
  const response = await blankFetch(url)
  const blob = await response.blob()
  const reader = new FileReader()
  const base64 = await new Promise((resolve, reject) => {
    reader.onloadend = () => resolve(reader.result)
    reader.onerror = reject
    reader.readAsDataURL(blob)
  })

  return base64.split(',')[1]
}

export const base64FileToUrl = (file) => (file ? `data:image/svg+xml;base64,${file}` : '')
