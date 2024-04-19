
import tagVer from './../../version'
import { GlobalEventEmitter } from '@/utils/common/eventEmitter'
console.log(`Current tag version number:${tagVer}`);
/**
 * @description: 功能性函数：格式化REM
 * @param {}
 * @return:void
 */
function setFontSize() {
  const doc = window.document
  const $html = doc.getElementsByTagName('html')[0]
  const windowWidth =
    doc.documentElement.clientWidth || doc.body.clientWidth || window.innerWidth
  let x = windowWidth / 3.75
  window.fsize = x >= 120 ? 120 : x
  $html.style.fontSize = `${window.fsize}px`
}

window.onload = () => {
  setFontSize()
}
window.onresize = () => {
  setFontSize()
  if (document.activeElement.tagName === 'INPUT') {
    document.activeElement.scrollIntoView({ behavior: 'smooth' })
  }
}

window.GlobalEventEmitter = GlobalEventEmitter
setFontSize()
