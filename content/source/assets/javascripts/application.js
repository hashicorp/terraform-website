//= require turbolinks
//= require jquery

//= require hashicorp/sidebar
//= require hashicorp/analytics

//= require analytics

//= require hashi-stack-menu/main
//= require terraform-overview/vendor-scripts/object-fit-images.min.js
// DON'T require terraform-overview/home-hero, because the compressor is old.
//= require terraform-overview/hashi-tabbed-content


// TURBOLINKS SETUP/WORKAROUNDS:
// Let the browser handle anchor links that go to the same page, instead of
// doing a full turbolinks visit.
document.addEventListener("turbolinks:click", function(e) {
    var here = document.location;
    var dest = new URL(e.data.url);
    if ( here.origin === dest.origin
      && here.pathname === dest.pathname
      && here.search === dest.search )
    {
        // cancel the turbolinks visit. Doesn't affect "real" click event.
        e.preventDefault();
    }
});

// Initial page load is not considered a turbolinks visit.
document.addEventListener("DOMContentLoaded", function(_e) {
    setUpPage(document.body);
});

// Setup can affect the height of the page, so on Turbolinks visits we do it
// BEFORE replacing the body and (maybe) calling Element.scrollIntoView().
document.addEventListener("turbolinks:before-render", function(e) {
    setUpPage(e.data.newBody);
});

// A few helpful constants:
var selQuickNav = '#inner-quicknav > ul.dropdown';
var selDocsSidenavs = '#docs-sidebar ul.nav.docs-sidenav';
var sidebarControlsHTML =
    '<div id="sidebar-controls">' +
        '<div id="sidebar-filter" style="display: none;">' +
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
var quickNavHTML =
    '<div id="inner-quicknav">' +
        '<span id="inner-quicknav-trigger">' +
            'Jump to Section' +
            '<svg width="9" height="5" xmlns="http://www.w3.org/2000/svg"><path d="M8.811 1.067a.612.612 0 0 0 0-.884.655.655 0 0 0-.908 0L4.5 3.491 1.097.183a.655.655 0 0 0-.909 0 .615.615 0 0 0 0 .884l3.857 3.75a.655.655 0 0 0 .91 0l3.856-3.75z" fill-rule="evenodd"/></svg>' +
        '</span>' +
        '<ul class="dropdown"></ul>' +
    '</div>';

// Modify the page layout, set up sidebar nav, set up quick-nav. This is
// idempotent, and might hit a page additional times on back/forward nav.
function setUpPage(bodyElement) {
    "use strict";

    // Do jQuery selections only within the provided body element
    var local$ = function(selector) {
        return $(selector, bodyElement);
    };

    // SIDEBAR STUFF:
    // - "subNavs" are <li> elements with a nested <ul> as a direct child.
    // - The <a> child is the "header" of the subnav, and the <ul> is its "content."
    // - Subnavs are collapsed (<ul> hidden) or expanded (<ul> visible).
    // - Collapse/expand is managed by the "active" class on the <li>.

    // Move sidebar header (if any) into the grid container so we can make things line up nicely.
    var sidebarHeaderGrid = local$("#sidebar-header-grid");
    var sidebarHeader = local$("#docs-sidebar").find("h1,h2,h3,h4,h5,h6").not("#otherdocs").first();
    sidebarHeaderGrid.append(sidebarHeader);

    var docsSideNavs = local$(selDocsSidenavs);

    // Calculate all the classes we'll need later:
    docsSideNavs.find("ul").addClass("nav-hidden");
        // (Doing this late so the navs aren't hidden from non-JS users.)
    // Colored links for current page and its ancestors. (a.current-page
    // is calculated during build by layouts/inner.erb.)
    docsSideNavs.find("li").has(".current-page").addClass("current");
    // The optional .nav-visible class locks open a section and all of its ancestors.
    docsSideNavs.find('li').has('.nav-visible').addClass('nav-visible');
    // Add toggle controls:
    docsSideNavs.find("li").has("ul").addClass("has-subnav");

    // Reveal appropriate sections for current page:
    // Activate current page, locked-open navs, and all their ancestors:
    docsSideNavs.find('.current, .nav-visible').addClass('active');
    // Activate auto-expand navs, but leave their ancestors alone:
    docsSideNavs.find('.nav-auto-expand').parent('li').addClass('active');
    // We're specifically NOT removing .active from anything that happens to be
    // open already, for better behavior on back/forward navs.

    // If this is a Very Large Sidebar, add extra controls to expand/collapse
    // and filter it.
    if (local$("#sidebar-controls").length === 0) {
        var sidebarLinks = docsSideNavs.find("a");
        if (sidebarLinks.length > 30) {
            sidebarHeaderGrid.append(sidebarControlsHTML);
        }
    }

    // MAIN BODY STUFF:
    // Move main title into the grid container, so we can make things line up nicely.
    var innerHeaderGrid = local$('#inner-header-grid');
    innerHeaderGrid.append( local$("#inner h1").first() );

    // On docs/content pages, add a hierarchical quick nav menu if there are
    // more than two H2/H3/H4 headers.
    if (local$("div#inner-quicknav").length === 0) {
        var headers = local$('#inner').find('h2, h3, h4');
        if (headers.length > 2) {
            // Build the quick-nav HTML:
            innerHeaderGrid.append(quickNavHTML);
            var quickNav = local$(selQuickNav);
            headers.each(function(index, element) {
                var a = document.createElement('a');
                a.setAttribute('href', '#' + element.id);
                a.textContent = element.innerText;

                var li = document.createElement('li');
                li.className = 'level-' + element.nodeName.toLowerCase();
                li.append(a);

                quickNav.append(li);
            });
        }
    }
}

