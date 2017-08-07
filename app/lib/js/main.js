(function() {
    "use strict";

    //definition de la variable angular
    var app = angular.module("app", ['mgcrea.ngStrap', 'ngTagsInput', 'angular.filter']);

    app.filter('removeAccents',function() {
        return function(source) {
            var accent = [
                /[\300-\306]/g, /[\340-\346]/g, // A, a
                /[\310-\313]/g, /[\350-\353]/g, // E, e
                /[\314-\317]/g, /[\354-\357]/g, // I, i
                /[\322-\330]/g, /[\362-\370]/g, // O, o
                /[\331-\334]/g, /[\371-\374]/g, // U, u
                /[\321]/g, /[\361]/g, // N, n
                /[\307]/g, /[\347]/g, // C, c
            ],
            noaccent = ['A','a','E','e','I','i','O','o','U','u','N','n','C','c'];

            for (var i = 0; i < accent.length; i++){
                source = source.replace(accent[i], noaccent[i]);
            }

            return source;
        }
    });

    app.filter('spaceless',function() {
        return function(input) {
            if (input) {
                return input.replace(/\s+/g, '_');    
            }
        }
    });

    app.filter('dashless',function() {
    return function(input) {
        if (input) {
            return input.replace(/\-+/g, '_');    
        }
    }
    });

    app.filter('capitalize', function() {
        return function(input) {
        return (!!input) ? input.charAt(0).toUpperCase() + input.substr(1).toLowerCase() : '';
        }
    });

    app.filter("toHtml", ['$sce', function($sce) {
        return function(htmlCode, orHtml){
            var value = htmlCode || orHtml;

            return $sce.trustAsHtml(value.replace(/\n/g,'<br>'));
        }
    }]);

    app.filter('replace',function(){
        return function(input, target, replaceTarger){
            if (angular.isString(input)) {
                return input.replace(RegExp(target, 'g'), replaceTarger);
            } else {
                return input;
            }
        }
    });
    app.filter('valuesInArray',function(){
        return function(arraySrc, arrayCompart){
            if (!angular.isArray(arraySrc) && !angular.isArray(arrayCompart)) return [];

            return arraySrc.filter(function(value, index){
                return arrayCompart.indexOf(value) > -1 ? true : false;
            })
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

    app.controller('ControllerMain', [
        '$scope',
        'Template',
        '$log',
        '$location',
        '$alert',
        '$filter',
        function ($scope, TemplateSrv, $log, $location, $alert, $filter) {
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

            

            $scope.visibleCondition = function(objCondEqual, objCondIn){
                
                var visible = true;
                var equalKeys = null;

                if (objCondEqual != null) {
                    equalKeys = Object.keys(objCondEqual);
                    equalKeys.forEach(function(key) {
                        visible &= objCondEqual[key] == $scope.value[key]
                    });
                    
                } else if (objCondIn != null){
                    equalKeys = Object.keys(objCondIn);
                    equalKeys.forEach(function(key) {

                        if (angular.isArray(objCondIn[key]) && angular.isArray($scope.value[key])) {
                            if ($filter('valuesInArray')($scope.value[key], objCondIn[key]).length > 0) {
                                visible &= true;
                            } else {
                                visible &= false;
                            }
                        } else if (angular.isArray(objCondIn[key]) && !angular.isArray($scope.value[key])) {
                            visible &= false;
                        } else {
                            visible &= angular.isArray($scope.value[key]) && $filter('contains')($scope.value[key], objCondIn[key]())
                        }
                    });
                }

                return visible;

            }
        
        }
    ]);

    

}());
