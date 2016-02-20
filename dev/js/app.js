var FauxBackendModule = function(global) {
  'use strict';

  var globalAPI,
      _myStorage = global.localStorage;

  /* Constant(likethings) */

  var LOGGED_IN_USER = 'logged-in-user';
  var EVENTS = 'all-events';

  /*
    Add some faux data if there's no faux data.
  */
  function _initialize() {
    /***

      FIRST LINE IS JUST TO EASE DEVELOPMENT

      DELETE ME WHEN DONE

    ***/
    _myStorage.clear();
    var events = getEvents();
    if (events === null) {
      events = { events: [{
        name: 'Porkfest 2016',
        host: 'Mr. Pig',
        purpose: 'Pork Festival',
        date: {
          startDate: 'March 19, 2016',
          endDate: 'March 22, 2016',
          allDay: true
        },
        location: {
          name: 'Grant Park',
          address: '840 Cherokee Ave SE, Atlanta, GA 30312',
          picture: null
        },
        guests: [],
        message: 'Eat more pork.'
      },
      {
        name: 'Speed Dating',
        host: 'Lowered Expectations',
        purpose: 'Speed Dating',
        date: {
          startDate: 'March 19, 2016',
          startTime: '7:00 PM',
          endDate: 'March 19, 2016',
          endTime: '9:00 PM'
        },
        location: {
          name: 'Community Center',
          address: '123 Fake St., Atlanta, GA 30309',
          picture: null
        },
        guests: ['creepyloner1@gmail.com','creepyloner2@hotmail.com'],
        message: 'Meet people like you. Parking is $5.'
      },
      {
        name: 'Front-End Developer Meetup',
        host: 'Front-End Developer Club',
        purpose: 'Meetup',
        date: {
          startDate: 'March 21, 2016',
          startTime: '8:00 PM',
          endDate: 'March 21, 2016',
          endTime: '10:00 PM'
        },
        location: {
          name: 'Octane Coffee Bar',
          address: '437 Memorial Drive A5, Atlanta, GA 30312'
        },
        guests: ['creepyloner1@gmail.com','creepyloner2@hotmail.com'],
        message: 'We\'ll be in the back room.'
      }]};
      _setEvents(events);
    }
  }

  function _setEvents(events) {
    _myStorage.setItem(EVENTS, JSON.stringify(events));
  }

  function isUserLoggedIn() {
    return (_myStorage.getItem(LOGGED_IN_USER)) ? true : false;
  }

  function setLoggedInUser(user) {
    _myStorage.setItem(LOGGED_IN_USER, JSON.stringify(user));
  }

  function getLoggedInUser() {
    return JSON.parse(_myStorage.getItem(LOGGED_IN_USER));
  }

  function logOutUser() {
    _myStorage.removeItem(LOGGED_IN_USER);
  }

  function getEvents() {
    return JSON.parse(_myStorage.getItem(EVENTS));
  }

  function addEvent(e) {
    var events = getEvents();
    events.events.push(e);
  }

  globalAPI = {
    getEvents: getEvents,
    addEvent: addEvent,
    logOutUser: logOutUser,
    getLoggedInUser: getLoggedInUser,
    setLoggedInUser: setLoggedInUser,
    isUserLoggedIn: isUserLoggedIn
  };

  _initialize();
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
