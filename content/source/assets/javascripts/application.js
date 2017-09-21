//= require turbolinks
//= require jquery

//= require hashicorp/mega-nav
//= require hashicorp/sidebar
//= require hashicorp/analytics

//= require analytics

document.addEventListener("turbolinks:load", function() {
    "use strict";
    var docsSidebar = $("#docs-sidebar ul.nav.docs-sidenav");
    var activeListItems = docsSidebar.find("li").has("a.current-page");
    activeListItems.addClass("active");
});
