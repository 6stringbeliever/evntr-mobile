var ValidationModule = function() {

  'use strict';

  var globalAPI = {};
  var _cache = {};
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
