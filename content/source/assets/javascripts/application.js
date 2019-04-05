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
    docsSidebar.find("li").has(".current-page, .nav-visible").addClass("active");
    var subNavs = docsSidebar.find("ul").addClass("nav-hidden").parent("li");

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
    // Navs can include an optional global toggle like this:
    // <a href="#" class="subnav-toggle">(Expand/collapse all)</a>
    // Navs that don't want that can leave it out.
    var globalExpand = true;
    $("#docs-sidebar a.subnav-toggle").on("click", function(e) {
        e.preventDefault();
        if (globalExpand) {
            subNavs.addClass("active");
        } else {
            subNavs.removeClass("active");
        }
        globalExpand = !globalExpand;
    });


    // On docs/content pages, add a hierarchical quick nav menu if there are any
    // H2/H3/H4 headers.
    var headers = $('#inner').find('h2, h3, h4');
    if (headers.length > 0) {
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
