"use strict";

/******************************************************************************
 * Handling navbar clicks and updating navbar
 */

/** Show main list of all stories when click site name */

function navAllStories(evt) {
  console.debug("navAllStories", evt);
  hidePageComponents();
  putStoriesOnPage();
}

$body.on("click", "#nav-all", navAllStories);

/** Show login/signup on click on "login" */

function navLoginClick(evt) {
  console.debug("navLoginClick", evt);
  hidePageComponents();
  $loginForm.show();
  $signupForm.show();
}

$navLogin.on("click", navLoginClick);

/** When a user first logins in, update the navbar to reflect that. */

function updateNavOnLogin() {
  console.debug("updateNavOnLogin");
  $(".main-nav-links").show();
  $navLogin.hide();
  $navLogOut.show();
  $navOptionsBar.show();
  $navUserProfile.text(`${currentUser.username}`).show();
}

function navSubmitNewStoryClick(evt) {
  console.debug("navSubmitNewStoryClick", evt);
  $loginForm.hide();
  $newStoryForm.show();
  $newStoryForm.insertBefore($allStoriesList);
}

$navSubmit.on("click", navSubmitNewStoryClick);

function favoritesClick(evt) {
  console.debug("favoritesClick", evt);
  $allStoriesList.children().hide();
  const userFavorites = currentUser.favorites;
  for (let fav of userFavorites) {
    let favStory = generateStoryMarkup(new Story(fav));
    $allStoriesList.append(favStory);

    checkForFav();
    $newStoryForm.hide();
  }
}

$navFav.on("click", favoritesClick);

function hackSnoozeClick() {
  const components = [$loginForm, $signupForm, $newStoryForm];
  components.forEach((c) => c.hide());
}

$hackSnooze.on("click", hackSnoozeClick);
