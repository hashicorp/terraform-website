document.addEventListener("turbolinks:load", function () {
  var hashiStackMenuRoot = document.querySelector(".hashiStackMenuRoot");

  function getActiveButton() {
    return document.querySelector(
      ".hashiStackMenuRoot li > button.buttonActive"
    );
  }

  function getActiveBrowsePanel() {
    return document.querySelector(".hashiStackMenuRoot li > section.isOpen");
  }

  function handleClickOutsideElement(e) {
    var activeButton = getActiveButton();
    var activePanel = getActiveBrowsePanel();
    if (!activeButton || !activePanel) return;
    if (activePanel.contains(e.target) || activeButton.contains(e.target))
      return;
    activePanel.classList.remove("isOpen");
    activeButton.classList.remove("buttonActive");
  }

  function addClickOutsideListener() {
    window.addEventListener("click", handleClickOutsideElement);
  }

  function selectNextNavButon(list, nextButton) {
    // Get the currently active button if available
    var currentActiveNavButton = list.find(function (el) {
      return el.classList.contains("buttonActive");
    });
    // Get the browse panel that corresponds to this button by index; buttonIdx => 0, browsePanelIdx => 1
    var correspondingBrowsePanel = nextButton.parentNode.children.item(1);
    // If none are active, set the corresponding panel to open & button to active
    if (!currentActiveNavButton) {
      correspondingBrowsePanel.classList.add("isOpen");
      return nextButton.classList.add("buttonActive");
    }
    // If no others exist, next is actually current, too
    // We close the panel and deactivate the button
    if (currentActiveNavButton === nextButton) {
      correspondingBrowsePanel.classList.remove("isOpen");
      return currentActiveNavButton.classList.remove("buttonActive");
    }
    // The last possible scenario is to deactivate one item and activate another
    // Get the active BrowsePanel
    var currentActiveBrowsePanel = currentActiveNavButton.parentNode.children.item(
      1
    );
    // Make the changes necessary
    currentActiveBrowsePanel.classList.remove("isOpen");
    correspondingBrowsePanel.classList.add("isOpen");
    currentActiveNavButton.classList.remove("buttonActive");
    nextButton.classList.add("buttonActive");
  }

  // Add eventListeners to the NavButtons that exist
  function bindNavButtons(list) {
    var navButtonArr = Array.from(list);

    var _loop = function _loop(i) {
      navButtonArr[i].addEventListener("click", function (e) {
        e.preventDefault();
        return selectNextNavButon(navButtonArr, navButtonArr[i]);
      });
    };

    for (var i = 0; i < navButtonArr.length; i++) {
      _loop(i);
    }
  }

  if (hashiStackMenuRoot) {
    addClickOutsideListener();

    var buttonList = document.querySelectorAll(
      ".hashiStackMenuRoot li > button.buttonReset.link"
    );

    bindNavButtons(buttonList);
  }

});
