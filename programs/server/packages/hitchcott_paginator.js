(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var TAPi18next = Package['tap:i18n'].TAPi18next;
var TAPi18n = Package['tap:i18n'].TAPi18n;

/* Package-scope variables */
var Paginator, __, translations;

(function () {

///////////////////////////////////////////////////////////////////////
//                                                                   //
// packages/hitchcott:paginator/package-i18n.js                      //
//                                                                   //
///////////////////////////////////////////////////////////////////////
                                                                     //
TAPi18n.packages["hitchcott:paginator"] = {"translation_function_name":"__","helper_name":"_","namespace":"hitchcott:paginator"};
                                                                     // 2
// define package's translation function (proxy to the i18next)      // 3
__ = TAPi18n._getPackageI18nextProxy("hitchcott:paginator");         // 4
                                                                     // 5
///////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

///////////////////////////////////////////////////////////////////////
//                                                                   //
// packages/hitchcott:paginator/Users/chris/git/meteor-packages/pagi //
//                                                                   //
///////////////////////////////////////////////////////////////////////
                                                                     //
var _ = Package.underscore._,                                        // 1
    package_name = "hitchcott:paginator",                            // 2
    namespace = "hitchcott:paginator";                               // 3
                                                                     // 4
if (package_name != "project") {                                     // 5
    namespace = TAPi18n.packages[package_name].namespace;            // 6
}                                                                    // 7
// integrate the fallback language translations                      // 8
translations = {};                                                   // 9
translations[namespace] = {"previous":"Previous","next":"Next","page_x_of_y":"Page __currentPage__ of __totalPages__"};
TAPi18n._loadLangFileObject("en", translations);                     // 11
                                                                     // 12
///////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

///////////////////////////////////////////////////////////////////////
//                                                                   //
// packages/hitchcott:paginator/Users/chris/git/meteor-packages/pagi //
//                                                                   //
///////////////////////////////////////////////////////////////////////
                                                                     //
var _ = Package.underscore._,                                        // 1
    package_name = "hitchcott:paginator",                            // 2
    namespace = "hitchcott:paginator";                               // 3
                                                                     // 4
if (package_name != "project") {                                     // 5
    namespace = TAPi18n.packages[package_name].namespace;            // 6
}                                                                    // 7
if(_.isUndefined(TAPi18n.translations["ja"])) {                      // 8
  TAPi18n.translations["ja"] = {};                                   // 9
}                                                                    // 10
                                                                     // 11
if(_.isUndefined(TAPi18n.translations["ja"][namespace])) {           // 12
  TAPi18n.translations["ja"][namespace] = {};                        // 13
}                                                                    // 14
                                                                     // 15
_.extend(TAPi18n.translations["ja"][namespace], {"previous":"前","next":"次","page_x_of_y":"__totalPages__頁中__currentPage__頁目"});
                                                                     // 17
///////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

///////////////////////////////////////////////////////////////////////
//                                                                   //
// packages/hitchcott:paginator/Users/chris/git/meteor-packages/pagi //
//                                                                   //
///////////////////////////////////////////////////////////////////////
                                                                     //
var _ = Package.underscore._,                                        // 1
    package_name = "hitchcott:paginator",                            // 2
    namespace = "hitchcott:paginator";                               // 3
                                                                     // 4
if (package_name != "project") {                                     // 5
    namespace = TAPi18n.packages[package_name].namespace;            // 6
}                                                                    // 7
if(_.isUndefined(TAPi18n.translations["sv"])) {                      // 8
  TAPi18n.translations["sv"] = {};                                   // 9
}                                                                    // 10
                                                                     // 11
if(_.isUndefined(TAPi18n.translations["sv"][namespace])) {           // 12
  TAPi18n.translations["sv"][namespace] = {};                        // 13
}                                                                    // 14
                                                                     // 15
_.extend(TAPi18n.translations["sv"][namespace], {"previous":"Föregående","next":"Nästa","page_x_of_y":"Sida __currentPage__ av __totalPages__"});
                                                                     // 17
///////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['hitchcott:paginator'] = {
  Paginator: Paginator
};

})();

//# sourceMappingURL=hitchcott_paginator.js.map
