var app = angular.module('myApp', []);
app.controller('companyCtrl',function($scope,  $http, $window) {


  $http.get("https://morning-headland-92448.herokuapp.com/api/v1/companies").then(function (response) {
      $scope.companies = response.data;
          console.log(response);
  });



  $scope.DeleteData = function (index) {
    $scope.id = $scope.companies[index].companyID;
    var deleteUrl = 'https://morning-headland-92448.herokuapp.com/api/v1/companies/' + $scope.id;
    $http.delete(deleteUrl,'DELETE').then(function(response){
      console.log(response);
      $scope.Refresh();
    },function(errorResponse){
      console.log(errorResponse);
    });
  };

  $scope.Refresh = function (){
    location.reload();
  }



  $scope.PostData = function() {
    var tempCompanyID = $scope.companyID;
    var tempCompanyName = $scope.companyName;
    var tempAddress = $scope.address;
    var tempCity = $scope.city;
    var tempCountry = $scope.country;
    var tempOwners = $scope.owners;
    var tempPhoneNumber = $scope.phoneNumber;
    var tempEmail = $scope.email;
    console.log(tempEmail);
    var params = JSON.stringify({companyID: tempCompanyID, companyName: tempCompanyName, address: tempAddress, city: tempCity, country: tempCountry, owners: tempOwners, phoneNumber: tempPhoneNumber, email: tempEmail});

    var postURL = 'https://morning-headland-92448.herokuapp.com/api/v1/companies';
    $http.post(postURL, params
        ).then(function(response){
          console.log(response);
          $scope.Refresh();
        },function(errorResponse){
          console.log(errorResponse);

          //$scope.Alert();
        });

	};

  $scope.UpdateData = function() {

    var tempCompanyID = $scope.companyID;
    var tempCompanyName = $scope.companyName;
    var tempAddress = $scope.address;
    var tempCity = $scope.city;
    var tempCountry = $scope.country;
    var tempOwners = $scope.owners;
    var tempPhoneNumber = $scope.phoneNumber;
    var tempEmail = $scope.email;

    var params = JSON.stringify({companyID: tempCompanyID, companyName: tempCompanyName, address: tempAddress, city: tempCity, country: tempCountry, owners: tempOwners, phoneNumber: tempPhoneNumber, email: tempEmail});

    var patchURL = 'https://morning-headland-92448.herokuapp.com/api/v1/companies/'+tempCompanyID;
    console.log(patchURL);
    $http.patch(patchURL, params
        ).then(function(response){
          console.log(response);
          $scope.Refresh();
        },function(errorResponse){
          console.log(errorResponse);

          //$scope.Alert();
        });

	};


  $scope.InsertTextIntoInputFields = function(index){

    $scope.idOfCompany = $scope.companies[index].companyID;
    $scope.nameOfCompany = $scope.companies[index].companyName;
    $scope.addressOfCompany = $scope.companies[index].address;
    $scope.cityOfCompany = $scope.companies[index].city;
    $scope.countryOfCompany = $scope.companies[index].country;
    $scope.ownersOfCompany = $scope.companies[index].owners;
    $scope.phoneNumberOfCompany = $scope.companies[index].phoneNumber;
    $scope.emailOfCompany = $scope.companies[index].email;

    $scope.companyID = $scope.idOfCompany;
    $scope.companyName = ($scope.nameOfCompany);
    $scope.address = ($scope.addressOfCompany);
    $scope.city = ($scope.cityOfCompany);
    $scope.country = ($scope.countryOfCompany);
    $scope.owners = ($scope.ownersOfCompany);
    $scope.phoneNumber = $scope.phoneNumberOfCompany;
    $scope.email = ($scope.emailOfCompany);

  }

  $scope.ClearInputFields = function(){
    $scope.companyID = "";
    $scope.companyName = "";
    $scope.address = "";
    $scope.city = "";
    $scope.country = "";
    $scope.owners = "";
    $scope.phoneNumber = "";
    $scope.email = "";
  }

  $scope.PostOrPatchDelegater = function(id){
    console.log(id);
    if($scope.containsCompany(id)){
      console.log("go into update");
      $scope.UpdateData();
    }
    else{
      $scope.PostData();
    }
  }
  var arr = [];
  $scope.containsCompany = function(id){
    var stringID = "" + id;
    var theResult = false;
    angular.forEach($scope.companies, function(value, key){
      arr.push(value);
      if(value.companyID === stringID){
        theResult = true;
      }
    });
    return theResult;
  }

  $scope.Alert = function(){
    $window.alert("something");
  };
//End point of controller
});

function myFunction() {
  var selectedIndex = Number(document.getElementById("dropdown").selectedIndex) - 1;
  console.log(selectedIndex);
  var input, filter, table, tr, td, i;
  input = document.getElementById("myInput");
  filter = input.value.toUpperCase();
  table = document.getElementById("myTable");
  tr = table.getElementsByTagName("tr");
  for (i = 0; i < tr.length; i++) {
    td = tr[i].getElementsByTagName("td")[selectedIndex];
    if (td) {
      if (td.innerHTML.toUpperCase().indexOf(filter) > -1) {
        tr[i].style.display = "";
      } else {
        tr[i].style.display = "none";
      }
    }
  }
}