// This doesn't have any state of its own, it's just a place to collect all the
// ways we can change the state of the whole nav sidebar at once.
var sidebarController = {
    reset: function() {
        $('#sidebar-filter-field').trigger("blur").val("");
        $(selDocsSidenavs).find("li").show();
        this.expandDefaults();
        $('#toggle-button').html("Expand all");
        $('#sidebar-buttons').show();
        $('#sidebar-filter').hide();
    },
    expandAll: function() {
        this.enableReset();
        $(selDocsSidenavs).find('li').addClass('active');
    },
    expandDefaults: function() {
        var docsSideNavs = $(selDocsSidenavs);
        // Reset everything to inactive. .has-subnav is added during setup.
        docsSideNavs.find('.has-subnav').removeClass("active");
        // Activate current page, locked-open navs, and all their ancestors. (These
        // classes propagate to ancestors during setup.)
        docsSideNavs.find('.current, .nav-visible').addClass('active');
        // Activate auto-expand navs, but leave their ancestors alone:
        docsSideNavs.find('.nav-auto-expand').parent('li').addClass('active');
    },
    enableReset: function() {
        $('#toggle-button').html("Reset");
    },
    showFilter: function() {
        this.enableReset();
        $('#sidebar-buttons').hide();
        $('#sidebar-filter').show();
        $('#sidebar-filter-field').focus();
    },
    // Filter as you type. This alters three things:
    // - "active" class on subnavs
    // - direct show/hide of <li>s
    // - state of #toggle-button
    performFilter: function() {
        var filterRegexp = new RegExp($('#sidebar-filter-field').val(), 'i');
        var sidebarLinks = $(selDocsSidenavs).find('a');
        var matchingLinks = sidebarLinks.filter(function(index) {
            return $(this).text().match(filterRegexp);
        });
        sidebarLinks.parent('li').hide();
        $(selDocsSidenavs).find('li').removeClass('active'); // cleans up partial as-you-type searches
        // make matches and their parents visible and expanded:
        matchingLinks.parents('li').show().addClass('active');
        // make direct children visible (if your search caught a subnav directly):
        matchingLinks.parent('li').find('li').show();
    },
};

// These event handlers only need to be set up once, and get re-used when
// navigating via turbolinks.
$(document).on('click', function(e) {
    var target = $(e.target);
    var quickNav = $(selQuickNav);
    var learnCta = target.parents(".download").find(".learn-cta");

    // SIDEBAR/MISC STUFF:
    if ( target.is('.has-subnav') ) {
        // toggle arrow toggles its subnav.
        target.toggleClass('active');
    } else if ( target.is(".has-subnav > a[href^='#']") ) {
        // links that don't go anywhere act as toggle controls.
        e.preventDefault();
        target.parent().toggleClass('active');
    } else if ( target.is('#filter-button') ) {
        sidebarController.showFilter();
    } else if ( target.is('#filter-close') ) {
        sidebarController.reset();
    } else if ( target.is('#toggle-button') ) {
        // the expand/reset button
        if ( $('#toggle-button').text() === "Expand all" ) {
            sidebarController.expandAll();
        } else {
            sidebarController.reset();
        }
    } else if ( target.is('section.downloads .details a') ) {
        // Learn CTAs on downloads page
        // Terminate early if user is downloading same OS different arch
        if ( ! learnCta.hasClass("show") ) {
            // When downloading first time or for an additional OS: show
            // the relevant CTA (hiding others)
            $("section.downloads .learn-cta").removeClass("show");
            learnCta.addClass("show");
        }
    }

    // QUICK-NAV STUFF: (not mutually exclusive w/ sidebar stuff, due to the final 'else')
    if (target.closest('#inner-quicknav-trigger').length > 0) {
        // clicking trigger (or its svg child) toggles quick-nav.
        quickNav.toggleClass('active');
    } else if (target.is('#inner-quicknav > ul.dropdown li a')) {
        // Jumping to a section means you're done with quick-nav.
        quickNav.removeClass('active');
    } else if (target.closest(quickNav).length > 0) {
        // clicking inside quick-nav doesn't close it.
        // Do nothing.
    } else {
        // Clicking outside quick-nav closes it.
        quickNav.removeClass('active');
    }
});

// Typing in the filter field filters the sidebar; escape key quits.
$(document).on('keyup', function(e) {
    if ( e.target === document.getElementById('sidebar-filter-field') ) {
        if (e.keyCode === 27) { // escape key
            sidebarController.reset();
        } else {
            sidebarController.performFilter();
        }
    }
});

// Type slash to start filtering the sidebar.
$(document).on('keydown', function(e) {
    // 191 = / (forward slash) key
    if (e.keyCode !== 191) {
        return;
    }
    var focusedElementType = document.activeElement.tagName;
    if (focusedElementType !== "TEXTAREA" && focusedElementType !== "INPUT") {
        e.preventDefault();
        sidebarController.showFilter();
    }
});
