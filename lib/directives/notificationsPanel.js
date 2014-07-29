/* global define: false */
define([
  'angular-sanitize'
], function() {
  'use strict';
  /**
   * @name notificationsPanel
   * @memberof cam.common.directives
   * @type angular.directive
   * @description Provides a widget for user notifications
   * @example
      TODO
   */

  var notificationsTemplate =
'<div class="notifications">' +
'  <div ng-repeat="notification in notifications" class="alert" ng-class="notificationClass(notification)">' +
'    <button type="button" class="close" ng-click="removeNotification(notification)">&times;</button>' +
'    <strong class="status">{{ notification.status }}:</strong> ' +
// "ng-bind-html" would explode and "ng-bind-html-unsafe" does not seem to work anymore
// '    <span ng-bind-html-unsafe="notification.message"></span>' +
'    <span class="message">{{ notification.message }}</span>' +
'  </div>' +
'</div>';

  return ['Notifications', '$filter',
  function(Notifications,   $filter) {
    return {
      restrict: 'EA',
      scope: {
        filter: '=notificationsFilter'
      },
      template: notificationsTemplate,
      link: function(scope) {

        var filter = scope.filter;

        function matchesFilter(notification) {
          if (!filter) {
            return true;
          }

          return !!$filter('filter')([ notification ], filter).length;
        }

        var notifications = scope.notifications = [];

        var consumer = {
          add: function(notification) {
            if (matchesFilter(notification)) {
              notifications.push(notification);
              return true;
            } else {
              return false;
            }
          },
          remove: function(notification) {
            var idx = notifications.indexOf(notification);
            if (idx != -1) {
              notifications.splice(idx, 1);
            }
          }
        };

        Notifications.registerConsumer(consumer);

        scope.removeNotification = function(notification) {
          notifications.splice(notifications.indexOf(notification), 1);
        };

        scope.notificationClass = function(notification) {
          var classes = [ 'error', 'success', 'warning', 'information' ];

          var type = 'information';

          if (classes.indexOf(notification.type) != -1) {
            type = notification.type;
          }

          return 'alert-' + type;
        };

        scope.$on('$destroy', function() {
          Notifications.unregisterConsumer(consumer);
        });
      }
    };
  }];
});