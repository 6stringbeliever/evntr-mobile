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



var ValidationModule = function() {

  'use strict';

  var globalAPI = {};
  var _cache = {};
  var _messages = {};

  var initValidation = function(form, button) {
    var formElements = form.getElementsByTagName('input');
    button.setAttribute('disabled', 'disabled');
    form.addEventListener('keyup', function(e) {
      if (_cache.hasOwnProperty(e.target.id) && _cache[e.target.id].haslostfocus) {
        _setValidityMessage(e.target);
      }
      for (var i = 0; i < formElements.length; i++) {
        if (!formElements[i].checkValidity()) {
          button.setAttribute('disabled', 'disabled');
          return;
        }
      }
      button.removeAttribute('disabled');
    });
    form.addEventListener('blur', function(e) {
      _setValidityMessage(e.target);
      if (_cache.hasOwnProperty(e.target.id)) {
        _cache[e.target.id].haslostfocus = true;
      } else {
        _cache[e.target.id] = {};
        _cache[e.target.id].haslostfocus = true;
      }
    }, true);
  };

  var setCustomMessages = function(messages) {
    _messages = messages;
  };

  var _setValidityMessage = function(inputElement) {
    var errorField = _getErrorElement(inputElement);
    if (!inputElement.checkValidity()) {
      errorField.innerHTML = _getValidityMessage(inputElement);
    } else if (errorField !== null) {
      errorField.innerHTML = '';
    }
  };

  var _getValidityMessage = function(inputElement) {
    var msg;
    if (_messages.hasOwnProperty(inputElement.validationMessage)) {
      msg = _messages[msg];
    } else {
      msg = inputElement.validationMessage;
    }
    return msg;
  };

  var _getErrorElement = function(inputNode) {
    var inputNodeId = inputNode.id;
    var errorFieldById = document.getElementById(inputNodeId + '-error');
    if (inputNodeId && errorFieldById !== null) {
      return errorFieldById;
    } else {
      return inputNode.parentNode.querySelector('.error');
    }
  };

  globalAPI = {
    'initValidation': initValidation,
    'setCustomMessages': setCustomMessages
  };

  return globalAPI;
};
