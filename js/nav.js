"use strict";

/******************************************************************************
 * Handling navbar clicks and updating navbar
 */

/** Show main list of all stories when click site name */

function navAllStories(evt) {
  console.debug("navAllStories", evt);
  hidePageComponents();
  putStoriesOnPage();
  if (currentUser) {
    $newStoryForm.hide();
    $myStoriesList.hide();
    $favList.hide();
    checkForFav();
  }
  $allStoriesList.show();
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
  $favList.hide();
  $myStoriesList.hide();
  $newStoryForm.show();
  $newStoryForm.insertBefore($allStoriesList);
  $allStoriesList.show();
  $(".trash-can").hide();
}

$navSubmit.on("click", navSubmitNewStoryClick);

function favoritesClick(evt) {
  console.debug("favoritesClick", evt);
  $allStoriesList.hide();
  $newStoryForm.hide();
  $myStoriesList.hide();
  $favList.empty();

  const userFavorites = currentUser.favorites;
  if (userFavorites.length < 1) {
    $($favList).append("<p> No favorites added yet </p>");
  } else {
    for (let fav of userFavorites) {
      let favStory = generateStoryMarkup(new Story(fav));
      $favList.append(favStory);
      checkForFav();
    }
  }

  $favList.show();
}

$navFav.on("click", favoritesClick);

function myStoriesClick(evt) {
  console.debug("myStoriesClick", evt);
  $allStoriesList.hide();
  $favList.hide();
  $newStoryForm.hide();
  $myStoriesList.empty();

  const userStories = currentUser.ownStories;

  if (userStories.length < 1) {
    $($myStoriesList).append("<p> No stories added yet </p>");
  } else {
    for (let story of userStories) {
      let myStory = generateStoryMarkup(story);
      $myStoriesList.prepend(myStory);
    }
  }
  
  checkForFav();
  const stars = $(".star");
  $(trashIcon).insertBefore(".star");
  $myStoriesList.show();
}

$myStories.on("click", myStoriesClick);

