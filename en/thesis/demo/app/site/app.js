var app = angular.module("siteApp", ["ngRoute"]);

app.config([
  "$routeProvider",
  function ($routeProvider) {
    $routeProvider
      .when("/", {
        templateUrl: "app/site/partials/home.html",
        controller: "homeCtrl",
      })
      .when("/about", {
        templateUrl: "app/site/partials/about.html",
        controller: "aboutCtrl",
      })
      .when("/demo", {
        templateUrl: "app/site/partials/demo.html",
        controller: "demoCtrl",
      })
      .when("/configurator", {
        templateUrl: "app/site/partials/configurator.html",
        controller: "configuratorCtrl",
      })
      .when("/publications", {
        templateUrl: "app/site/partials/publications.html",
        controller: "publicationsCtrl",
      })
      .when("/contacts", {
        templateUrl: "app/site/partials/contacts.html",
        controller: "contactsCtrl",
      })
      .when("/forum", {
        templateUrl: "app/site/partials/forum.html",
        controller: "forumCtrl",
      })
      .otherwise({
        redirectTo: "/",
      });
  },
]);

//Main
app.controller("mainCtrl", function ($scope, $location) {
  $scope.menuClass = function (page) {
    if (page === "Home") {
      page = "";
    }
    var current = $location.path().substring(1);
    return page.toLowerCase() === current ? "active" : "";
  };
  $scope.current = $location.path();
  $scope.pages = [
    "Home",
    "About",
    "Demo",
    "Configurator",
    "Publications",
    "Forum",
    "Contacts",
  ];
});

//Home
app.controller("homeCtrl", function ($scope, $http) {
  $http.get("./app/json/updates.json").then(
    function (response) {
      $scope.updates = response.data;
      console.log(response);
    },
    function (response) {
      console.log(response);
    }
  );
});

//About
app.controller("aboutCtrl", function ($scope) {});

//Demo
app.controller("demoCtrl", function ($scope, $http) {
  $http.get("./app/json/configurations.json").then(
    function (response) {
      $scope.circumplexes = response.data;
      console.log(response);
    },
    function (response) {
      console.log(response);
    }
  );
});

//Configurator
app.controller("configuratorCtrl", function ($scope) {});

//Publications
app.controller("publicationsCtrl", function ($scope) {});

//Forum
app.controller("forumCtrl", function ($scope) {});

//Contacts
app.controller("contactsCtrl", function ($scope) {});
