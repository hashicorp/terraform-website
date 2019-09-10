document.addEventListener('turbolinks:load', function() {
  var tabsLocation = document.getElementById('how-terraform-works-tabs') // This is explicitly looking for the first element <ul> & its children are tab <li>'s

  if (tabsLocation) {
    var tabList = tabsLocation.firstElementChild.children

    function selectNextTab(list, nextTab) {
      var currentTab = list.find(function(el) {
        return el.classList.contains('active')
      })

      // Switch to the Next Active Tab Panel
      var currentTabPanel = document.querySelector(
        '[aria-labelledby="'.concat(currentTab.id, '"]')
      )
      var nextTabPanel = document.querySelector(
        '[aria-labelledby="'.concat(nextTab.id, '"]')
      )
      currentTab.classList.remove('active')
      currentTabPanel.classList.replace('active', 'deactivate')
      // allow for animation
      setTimeout(function() {
        currentTabPanel.classList.remove('deactivate')
        nextTabPanel.classList.add('active')
      }, 800)

      // set aria attr's
      currentTabPanel.setAttribute('aria-hidden', 'false')
      currentTab.setAttribute('aria-selected', 'false')
      nextTabPanel.setAttribute('aria-hidden', 'false')
      nextTab.setAttribute('aria-selected', 'true')
      return nextTab.classList.add('active')
    }

    // Load the states based on the markup & add the eventListeners to all Tabs
    function assignTabInitialStates(list) {
      var tabsArr = Array.from(list)

      var _loop = function _loop(i) {
        tabsArr[i].addEventListener('click', function(e) {
          e.preventDefault()
          return selectNextTab(tabsArr, tabsArr[i])
        })
      }

      for (var i = 0; i < tabsArr.length; i++) {
        _loop(i)
      }
    }

    assignTabInitialStates(tabList)
  }
})
