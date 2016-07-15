// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var clientId = "125195948962-24suo8u0nifj5rv86sv92dt9jklduld0.apps.googleusercontent.com";
var clientSecret = "0b3phCO9GjTLLo6OCdWF7HF2";
var requestToken = "";
var accessToken = "";
var commuter=angular.module('starter', ['ionic', 'ngStorage', 'ngCordova'])

commuter.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
});
commuter.config(function($stateProvider, $urlRouterProvider) {
    $stateProvider
        .state('login', {
            url: '/login',
            templateUrl: 'templates/login.html',
			controller:'LoginController'
           
        })
        .state('profile', {
            url: '/profile',
            templateUrl: 'templates/profile.html',
            controller: 'ProfileController'
        })
		.state('emergency_contact', {
            url: '/emergency_contact',
            templateUrl: 'templates/emergency_contact.html'
        })
		.state('home', {
            url: '/home',
            templateUrl: 'templates/home.html'
        });
         $urlRouterProvider.otherwise('/login');
});
commuter.controller("LoginController", function($scope, $cordovaOauth, $localStorage, $location,$ionicLoading,$http) {
$http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
/*Facebook Login*/
    $scope.login = function() {
	  $ionicLoading.show({
    content: 'Loading',
    animation: 'fade-in',
    showBackdrop: true,
    maxWidth: 200,
    showDelay: 0
  });
        $cordovaOauth.facebook("1658867311055751", ["email","public_profile"]).then(function(result) {
		$localStorage.source="facebook";
            $localStorage.accessToken = result.access_token;
			 $ionicLoading.hide();
			$location.path("/profile");
        }, function(error) {
            alert("There was a problem signing in!  See the console for logs");
            console.log(error);
        });
    };
	/*Google Login*/
$scope.googleSignIn=function(){
var ref = window.open('https://accounts.google.com/o/oauth2/auth?client_id=' + clientId + '&redirect_uri=http://localhost/callback&scope=https://www.googleapis.com/auth/urlshortener&approval_prompt=force&response_type=code&access_type=offline', '_blank', 'location=no');
        ref.addEventListener('loadstart', function(event) { 
            if((event.url).startsWith("http://localhost/callback")) {
                requestToken = (event.url).split("code=")[1];
                $http({method: "post", url: "https://accounts.google.com/o/oauth2/token", data: "client_id=" + clientId + "&client_secret=" + clientSecret + "&redirect_uri=http://localhost/callback" + "&grant_type=authorization_code" + "&code=" + requestToken })
                    .success(function(data) {
				
					$localStorage.source="google";
                        $localStorage.accessToken = data.access_token;
                        $location.path("/profile");
                    })
                    .error(function(data, status) {
                        alert("ERROR: " + data);
                    });
                ref.close();
            }
        });
 
};
});

commuter.controller("ProfileController", function($scope, $http, $localStorage, $location,$cordovaContacts,$ionicModal){

    $scope.init = function() {
	if($localStorage.source=="google")
	{
	alert("GOOGLE");
	}
	else
	{
        if($localStorage.hasOwnProperty("accessToken") === true) {
            $http.get("https://graph.facebook.com/v2.5/me", { params: { access_token: $localStorage.accessToken, fields: "id,name,email,first_name,last_name,gender,location,website,picture,relationship_status", format: "json" }}).then(function(result) {
                $scope.profileData = result.data;
				$scope.fname=result.data.first_name;
				$scope.lname=result.data.last_name;	
				$scope.email=result.data.email;
	
            }, function(error) {
                alert("There was a problem getting your profile.  Check the logs for details.");
                console.log(error);
            });

        } 
		else {
            alert("Not signed in");
            $location.path("/login");
        }
		}
	
    };
	/*import contact*/
	$scope.pickContactUsingNativeUI = function () {
    $cordovaContacts.pickContact().then(function (contactPicked) {
      $scope.contact = contactPicked;
	
    })
  };
  
		$scope.submit=function(fname,lname,email,mobile,home,office)
		{
		
		var  networkConnectionType =  navigator.network.connection.type;
		
		if(fname==undefined)
		{
		alert("Enter the First Name");
		}
		else if(lname==undefined)
		{
		alert("Enter the Last Name");
		}
		else if(email==undefined)
		{
		alert("Enter the email");
		}
		/*else if(mobile==undefined)
		{
		alert("Enter the mobile");
		}
		else if(home==undefined)
		{
		alert("Enter the home address");
		}
		else if(office==undefined)
		{
		alert("Enter the office address");
		}*/
		else if(networkConnectionType=="none")
		{
		alert("Check Internet Connection");
		}
		else
		{
		alert("Profile added successfully");
		 $scope.modal.show();
		 }
		 // $location.path("/emergency_contact");
		
		};
		$ionicModal.fromTemplateUrl('templates/emergency_contact.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.modal = modal;
    });
  $scope.openModal = function(){
    $scope.modal.show();
  }
  $scope.closeModal = function(){
    $scope.modal.hide();
  }
	});
		
commuter.controller("emergencyController", function($scope, $http, $localStorage, $location,$cordovaContacts,$ionicModal){
/*import contact*/
	$scope.pickContactUsingNativeUI = function () {
    $cordovaContacts.pickContact().then(function (contactPicked) {
      $scope.contact = contactPicked;
	  
	
    })
	};
	$scope.pickContactUsingNativeUI1 = function () {
    $cordovaContacts.pickContact().then(function (contactPicked) {
      $scope.contact1 = contactPicked;
	
    })
	};
	$scope.submit=function()
		{
		 $scope.modal.hide();
		 $location.path("/home");
		
		};
});



