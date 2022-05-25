import { useEffect } from 'react'

const StickyHeader = ({ wrappedContent }) => {

  useEffect(() => {
    const body = document.body
    const scrollUp = "scroll-up"
    const scrollDown = "scroll-down"
    let lastScroll = 0

    window.addEventListener("scroll", () => {
      const currentScroll = window.pageYOffset
      if (currentScroll <= 0) {
        body.classList.remove(scrollUp)
        return
      }

      if (currentScroll > lastScroll && !body.classList.contains(scrollDown)) {
        // down
        body.classList.remove(scrollUp)
        body.classList.add(scrollDown)
      } else if (
        currentScroll < lastScroll &&
        body.classList.contains(scrollDown)
      ) {
        // up
        body.classList.remove(scrollDown)
        body.classList.add(scrollUp)
      }
      lastScroll = currentScroll
    })
  }, [])

  return (
    <div className="sticky-header pb-3 z-10">
      {wrappedContent}
    </div>
  )
}

export default StickyHeader
