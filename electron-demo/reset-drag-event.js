function resetDragEvent(doc) {
  doc.addEventListener('dragstart', (e) => {
    e.preventDefault()
  })
  doc.addEventListener('dragover', e => {
    e.preventDefault()
  })
  doc.addEventListener('dragleave', e => {
    e.preventDefault()
  })
  doc.addEventListener('drop', e => {
    e.preventDefault()
  })
}
module.exports = resetDragEvent
