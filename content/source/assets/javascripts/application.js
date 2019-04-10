//= require turbolinks
//= require jquery

//= require hashicorp/mega-nav
//= require hashicorp/sidebar
//= require hashicorp/analytics

//= require analytics

// Set up terraform.io UI helpers
document.addEventListener("turbolinks:load", function() {
    "use strict";

    // SIDEBAR STUFF:
    // - "subNavs" are <li> elements with a nested <ul> as a direct child.
    // - The <a> child is the "header" of the subnav, and the <ul> is its "content."
    // - Subnavs are collapsed (<ul> hidden) or expanded (<ul> visible).
    // - Collapse/expand is managed by the "active" class on the <li>.

    // Collapse most subnavs, but reveal any that contain the
    // current page. The a.current-page class is added during build by
    // layouts/inner.erb.
    var docsSidebar = $("#docs-sidebar ul.nav.docs-sidenav");
    var subNavs = docsSidebar.find("ul").addClass("nav-hidden").parent("li");
        // we leave the nav-hidden class alone after this.
    var resetActiveSubnavs = function() {
        subNavs.removeClass("active");
        // Activate current page, locked-open navs, and all their parents:
        docsSidebar.find("li").has(".current-page, .nav-visible").addClass("active");
    };
    resetActiveSubnavs();

    // CSS class that adds toggle controls:
    subNavs.addClass("has-subnav");
    // Toggle subnav expansion when clicking an area that isn't claimed by the
    // header or content (usually the :before pseudo-element)
    subNavs.on("click", function(e) {
        if (e.target == this) {
            $(this).toggleClass("active");
        }
        e.stopPropagation();
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
        if ($("#sidebar-controls").length === 0) { // then add it!
            var sidebarControlsHTML =
                '<div id="sidebar-controls">' +
                    '<label for="sidebar-filter-field">Filter page titles</label>' +
                    '<input type="text" id="sidebar-filter-field" name="sidebar-filter-field" />' +
                    '<a href="#" class="subnav-toggle btn btn-default" role="button">Expand all</a>' +
                '</div>';
            if ($("#docs-sidebar a.subnav-toggle").length === 0) { // ...in default location
                $("#docs-sidebar #controls-placeholder").replaceWith(sidebarControlsHTML);
            } else { // ...at a manually chosen location
                $("#docs-sidebar a.subnav-toggle").replaceWith(sidebarControlsHTML);
            }
        }

        var subnavToggle = $("#sidebar-controls a.subnav-toggle");
        var filterField = $("#sidebar-controls input#sidebar-filter-field");

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
        $(document).keydown(function(e) {
            var focusedElementType = $(document.activeElement).get(0).tagName.toLowerCase();
            var inputting = focusedElementType === "textarea" || focusedElementType === "input";

            // / (forward slash) key = search
            if (!inputting && e.keyCode === 191) {
                e.preventDefault();
                filterField.focus();
            }
        });
    }


    // On docs/content pages, add a hierarchical quick nav menu if there are
    // more than two H2/H3/H4 headers.
    var headers = $('#inner').find('h2, h3, h4');
    if (headers.length > 2) {
        // Build the quick-nav HTML:
        $("#inner #inner-quicknav").html(
            '<span id="inner-quicknav-trigger">' +
                'Page Quick Nav' +
                '<svg width="9" height="5" xmlns="http://www.w3.org/2000/svg"><path d="M8.811 1.067a.612.612 0 0 0 0-.884.655.655 0 0 0-.908 0L4.5 3.491 1.097.183a.655.655 0 0 0-.909 0 .615.615 0 0 0 0 .884l3.857 3.75a.655.655 0 0 0 .91 0l3.856-3.75z" fill-rule="evenodd"/></svg>' +
            '</span>' +
            '<ul class="dropdown"></ul>'
        );
        var quickNav = $('#inner-quicknav > ul.dropdown');
        headers.each(function(index, element) {
            var level = element.nodeName.toLowerCase();
            var header_text = $(element).text();
            var header_id = $(element).attr('id');
            quickNav.append('<li class="level-' + level + '"><a href="#' + header_id + '">' + header_text + '</a></li>');
        });
        // Attach event listeners:
        // Trigger opens and closes.
        $('#inner-quicknav #inner-quicknav-trigger').on('click', function(e) {
            $(this).siblings('ul').toggleClass('active');
            e.stopPropagation();
        });
        // Clicking inside the quick-nav doesn't close it.
        quickNav.on('click', function(e) {
            e.stopPropagation();
        });
        // Jumping to a section means you're done with the quick-nav.
        quickNav.find('li a').on('click', function() {
            quickNav.removeClass('active');
        });
        // Clicking outside the quick-nav closes it.
        $('body').on('click', function() {
            quickNav.removeClass('active');
        });
    }
});
