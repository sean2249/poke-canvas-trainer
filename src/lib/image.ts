const MAX_EDGE = 1024
const JPEG_QUALITY = 0.85

/**
 * 把使用者拍的照片等比縮放到長邊 ≤ 1024px，輸出 JPEG dataURL。
 * 目的：降低上傳體積與 API token 成本、加快回應速度。
 */
export async function compressImage(file: File): Promise<string> {
  const bitmap = await loadBitmap(file)
  const { width, height } = fitWithin(bitmap.width, bitmap.height, MAX_EDGE)

  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('無法建立繪圖環境（Canvas 2D context）')
  // 白底，避免 PNG 透明區轉 JPEG 變黑
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(0, 0, width, height)
  ctx.drawImage(bitmap, 0, 0, width, height)

  if ('close' in bitmap) (bitmap as ImageBitmap).close()
  return canvas.toDataURL('image/jpeg', JPEG_QUALITY)
}

function fitWithin(w: number, h: number, max: number) {
  if (w <= max && h <= max) return { width: w, height: h }
  const scale = max / Math.max(w, h)
  return { width: Math.round(w * scale), height: Math.round(h * scale) }
}

async function loadBitmap(file: File): Promise<ImageBitmap | HTMLImageElement> {
  if ('createImageBitmap' in window) {
    try {
      return await createImageBitmap(file)
    } catch {
      // fall through to <img> loader
    }
  }
  return await new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file)
    const img = new Image()
    img.onload = () => {
      URL.revokeObjectURL(url)
      resolve(img)
    }
    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('圖片讀取失敗'))
    }
    img.src = url
  })
}

/** 從 dataURL 取出純 base64（去掉 "data:image/jpeg;base64," 前綴）。 */
export function dataUrlToBase64(dataUrl: string): string {
  const comma = dataUrl.indexOf(',')
  return comma >= 0 ? dataUrl.slice(comma + 1) : dataUrl
}
