var app = angular.module('myApp', ['ngRoute']);

app.config(function($routeProvider,$compileProvider) {
  $routeProvider.when('/login', {
    templateUrl: 'login.html',
    controller: 'LoginCtrl'
  });
  $routeProvider.when('/', {
    templateUrl: 'home.html',
    controller: 'HomeCtrl'
  });
   $routeProvider.when('/home/:add', {
        templateUrl: 'home.html',
        controller: 'HomeCtrl'
      });
      $routeProvider.when('/home/:edit', {
        templateUrl: 'home.html',
        controller: 'HomeCtrl'
      });
  $routeProvider.otherwise({ redirectTo: '/' });
  $compileProvider.debugInfoEnabled(false);
});
app.run(function(authentication, $rootScope, $location,crudService) {
  $rootScope.$on('$routeChangeStart', function(evt) {
    if(!authentication.isAuthenticated){ 
      $location.url("/login");
    }
    event.preventDefault();
  });
})

app.controller('LoginCtrl', function($scope, $http, $location, authentication,crudService) {
  
});

app.controller('AppCtrl', function($scope, authentication,crudService) {
  $scope.templates =
  [
  	{ url: 'login.html' },
  	{ url: 'home.html' }
 
  ];
    $scope.template = $scope.templates[0];
  $scope.login = function (useremail, password) {
    if ( useremail === 'clarion@clarion.com' && password === 'Clarion123') {
  		authentication.isAuthenticated = true;
  		$scope.template = $scope.templates[1];
  		$scope.user = useremail.substring(0, useremail.lastIndexOf("@"));
    } else {
  		$scope.loginError = "Invalid useremail/password combination";
    };
  };
  
});

app.controller('HomeCtrl', function($scope,$rootScope, $routeParams,crudService,authentication) {

  //$scope.user = authentication.user.name;
   //$scope.update = $routeParams.add;
  
  $scope.save = function () {
    crudService.saveContact($scope.newContact);
    $scope.newContact = {};
    $rootScope.newContact = {};
    $scope.successMsg = 'Records have been successfully added.'
    $scope.submitted = true;
 
 
  };
   $scope.contacts = crudService.showAll();
  // $scope.edit = function (id) {
   
  //    $rootScope.newContact = crudService.edit(id);
  // };
  $scope.delete = function (id) {
     $scope.newContact = crudService.delete(id);
     $scope.successMsg = 'Records have been successfully deleted.'
  };
});

app.factory('authentication', function() {
  return {
    isAuthenticated: false,
    user: null
  }
});


app.factory('crudService', function() {
  this.uid = 1;
  this.contacts = [
      {id: 1, name: 'Samsung Mobile1', rate:500,quality:1},
      {id: 2, name: 'Samsung Mobile2', rate:1500,quality:1},
      {id: 3, name: 'Samsung Mobile3', rate:2500,quality:1},
      {id: 4, name: 'Samsung Mobile4', rate:3500,quality:1},

    ];
    this.newContact = {};
    this.saveContact = function (objNewContact) {
      this.newContact = objNewContact;
      if(!this.newContact.id && typeof this.newContact.id == 'undefined') {
        this.contacts.id = this.uid++;
        this.contacts.push(this.newContact);
      } else {
        this.contacts[this.newContact.id] = this.newContact;
      }
    };
    this.showAll = function () {
      return this.contacts;
    };
    this.edit = function (id) {
      this.newContact = angular.copy(this.contacts[id]);
      this.newContact.id = id;
      return this.newContact;
    };
    this.delete = function (id) {
      this.contacts.splice(id, 1);
      return this.contacts;
    };
   
    return this;
});