'use strict';


// Declare app level module which depends on filters, and services
angular.module('stats', [
  'ngRoute',
  'stats.filters',
  'stats.services',
  'stats.directives',
  'stats.controllers'
]);