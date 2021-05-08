var app = angular.module('covid-app', []);
var map;
app.controller('ctrl-covid', function ($scope) {
    $scope.countries = [];
    $scope.searchManager;
    $scope.infobox;
    ////////////////////////////////////////////
    fetch('https://api.covid19api.com/summary')
        .then((response) => {
            return response.json();
        })
        .then((result) => {
            //console.log(result);
            $scope.confirmed = result.Global.TotalConfirmed.toLocaleString();
            $scope.deaths = result.Global.TotalDeaths.toLocaleString();
            $scope.recovered = result.Global.TotalRecovered.toLocaleString();

            /////////////////////////////////////////////////
            // Show all countries
            $scope.countries = result.Countries;
            $scope.$apply(); // referesh ng-models, scope variables
        });
    ///////////////////////////////////////////////////////
    $scope.Search = function (objCountry) {
        //alert(country);
        if (!$scope.searchManager) {
            Microsoft.Maps.loadModule('Microsoft.Maps.Search', function () {
                $scope.searchManager = new Microsoft.Maps.Search.SearchManager(map);
                $scope.Search(objCountry);
            })
        }
        else {
            map.entities.clear();
            $scope.performSearch(objCountry);
        }
    }

    $scope.performSearch = function (objCountry) {
        let searchRequest = {
            where: objCountry.Country,
            callback: function (r) {
                if (r.results) {

                    let pin = new Microsoft.Maps.Pushpin(r.results[0].location);

                    //pin.metadata = {
                    //    title: objCountry.Country,
                    //    description: `Confirmed: ${objCountry.TotalConfirmed.toLocaleString()} <br />
                    //                  Death: ${objCountry.TotalDeaths.toLocaleString()} <br />
                    //                  Recovered: ${objCountry.TotalRecovered.toLocaleString()} <br />`
                    //};

                    //Microsoft.Maps.Events.addHandler(pin, 'click', $scope.pinClicked);

                    map.entities.push(pin);

                    map.setView({ bounds: r.results[0].bestView });

                    $scope.infobox = new Microsoft.Maps.Infobox(map.getCenter(), {
                        visible: true,
                        maxWidth: 126,
                        maxHeight: 256,
                        title: objCountry.Country,
                        description: `Confirmed: ${objCountry.TotalConfirmed.toLocaleString()} <br />
                                      Death: ${objCountry.TotalDeaths.toLocaleString()} <br />
                                      Recovered: ${objCountry.TotalRecovered.toLocaleString()} <br />`
                    })

                    $scope.infobox.setMap(map);
                }
            }
        };

        $scope.searchManager.geocode(searchRequest);
    }

    $scope.pinClicked = function (e) {
        if (e.target.metadata) {
            $scope.infobox.setOptions({
                location: e.target.getLocation(),
                title: e.target.metadata.title,
                description: e.target.metadata.description,
                visible: true
            });
        }
    }
});

function ShowMap() {
    map = new Microsoft.Maps.Map('#myMap');
}