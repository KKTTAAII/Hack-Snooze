"use strict";

function navAllStories(evt) {
  console.debug("navAllStories", evt);
  hidePageComponents();
  putStoriesOnPage();
  if (currentUser) {
    $(".username-section-container").hide();
    $newStoryForm.hide();
    $myStoriesList.hide();
    $favList.hide();
    checkForFav();
  }
  $allStoriesList.show();
}

$body.on("click", "#nav-all", navAllStories);

function navLoginClick(evt) {
  console.debug("navLoginClick", evt);
  hidePageComponents();
  $loginForm.show();
  $signupForm.show();
}

$navLogin.on("click", navLoginClick);


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
  $(".username-section-container").hide();
  $loginForm.hide();
  $favList.hide();
  $myStoriesList.hide();
  $newStoryForm.show();
  $newStoryForm.insertBefore($allStoriesList);
  $allStoriesList.show();
  $(".trash-can").hide();
}

$navSubmit.on("click", navSubmitNewStoryClick);



function navFavoritesClick(evt) {
  console.debug("favoritesClick", evt);
  $(".username-section-container").hide();
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

$navFav.on("click", navFavoritesClick);



function navMyStoriesClick(evt) {
  console.debug("myStoriesClick", evt);
  $(".username-section-container").hide();
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

$navMyStories.on("click", navMyStoriesClick);



function navUsername(evt) {
  console.debug("navUsername", evt);
  hidePageComponents();
  $newStoryForm.hide();
  $favList.hide();
  $myStoriesList.hide();
  $(".username-section-container").empty();
  $body.append(`
  <section class="username-section-container container">
  <div class="profile-container">
    <h4 class="header">User Profile Info</h4>
    <section>
     <div class="info" id="name">
      Name:
      <span>${currentUser.name}</span>
     </div>
     <div class="info" id="username">
      Username:
      <span>${currentUser.username}</span>
     </div>
     <div class="info" id="account date">
      Account Created:
      <span>${currentUser.createdAt}</span>
     </div>
    </section> 
  </div>  
  </section>`);
}

$navUsername.on("click", navUsername);
