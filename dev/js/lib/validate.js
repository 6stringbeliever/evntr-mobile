var ValidationModule = function() {

  'use strict';

  var globalAPI = {};
  var _cache = {};
  var _messages = {};
  var _formElements;
  var _form;
  var _button;

  /*
    Call this method to start the validation module. Gets all of
    the input elements in the form and disables the submit button
    until the inputs all validate using the HTML5 form validation
    API. Validates inputs after the first blur event on the input
    and then on all keyup events after that.

    If HTML5 validation is not supported, nothing happens.
  */
  var initValidation = function(f, b) {
    if (HTMLInputElement.prototype.checkValidity) {
      _form = f;
      _button = b;
      _formElements = _form.elements;
      _button.setAttribute('disabled', 'disabled');
      _form.addEventListener('keyup', _validateForm);
      _form.addEventListener('blur', _tripAndValidate, true);
      _form.addEventListener('change', _tripAndValidate);
      // Let's you call a custom event to validate a field on demand
      _form.addEventListener('requestValidation', _tripAndValidate);
    }
  };

  /*
    Replace the default HTML5 error messages with something
    nicer, if you please. Takes an object in the format of
    { 'html5 message': 'message you want to use instead'}
  */
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

  function _tripAndValidate(e) {
    _tripFocus(e.target.id);
    _validateForm(e);
  }

  function _validateForm(e) {
    if (_cache.hasOwnProperty(e.target.id) && _cache[e.target.id].haslostfocus) {
      _setValidityMessage(e.target);
    }
    for (var i = 0; i < _formElements.length; i++) {
      if (!_formElements[i].classList.contains('novalidate') &&
        !_formElements[i].checkValidity()) {
        _button.setAttribute('disabled', 'disabled');
        return;
      }
    }
    _button.removeAttribute('disabled');
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
