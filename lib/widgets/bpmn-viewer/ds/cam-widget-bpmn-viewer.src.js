'use strict';

var fs = require('fs');

var angular = require('camunda-bpm-sdk-js/vendor/angular');
var camCommonsUi = require('../../index');

var diagramModule = angular.module('diagramModule', [ camCommonsUi.name ]);
diagramModule.factory('debounce', require('../../../services/debounce'));
diagramModule.controller('testController', ['$scope', function($scope) {
    var init = false;
    var markers = {};

    $scope.$watch('diagramXML', function() {
      init = false;
    });
    var showBadges = function(elements, state) {
      if (init == true) {
        for ( var key in elements) {
          $scope.control.createBadge(key, {
            text : elements[key],
            tooltip : state,
            html : '<div class=\'square-box ' + state
								+ '\'><div class=\'square-content ' + state
								+ '\'><div><span>' + elements[key]
								+ '</span></div></div></div>'
          });
        }
      } else {
        setTimeout(function() {
          showBadges(elements, state);
        }, 10);
      }
    };

    var addMarkers = function(elements) {
      if(init==true) {
        for (var key in markers) {
          $scope.control.removeMarker(key, markers[key]);
          delete markers[key];
        }
        for (var elementKey in elements) {
          if(elements[elementKey] != 'none') {
            $scope.control.addMarker(elementKey, elements[elementKey]);
            markers[elementKey]= elements[elementKey];
          }
        }
      }else{
        setTimeout(function() {
          addMarkers(elements);
        },10);
      }
    };

    $scope.$watch('enabledElementsCount',function(newValue) {
      if(typeof newValue !== 'undefined') {
        showBadges(newValue,'enabled');
      }
    });

    $scope.$watch('activeElementsCount',function(newValue) {
      if(typeof newValue !== 'undefined') {
        showBadges(newValue,'active');
      }
    });

    $scope.$watch('statusElements',function(newValue) {
      if(typeof newValue !== 'undefined') {
        addMarkers(newValue);
      }
    });

    $scope.onLoad = function() {
      init = true;
    };

    $scope.control = {};

    $scope.selectedNodes = [];
    $scope.handleClick = function(element) {
      if (element.businessObject.$instanceOf('bpmn:FlowNode')) {
        if ($scope.control.isHighlighted(element.id)) {
          $scope.control.clearHighlight(element.id);
          $scope.control.removeBadges(element.id);
          $scope.selectedNodes.splice($scope.selectedNodes
            .indexOf(element.id), 1);
          $scope.$apply();
        } else {
          $scope.control.highlight(element.id);
          $scope.control.createBadge(element.id, {
            text : 'Test',
            tooltip : 'This is a tooltip'
          });
          $scope.selectedNodes.push(element.id);
          $scope.$apply();
        }
      }

      if (element.businessObject.$instanceOf('cmmn:PlanItem')) {
        if ($scope.control.isHighlighted(element.id)) {
          $scope.control.clearHighlight(element.id);
          $scope.control.removeBadges(element.id);
          $scope.selectedNodes.splice($scope.selectedNodes
            .indexOf(element.id), 1);
          $scope.$apply();
        } else {
          $scope.control.highlight(element.id);
          $scope.control.createBadge(element.id, {
            text : 'Test',
            tooltip : 'This is a tooltip'
          });
          $scope.selectedNodes.push(element.id);
          $scope.$apply();
        }
      }
    };

    $scope.hovering = [];
    $scope.mouseEnter = function(element) {
      $scope.hovering.push(element.id);
      $scope.$apply();
    };
    $scope.mouseLeave = function(element) {
      $scope.hovering.splice($scope.hovering.indexOf(element.id), 1);
      $scope.$apply();
    };

    //Why use debounce, eslint cant compile, bcs debounce is not defined, test and if ok delete this comment
    //    $scope.resetZoom = debounce(function(element) {
    //    	$scope.control.resetZoom();
    //    }, 300);
    $scope.resetZoom = function() {
      $scope.control.resetZoom();
    };

  }]);
  
angular.element(document).ready(function() {
  angular.bootstrap(document.body, [diagramModule.name]);
});