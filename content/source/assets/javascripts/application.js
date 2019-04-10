//= require turbolinks
//= require jquery

//= require hashicorp/mega-nav
//= require hashicorp/sidebar
//= require hashicorp/analytics

//= require analytics

// Set up terraform.io UI helpers
document.addEventListener("turbolinks:load", function() {
    "use strict";

    // In navigation sidebars, hide most sub-lists and reveal any that contain the
    // current page. The a.current-page class is added during build by
    // layouts/inner.erb.
    var docsSidebar = $("#docs-sidebar ul.nav.docs-sidenav");
    var subNavs = docsSidebar.find("ul").addClass("nav-hidden").parent("li"); // we never manipulate the nav-hidden class again.
    var sidebarReset = function() {
        subNavs.removeClass("active");
        docsSidebar.find("li").has(".current-page, .nav-visible").addClass("active"); // not just subnavs.
    };
    sidebarReset();

    // Make sidebar navs expandable
    subNavs.addClass("has-subnav");
    subNavs.on("click", function(e) {
        if (e.target == this) {
            $(this).toggleClass("active");
        }
        e.stopPropagation();
    });
    // For subnavs that don't link to a page, use the whole header as a toggle.
    docsSidebar.find("a[href^='#']").on("click", function(e) {
        e.preventDefault();
        $(this).parent("li").trigger("click");
    });

    // If this is a Very Large Sidebar, add extra controls to expand/collapse
    // and filter it.
    var sidebarLinks = docsSidebar.find("a");
    if (sidebarLinks.length > 30) {
        var sidebarControlsHTML =
            '<div id="sidebar-controls">' +
                '<div id="sidebar-filter">' +
                    '<label for="sidebar-filter-field">Filter page titles</label>' +
                    '<input type="text" id="sidebar-filter-field" name="sidebar-filter-field" />' +
                    '<a href="#" id="sidebar-filter-field-clear" class="btn btn-default" role="button" title="Clear Filter">x</a>' +
                '</div>' +
                '<a href="#" class="subnav-toggle btn btn-default" role="button">Expand all</a>' +
            '</div>';
        if ($("#sidebar-controls").length === 0) { // then add it!
            if ($("#docs-sidebar a.subnav-toggle").length === 0) { // ...in default location
                $("#docs-sidebar").prepend(sidebarControlsHTML);
            } else { // ...at a manually chosen location
                $("#docs-sidebar a.subnav-toggle").replaceWith(sidebarControlsHTML);
            }
        }
        var expandAllState = true;
        var subnavToggle = $("#sidebar-controls a.subnav-toggle");
        subnavToggle.on({
            "sayReset": function(e) {
                $(this).html("Reset")
                expandAllState = false;
            },
            "sayExpand": function(e) {
                $(this).html("Expand all")
                expandAllState = true;
            },
            "click": function(e) {
                e.preventDefault();
                if (expandAllState) {
                    subNavs.addClass("active");
                    $(this).trigger("sayReset");
                } else {
                    sidebarReset();
                    resetFilter();
                    $(this).trigger("sayExpand");
                }
            }
        });

        var filterField = $("#sidebar-controls input#sidebar-filter-field");
        var filterClear = $("#sidebar-controls a#sidebar-filter-field-clear");
        var resetFilter = function() {
            filterField.val("");
            filterField.trigger("blur");
            sidebarLinks.parent("li").show();
            sidebarReset();
            subnavToggle.trigger("sayExpand");
        };
        // Clear button clears:
        filterClear.on('click', function(e) {
            e.preventDefault();
            resetFilter();
        });
        // Filter as you type:
        filterField.on('keyup', function(e) {
            if (e.keyCode === 27) { // escape key
                resetFilter();
            } else {
                subnavToggle.trigger("sayReset");
                var filterRegexp = new RegExp(filterField.val(), 'i');
                var matchingLinks = sidebarLinks.filter(function(index) {
                    return $(this).text().match(filterRegexp);
                });
                sidebarLinks.parent('li').hide();
                subNavs.removeClass('active'); // cleans up partial as-you-type searches
                // make parents visible and active/open:
                matchingLinks.parents('li').show().filter(subNavs).addClass('active');
                // make direct children visible (if your search caught a subnav directly):
                matchingLinks.parent('li').find('li').show();
            }
        });
        // Type slash to focus sidebar filter:
        $(document).keydown(function(e) {
            var _target = $(e.target);
            var _focused = $(document.activeElement);
            var _inputting = _focused.get(0).tagName.toLowerCase() === "textarea" || _focused.get(0).tagName.toLowerCase() === "input";

            // / (forward slash) key = search
            if (!_inputting && e.keyCode === 191) {
                e.preventDefault();
                filterField.focus();
                return;
            }
        });
    }


    // On docs/content pages, add a hierarchical quick nav menu if there are
    // more than two H2/H3/H4 headers.
    var headers = $('#inner').find('h2, h3, h4');
    if (headers.length > 2) {
        // Build the quick-nav HTML:
        $("#inner #inner-quicknav").html(
            '<span id="inner-quicknav-trigger">Page Quick Nav<svg width="9" height="5" xmlns="http://www.w3.org/2000/svg"><path d="M8.811 1.067a.612.612 0 0 0 0-.884.655.655 0 0 0-.908 0L4.5 3.491 1.097.183a.655.655 0 0 0-.909 0 .615.615 0 0 0 0 .884l3.857 3.75a.655.655 0 0 0 .91 0l3.856-3.75z" fill-rule="evenodd"/></svg></span><ul class="dropdown"></ul>'
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
