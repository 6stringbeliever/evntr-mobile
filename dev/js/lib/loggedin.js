/*
  Module to set a class on the html root if a user is logged in. Pass
  in the root element, a function to call to verify if a user is logged
  in and an optional class name to apply to the root element.
*/
var LoggedIn = function(root, loggedIn, clin, clout) {

  var isLoggedIn;
  var clInName = clin || 'logged-in';
  var clOutName = clout || 'logged-out';
  update();

  function update() {
    isLoggedIn = loggedIn();
    if (isLoggedIn) {
      root.classList.add(clInName);
      root.classList.remove(clOutName);
    } else {
      root.classList.add(clOutName);
      root.classList.remove(clInName);
    }
  }

  return { update: update };
};

var LogoutButton = function(lobtn, backend, loginmodule) {
  lobtn.addEventListener('click', function(e) {
    backend.logOutUser();
    loginmodule.update();
    e.preventDefault();
  });
};
