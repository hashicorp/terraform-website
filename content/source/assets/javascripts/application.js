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
