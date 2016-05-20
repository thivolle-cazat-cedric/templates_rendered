(function() {
    "use strict";

    //definition de la variable angular
    var app = angular.module("app", ['mgcrea.ngStrap', 'ngTagsInput', 'angular.filter']);

    app.filter('replace',function(){
        return function(input, target, replaceTarger){
            if (angular.isString(input)) {
                return input.replace(RegExp(target, 'g'), replaceTarger);
            } else {
                return input;
            }
        }
    });

    app.directive('strInput', function() {
       return {
            templateUrl: '/lib/input-tpl/str.html',
            replace: true,
            scope: {
                ngModel: '=',
                attr: '='
            }
        }
    });
    app.directive('intInput', function() {
       return {
            templateUrl: '/lib/input-tpl/int.html',
            replace: true,
            scope: {
                ngModel: '=',
                attr: '='
            },
            link:function(scope){
                scope.decrement = function(){
                    if (!isNaN(scope.ngModel)) {
                        var int = parseInt(scope.ngModel);
                        int -= 1
                        scope.ngModel =  int;
                    } else {
                        scope.ngModel = 0;
                    }
                }
                scope.increment = function(){
                    if (!isNaN(scope.ngModel)) {
                        var int = parseInt(scope.ngModel);
                        int += 1
                        scope.ngModel =  int;
                    } else {
                        scope.ngModel = 0;
                    }
                }
            }
        }
    });
    app.directive('listInput', function() {
       return {
            templateUrl: '/lib/input-tpl/list.html',
            replace: true,
            scope: {
                ngModel: '=',
                attr: '='
            },
        }
    });
    app.directive('multipleListInput', function() {
       return {
            templateUrl: '/lib/input-tpl/multipleList.html',
            replace: true,
            scope: {
                ngModel: '=',
                attr: '='
            },
            link:function(scope){
                scope.multiple = true;
            }
        }
    });
    app.directive('boolInput', function() {
       return {
            templateUrl: '/lib/input-tpl/bool.html',
            replace: true,
            scope: {
                ngModel: '=',
                attr: '='
            },
            link:function(scope){
                scope.ngModel = JSON.parse(scope.ngModel);
                scope.change = function(){
                    scope.ngModel = !scope.ngModel;
                }
            }
        }
    });
    app.directive('dateInput', function() {
       return {
            templateUrl: '/lib/input-tpl/date.html',
            replace: true,
            scope: {
                ngModel: '=',
                attr: '='
            },
            link:function(scope){
                scope.formatDate = "dd/MM/yyyy";
                scope.yesterday = new Date();
                scope.yesterday.setDate(scope.yesterday.getDate() -1);
            }
        }
    });
    app.directive('tagInput', function() {
       return {
            templateUrl: '/lib/input-tpl/tags.html',
            replace: true,
            scope: {
                ngModel: '=',
                attr: '='
            }
        }
    });


    app.service('Template', ['$http', function ($http) {
        function preValidateUtri(uri){
            if (angular.isUndefined(uri)) {
                uri = ''
            } else {
                uri = uri.replace(/\/+/g, '/');
                uri = uri.replace(/^\/+/g, '');
            }
            
            return uri
        }
        this.getTemplateUri = function(dirName, templateName){
            dirName =  preValidateUtri(dirName);
            // if (dirName.substr(-1) != '/') dirName += '/';
            return preValidateUtri('api/template/' + dirName + '/' + templateName + '.html')
        }
        this.list = function(dir, done){
            
            dir = preValidateUtri(dir)
            $http({
                method: "GET",
                url: preValidateUtri('api/templates/' + dir),
                headers: {
                    "Content-Type": "application/json; charset=UTF-8"
                }
            }).success(function(data,status){
                return done(null, status, data);
            }).error(function(data, status) {
                return done("ERROR", status, data);
            });
        }

        this.getConf = function(dirName, templateName, done) {
            dirName =  preValidateUtri(dirName);
            if (dirName.substr(-1) != '/') dirName += '/';
            var path = preValidateUtri(dirName + '/' +templateName)

            $http({
                method: "GET",
                url: preValidateUtri('api/template/' + path),
                headers: {
                    "Content-Type": "application/json; charset=UTF-8"
                }
            }).success(function(data,status){
                return done(null, status, data);
            }).error(function(data, status) {
                return done("ERROR", status, data);
            });
        }
    }])

    app.controller('ControllerMain', ['$scope', 'Template', '$log', '$location', '$alert', function ($scope, TemplateSrv, $log, $location, $alert) {
        $scope.path = [];
        

        $scope.getPath = function(){
            var path =  $scope.path.join('/');
            if (path.substr(0,1) == "/") {
                path = path.substr(1);
            }
            return path;
        }

        $scope.changePath = function(dirName){
            $scope.path.push(dirName);
            refreshDir();
        }
        $scope.gotoPathIndex = function(index){
            $scope.path = $scope.path.splice(0, index + 2);
            refreshDir()
            // $scope.backDirectory();

        }
        $scope.backDirectory = function(){
            $scope.path.splice($scope.path.length-1, 1);
            $scope.changePath($scope.path.splice($scope.path.length-1, 1)[0]);
        }
        $scope.currentDirectory = function(){
            if ($scope.path.length > 1) {
                return $scope.path[$scope.path.length-1];
            } else {
                return null;
            }
        }

        $scope.viewTemplate = function(templateName){
            $scope.templateError = null;
            $scope.template = null;
            TemplateSrv.getConf($scope.getPath(), templateName, function(err, status, d){
                if (!err && d.data) {
                    $scope.value = {};
                    $scope.template = d.data;
                    $scope.template.tplPath = TemplateSrv.getTemplateUri($scope.getPath(), templateName);
                    $scope.template.path = $scope.getPath();
                } else {
                    $alert({
                        title: d.error_message + " for : " + templateName,
                        content: "<br>" + d.error_detail,
                        placement: 'top-right',
                        type: 'danger',
                        show: true
                    })
                }
            })
        }

        function refreshDir(){
            $scope.templates = [];
            TemplateSrv.list($scope.getPath(), function(err, status, data){
                if (!err) {
                    $scope.directories = data.directories;
                    $scope.templates = data.templates;
                    // $location.hash($scope.getPath())
                } else {
                    if (status != 404) {
                        $log.error('error on refreshDir : [' + status + ']')
                    }
                }
            })
        }

        $scope.changePath('/')

        
    }]);

    

}());
