//= require turbolinks
//= require jquery

//= require hashicorp/sidebar
//= require hashicorp/analytics

//= require analytics

//= require hashi-stack-menu/main
//= require terraform-overview/vendor-scripts/object-fit-images.min.js
// DON'T require terraform-overview/home-hero, because the compressor is old.
//= require terraform-overview/hashi-tabbed-content


// When doing a turbolinks visit, handle all the layout changes BEFORE we allow
// turbolinks to consider itself finished. It calls Element.scrollIntoView() to
// handle anchor links, and the browser handles that scrolling async without any
// way to spy on it; if we're modifying the height of the page WHILE the browser
// is trying to scroll somewhere specific, we clip through the floor and launch
// ourselves out into the skybox. Anyway, by doing this on the new body element
// before turbolinks tries to shim it into place, we're finished long before it
// decides where it's scrolling.
document.addEventListener("turbolinks:before-render", function(e) {
    setUpUIFeatures(e.data.newBody);
});

// Except, the first time we load a page, it's not considered a turbolinks
// visit! So we need to have a special case handler for initial page load.
document.addEventListener("DOMContentLoaded", function(_e) {
    setUpUIFeatures(document.body);
});

// Modify the page layout, and set up terraform.io UI features
function setUpUIFeatures(bodyElement) {
    "use strict";

    // SIDEBAR STUFF:
    // - "subNavs" are <li> elements with a nested <ul> as a direct child.
    // - The <a> child is the "header" of the subnav, and the <ul> is its "content."
    // - Subnavs are collapsed (<ul> hidden) or expanded (<ul> visible).
    // - Collapse/expand is managed by the "active" class on the <li>.

    // Move the header (if any) into the grid container so we can make things line up nicely.
    var sidebarHeaderGrid = $("#sidebar-header-grid", bodyElement);
    var sidebarHeader = $("#docs-sidebar", bodyElement).find("h1,h2,h3,h4,h5,h6").not("#otherdocs").first();
    sidebarHeaderGrid.append(sidebarHeader);

    // Collapse most subnavs, but reveal any that contain the
    // current page. The a.current-page class is added during build by
    // layouts/inner.erb.
    var docsSidebar = $("#docs-sidebar ul.nav.docs-sidenav", bodyElement);
    var subNavs = docsSidebar.find("ul").addClass("nav-hidden").parent("li");
        // we leave the nav-hidden class alone after this.
    function resetActiveSubnavs() {
        subNavs.removeClass("active");
        // Activate current page, locked-open navs, and all their ancestors:
        docsSidebar.find("li").has(".current-page, .nav-visible").addClass("active");
        // Activate auto-expand navs, but leave their ancestors alone:
        docsSidebar.find(".nav-auto-expand").parent("li").addClass("active");
        // Colored links for current page and its ancestors
        docsSidebar.find("li").has(".current-page").addClass("current");
    }
    resetActiveSubnavs();

    // CSS class that adds toggle controls:
    subNavs.addClass("has-subnav");
    // Toggle subnav expansion when clicking an area that isn't claimed by the
    // header or content (usually the :before pseudo-element)
    subNavs.on("click", function(e) {
        if (e.target == this) {
            $(this).toggleClass("active");
        }
    });
    // If the subnav header doesn't link to a different page, use it as a toggle.
    docsSidebar.find("a[href^='#']").on("click", function(e) {
        e.preventDefault();
        $(this).parent("li").trigger("click");
    });

    // If this is a Very Large Sidebar, add extra controls to expand/collapse
    // and filter it.
    var sidebarLinks = docsSidebar.find("a");
    if (sidebarLinks.length > 30) {
        if ($("#sidebar-controls", bodyElement).length === 0) { // then add it!
            var sidebarControlsHTML =
                '<div id="sidebar-controls">' +
                    '<div id="sidebar-filter">' +
                        '<span class="glyphicon glyphicon-search"></span>' +
                        '<label for="sidebar-filter-field" class="sr-only sr-only-focusable">Filter page titles in sidebar navigation</label>' +
                        '<input type="search" id="sidebar-filter-field" class="form-control" name="sidebar-filter-field" role="search" placeholder="Filter page titles" />' +
                        '<button id="filter-close" class="glyphicon glyphicon-remove-circle" title="Reset filter"><span class="sr-only sr-only-focusable">Reset sidebar filter</span></button>' +
                    '</div>' +
                    '<div id="sidebar-buttons">' +
                        '<button id="toggle-button">Expand all</button>' +
                        ' | ' +
                        '<button id="filter-button" title="Shortcut: type the / key">Filter</button>' +
                    '</div>' +
                '</div>';
            sidebarHeaderGrid.append(sidebarControlsHTML);
        }

        var filterDiv = $("div#sidebar-filter", bodyElement);
        var buttonsDiv = $("div#sidebar-buttons", bodyElement);
        var subnavToggle = $("#sidebar-controls #toggle-button", bodyElement);
        var filterField = $("#sidebar-controls input#sidebar-filter-field", bodyElement);
        var filterButton = $("#filter-button", bodyElement);

        filterDiv.hide();

        filterButton.on("click", function(e) {
            buttonsDiv.hide();
            filterDiv.show();
            filterField.focus();
        });

        // Filter field's close button: defer to reset button.
        $("#filter-close", bodyElement).on("click", function(e) {
            subnavToggle.trigger("reset");
        });

        // Expand/reset button behavior:
        subnavToggle.on({
            "taint": function(e) {
                $(this).html("Reset");
            },
            "reset": function(e) {
                filterField.val("");
                filterField.trigger("blur");
                sidebarLinks.parent("li").show();
                resetActiveSubnavs();
                $(this).html("Expand all");
                buttonsDiv.show();
                filterDiv.hide();
            },
            "click": function(e) {
                e.preventDefault();
                if ($(this).text() === "Expand all") {
                    subNavs.addClass("active");
                    $(this).trigger("taint");
                } else {
                    $(this).trigger("reset");
                }
            }
        });

        // Filter as you type. This alters three things:
        // - "active" class on subnavs
        // - direct show/hide of <li>s
        // - state of subnavToggle button
        // We rely on subnavToggle's "reset" event to clean up when done.
        filterField.on('keyup', function(e) {
            if (e.keyCode === 27) { // escape key
                subnavToggle.trigger("reset");
            } else {
                subnavToggle.trigger("taint");
                var filterRegexp = new RegExp(filterField.val(), 'i');
                var matchingLinks = sidebarLinks.filter(function(index) {
                    return $(this).text().match(filterRegexp);
                });
                sidebarLinks.parent('li').hide();
                subNavs.removeClass('active'); // cleans up partial as-you-type searches
                // make matches and their parents visible and expanded:
                matchingLinks.parents('li').show().filter(subNavs).addClass('active');
                // make direct children visible (if your search caught a subnav directly):
                matchingLinks.parent('li').find('li').show();
            }
        });
        // Type slash to focus sidebar filter:
        $(bodyElement).keydown(function(e) {
            // 191 = / (forward slash) key
            if (e.keyCode !== 191) {
                return;
            }
            var focusedElementType = $(document.activeElement).get(0).tagName.toLowerCase();
            if (focusedElementType !== "textarea" && focusedElementType !== "input") {
                e.preventDefault();
                filterButton.trigger("click");
            }
        });
    }


    // Move the main title into the grid container, so we can make things line up nicely.
    var innerHeaderGrid = $('#inner-header-grid', bodyElement);
    innerHeaderGrid.append( $("#inner h1", bodyElement).first() );

    // On docs/content pages, add a hierarchical quick nav menu if there are
    // more than two H2/H3/H4 headers.
    var headers = $('#inner', bodyElement).find('h2, h3, h4');
    if (headers.length > 2 && $("div#inner-quicknav", bodyElement).length === 0) {
        // Build the quick-nav HTML:
        innerHeaderGrid.append(
            '<div id="inner-quicknav">' +
                '<span id="inner-quicknav-trigger">' +
                    'Jump to Section' +
                    '<svg width="9" height="5" xmlns="http://www.w3.org/2000/svg"><path d="M8.811 1.067a.612.612 0 0 0 0-.884.655.655 0 0 0-.908 0L4.5 3.491 1.097.183a.655.655 0 0 0-.909 0 .615.615 0 0 0 0 .884l3.857 3.75a.655.655 0 0 0 .91 0l3.856-3.75z" fill-rule="evenodd"/></svg>' +
                '</span>' +
                '<ul class="dropdown"></ul>' +
            '</div>'
        );
        var quickNav = $('#inner-quicknav > ul.dropdown', bodyElement);
        headers.each(function(index, element) {
            var level = element.nodeName.toLowerCase();
            var header_text = $(element).text();
            var header_id = $(element).attr('id');
            quickNav.append('<li class="level-' + level + '"><a href="#' + header_id + '">' + header_text + '</a></li>');
        });
        // Attach event listeners:
        // Trigger opens and closes.
        $(bodyElement).on('click', function(e) {
            var $target = $(e.target);
            if ($target.is('#inner-quicknav #inner-quicknav-trigger')) {
                // clicking trigger toggles quick-nav.
                quickNav.toggleClass('active');
            } else if ($target.is('#inner-quicknav > ul.dropdown li a')) {
                // Jumping to a section means you're done with quick-nav.
                quickNav.removeClass('active');
            } else if ($target.closest(quickNav).length > 0) {
                // Do nothing, clicking inside quick-nav doesn't close it.
            } else {
                // Clicking outside quick-nav closes it.
                quickNav.removeClass('active');
            }
        });
    }

    // Downloads CTA
    var $downloadLinks = $("section.downloads .details a", bodyElement);
    var $learnCtas = $("section.downloads .learn-cta", bodyElement);
    $downloadLinks.on("click", function () {
        var $learnCta = $(this).parents(".download").find(".learn-cta");

        // Terminate early if user is downloading same OS different arch
        if ($learnCta.hasClass("show")) return;

        // When downloading first first time or for an additional OS
        $learnCtas.each(function () {
        $(this).removeClass("show");
        });

        $learnCta.addClass("show");
    });

}
