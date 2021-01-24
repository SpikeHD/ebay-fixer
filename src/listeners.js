/**
 * Allows you to click the outside of the tracking window to close it.
 */
document.addEventListener('click', (evt) => {
  // Use vanilla listener, since the element won't exist yer
  if (evt.target.classList.contains('oly-m')) {
    document.getElementsByClassName('oly-c')[0].click()
  }
})
