document.addEventListener('turbolinks:load', function () {
  var qs = document.querySelector.bind(document)
  var banner = qs('.g-alert-banner')
  var closeButton = qs('.g-alert-banner .close')
  // if cookie is set, don't show the component
  if (getCookie('banner_terraform_io') === '1') {
    banner.classList.remove('show')
    return
  }

  closeButton.addEventListener(
    'click',
    function () {
      onClose(banner)
    },
    { once: true }
  )
})

function onClose(banner) {
  // animate closed by setting height so
  // it's not 'auto' and then set to zero
  banner.style.height = banner.scrollHeight + 'px'
  window.setTimeout(function() {
    banner.style.height = '0'
  }, 1)

  // set the cookie so this banner doesn't show up anymore
  document.cookie = 'banner_terraform_io=1'
}

// Modified from js-cookie
function getCookie(key) {
  if (!document.cookie) return

  var allcookies = document.cookie
  var jar = {}

  // Get all the cookies pairs in an array
  cookiearray = allcookies.split('; ')
  // Now take key value pair out of this array
  for (var i = 0; i < cookiearray.length; i++) {
    name = cookiearray[i].split('=')[0]
    value = cookiearray[i].split('=')[1]
    jar[name] = value
  }

  return key ? jar[key] : jar
}
