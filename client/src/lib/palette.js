// پالت رنگیِ هر محصول — برای رندر بطری SVG
// هر پالت: [پس‌زمینه‌ی روشن، رنگ شیشه، رنگ مایع، رنگ سرپوش، رنگ جزئیات]

export const BOTTLE_PALETTES = [
  ['#F6F1E6', '#d9d2bd', '#b58a4a', '#1d1a12', '#C8A24B'], // خنثی / طلایی
  ['#F2E9D8', '#e8e0cd', '#c14f42', '#17140e', '#8a352c'], // قرمز رز
  ['#EFE7DA', '#ddd3bd', '#8d7f5c', '#14120c', '#5f5640'], // کهربایی
  ['#E9E4D6', '#d8cfb8', '#7e9974', '#12100a', '#4c6446'], // سبز
  ['#F3ECE0', '#e5dcc7', '#c9a45c', '#1b1812', '#9a7a3c'], // عسل
  ['#E7E2D6', '#d6cdb8', '#9a5d8e', '#15120d', '#6d3f64'], // بنفش
  ['#F0EAE0', '#e2d9c6', '#b3803c', '#191510', '#8a5e2b'], // عنبر
  ['#F5F0E4', '#eae2cf', '#cbab6e', '#201c14', '#a0874c'], // شامپاین
  ['#EDE6D8', '#ddd3bf', '#c9c2ae', '#14110b', '#8a8471'], // نقره‌ای
  ['#F1EBDF', '#e4dbc6', '#7f6a52', '#171410', '#554534'], // عود
  ['#E8E3D7', '#d9d0bc', '#b3473f', '#131009', '#8f322c'], // یاقوت
  ['#F4EEE3', '#e8dfca', '#c29a5a', '#1e1a12', '#96733c'], // طلای نرم
]

/** پالت پایدار بر اساس نام محصول — باثبات بین رندرها */
export function paletteFor(name = '') {
  let hash = 0
  for (let i = 0; i < name.length; i++) hash = (hash * 31 + name.charCodeAt(i)) | 0
  return BOTTLE_PALETTES[Math.abs(hash) % BOTTLE_PALETTES.length]
}
