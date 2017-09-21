//= require turbolinks
//= require jquery

//= require hashicorp/mega-nav
//= require hashicorp/sidebar

$( document ).ready( function() {
    "use strict";
    var docsSidebar = $("#docs-sidebar ul.nav.docs-sidenav");
    var flexibleLocation = new RegExp(
        location.pathname.replace(/(\/|\/index.html)$/, "/(index.html)?") + '$'
    );
    var activeLinks = docsSidebar.find("a").filter(
        function(index, element) {
            return flexibleLocation.test( $(element).prop("href") );
        }
    );
    var activeListItems = docsSidebar.find("li").has(activeLinks);
    console.log(activeListItems);
    activeListItems.addClass("active");
});
