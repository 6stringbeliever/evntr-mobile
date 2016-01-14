var FauxBackendModule = function(global) {
  'use strict';

  var globalAPI = {},
      _myStorage = global.localStorage;

  /* Constant(likethings) */

  var LOGGED_IN_USER = 'logged-in-user';
  var EVENTS = 'all-events';

  globalAPI.isUserLoggedIn = function() {
    return (_myStorage.getItem(LOGGED_IN_USER)) ? true : false;
  };

  globalAPI.setLoggedInUser = function(user) {
    _myStorage.setItem(LOGGED_IN_USER, JSON.stringify(user));
  };

  globalAPI.getLoggedInUser = function() {
    return JSON.parse(_myStorage.getItem(LOGGED_IN_USER));
  };

  globalAPI.logOutUser = function() {
    _myStorage.removeItem(LOGGED_IN_USER);
  };

  globalAPI.addEvent = function(e) {
    var events = this.getEvents();
    events.push(e);
  };

  globalAPI.getEvents = function() {
    return JSON.parse(_myStorage.getItem(EVENTS));
  };

  return globalAPI;
};
