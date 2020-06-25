//= require js-cookie

document.addEventListener('turbolinks:load', function () {
  var qs = document.querySelector.bind(document)
  var banner = qs('.g-alert-banner')
  var closeButton = qs('.g-alert-banner .close')

  // if cookie is set, don't show the component
  if (cookie.get(`banner_terraform_io`)) {
    closeButton.classList.remove('show')
    return
  }

  closeButton.addEventListener(
    'click',
    () => {
      onClose(banner)
    },
    { once: true }
  )
})

function onClose(banner) {
  // animate closed by setting height so
  // it's not 'auto' and then set to zero
  banner.style.height = `${banner.scrollHeight}px`
  window.setTimeout(() => {
    banner.style.height = '0'
  }, 1)

  // set the cookie so this banner doesn't show up anymore
  const name = `banner_terraform_io`
  cookie.set(name, 1)

  // trackEvent('close')
}

function trackEvent(type) {
  if (window.analytics) {
    const { tag, theme, text, linkText } = { ...this.props }

    window.analytics.track(type.charAt(0).toUpperCase() + type.slice(1), {
      category: 'Alert Banner',
      label: `${text} - ${linkText} | ${type}`,
      tag: tag,
      theme: theme,
    })
  }
}
