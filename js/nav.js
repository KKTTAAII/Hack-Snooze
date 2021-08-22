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
  $favList.hide();
  $newStoryForm.show();
  $newStoryForm.insertBefore($allStoriesList);
  $allStoriesList.show();
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
    $allStoriesList.show();
    $myStoriesList.hide();
  }
}

$navFav.on("click", favoritesClick);

function hackSnoozeClick(evt) {
  console.debug("hackSnoozeClick", evt);
  $newStoryForm.hide();
  if(currentUser){
    checkForFav();
  }
}

$hackSnooze.on("click", hackSnoozeClick);

function myStoriesClick(evt){
  console.debug("myStoriesClick", evt);
  $allStoriesList.hide();
  $myStoriesList.show();
  const userStories = currentUser.ownStories;
  console.log(userStories);
  for (let story of userStories) {
    console.log(story)
    let myStory = generateStoryMarkup(new Story(story));
    $allStoriesList.hide();
    $myStoriesList.empty();
    $myStoriesList.prepend(myStory);
    const stars = $('.star');
    stars.prepend(trashIcon);
  }
  
}

$myStories.on('click', myStoriesClick)