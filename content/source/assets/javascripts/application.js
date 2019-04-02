//= require turbolinks
//= require jquery

//= require hashicorp/mega-nav
//= require hashicorp/sidebar
//= require hashicorp/analytics

//= require analytics

document.addEventListener("turbolinks:load", function() {
    "use strict";
    var docsSidebar = $("#docs-sidebar ul.nav.docs-sidenav");
    docsSidebar.find("ul.nav").addClass("nav-hidden");
    docsSidebar.find("li").has("a.current-page").addClass("active");
});

document.addEventListener("turbolinks:load", function() {
    "use strict";
    var headers = $('#inner').find('h2, h3, h4');
    if (headers.length > 0) {
        $("#inner #inner-quicknav").html(
            '<span id="inner-quicknav-trigger">Quick Nav<svg width="9" height="5" xmlns="http://www.w3.org/2000/svg"><path d="M8.811 1.067a.612.612 0 0 0 0-.884.655.655 0 0 0-.908 0L4.5 3.491 1.097.183a.655.655 0 0 0-.909 0 .615.615 0 0 0 0 .884l3.857 3.75a.655.655 0 0 0 .91 0l3.856-3.75z" fill-rule="evenodd"/></svg></span><ul class="dropdown"></ul>'
        );
        var quickNavTrigger = $('#inner-quicknav #inner-quicknav-trigger');
        var quickNav = $('#inner-quicknav > ul.dropdown');
        headers.each( function(index, element) {
            var level = element.nodeName.toLowerCase();
            var header_text = $(element).text();
            var header_id = $(element).attr('id');
            quickNav.append(`<li class="level-${level}"><a href="#${header_id}">${header_text}</a></li>`);
        });
        quickNavTrigger.on('click', function(e) {
            $(this).siblings('ul').toggleClass('active');
            e.stopPropagation();
        });
        quickNav.on('click', function(e) {
            e.stopPropagation();
        });
        quickNav.find('li a').on('click', function() {
            quickNav.removeClass('active');
        });
        $('body').on('click', function() {
            quickNav.removeClass('active');
        });
    }
});
