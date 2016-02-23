/* FauxBackendModule lets us mock some behavior that would
   otherwise require an actual backend by using localstorage.
   We most certainly do not do ALL of the nice things that an
   actual backend would do, like, for instance, duplicate checking
   on events or users. Or any sort of backend data validation.
   */
var FauxBackendModule = function(global) {
  'use strict';

  var globalAPI,
      _myStorage = global.localStorage;

  /* Constant(likethings) */

  var LOGGED_IN_USER = 'logged-in-user';
  var ALL_USERS = 'user-table';
  var EVENTS = 'all-events';

  /*
    Add some faux data if there's no faux data.
  */
  function _initialize() {
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
    if (_getUsers() === null) {
      _setUsers({ users: [] });
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
    _setEvents(events);
  }

  function addUser(u) {
    var users = _getUsers();
    users.users.push(u);
    _setUsers(users);
  }

  function verifyUser(u) {
    var users = _getUsers().users;
    var verify = false;
    for (var i = 0; i < users.length; i++) {
      if (users[i].email === u.email) {
        if (users[i].password === u.password) {
          verify = true;
        }
        return verify;
      }
    }
    return verify;
  }

  function _getUsers() {
    return JSON.parse(_myStorage.getItem(ALL_USERS));
  }

  function _setUsers(users) {
    _myStorage.setItem(ALL_USERS, JSON.stringify(users));
  }

  globalAPI = {
    getEvents: getEvents,
    addEvent: addEvent,
    addUser: addUser,
    logOutUser: logOutUser,
    getLoggedInUser: getLoggedInUser,
    setLoggedInUser: setLoggedInUser,
    isUserLoggedIn: isUserLoggedIn,
    verifyUser: verifyUser
  };

  _initialize();
  return globalAPI;
};



var ValidationModule = function() {

  'use strict';

  var globalAPI = {};
  var _cache = {};
  // TODO Fill this with replacements for lousy Safari messages
  // (although that could also be responsibility of module user which
  // is why we have setCustomMessages function.)
  var _messages = {};
  var formElements;
  var form;
  var button;

  /*
    Call this method to start the validation module. Gets all of
    the input elements in the form and disables the submit button
    until the inputs all validate using the HTML5 form validation
    API. Validates inputs after the first blur event on the input
    and then on all keyup events after that.
  */
  var initValidation = function(f, b) {
    form = f;
    button = b;
    formElements = form.getElementsByTagName('input');
    button.setAttribute('disabled', 'disabled');
    form.addEventListener('keyup', _validateForm);
    form.addEventListener('blur', function(e) {
      _tripFocus(e.target.id);
      _validateForm(e);
    }, true);
    form.addEventListener('change', function(e) {
      _tripFocus(e.target.id);
      _validateForm(e);
    });
  };

  function setCustomMessages(messages) {
    _messages = messages;
  }

  function _tripFocus(id) {
    if (_cache.hasOwnProperty(id)) {
      _cache[id].haslostfocus = true;
    } else {
      _cache[id] = {};
      _cache[id].haslostfocus = true;
    }
  }

  function _validateForm(e) {
    if (_cache.hasOwnProperty(e.target.id) && _cache[e.target.id].haslostfocus) {
      _setValidityMessage(e.target);
    }
    for (var i = 0; i < formElements.length; i++) {
      if (!formElements[i].classList.contains('novalidate') &&
        !formElements[i].checkValidity()) {
        button.setAttribute('disabled', 'disabled');
        return;
      }
    }
    button.removeAttribute('disabled');
  }

  function _setValidityMessage(inputElement) {
    var errorField = _getErrorElement(inputElement);
    if (!inputElement.checkValidity()) {
      errorField.innerHTML = _getValidityMessage(inputElement);
    } else if (errorField !== null) {
      errorField.innerHTML = '';
    }
  }

  function _getValidityMessage(inputElement) {
    var msg;
    if (_messages.hasOwnProperty(inputElement.validationMessage)) {
      msg = _messages[msg];
    } else {
      msg = inputElement.validationMessage;
    }
    return msg;
  }

  function _getErrorElement(inputNode) {
    var inputNodeId = inputNode.id;
    var errorFieldById = document.getElementById(inputNodeId + '-error');
    if (inputNodeId && errorFieldById !== null) {
      return errorFieldById;
    } else {
      return inputNode.parentNode.querySelector('.error');
    }
  }

  globalAPI = {
    'initValidation': initValidation,
    'setCustomMessages': setCustomMessages
  };

  return globalAPI;
};
