define([
  'angular',
  './inline-field/cam-widget-inline-field',
  './search-pill/search-pill',
  './search-pill/cam-query-component',
  '../filter/date/index',
  'angular-bootstrap'
], function(
  angular,
  inlineField,
  searchPill,
  camQueryComponent,
  filtersModule
  ) {
  'use strict';

  var widgetModule = angular.module('camunda.common.widgets', [filtersModule.name, 'ui.bootstrap']);

  widgetModule.directive('camWidgetInlineField', inlineField);
  widgetModule.directive('camWidgetSearchPill', searchPill);
  widgetModule.filter('camQueryComponent', camQueryComponent);

  return widgetModule;
});