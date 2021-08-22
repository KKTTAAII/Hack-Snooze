"use strict";

const $body = $("body");

const $storiesLoadingMsg = $("#stories-loading-msg");

const $allStoriesList = $("#all-stories-list");
const $favList = $("#favorite-stories-list");
const $myStoriesList = $("#my-stories-list");

const $loginForm = $("#login-form");
const $signupForm = $("#signup-form");
const $newStoryForm = $("#submit-form");

const $navLogin = $("#nav-login");
const $navUserProfile = $("#nav-user-profile");
const $navLogOut = $("#nav-logout");
const $navSubmit = $("#nav-submitStory");
const $navFav = $("#nav-favorites");
const $navOptionsBar = $("#nav-loggedin-options");
const $navUsername = $("#nav-user-profile");
const $navMyStories = $("#nav-my-stories");

const trashIcon =
  '<span class="trash-can"><i class="fas fa-trash-alt"></i></span>';

function hidePageComponents() {
  const components = [$allStoriesList, $loginForm, $signupForm];
  components.forEach((c) => c.hide());
}

async function start() {
  console.debug("start");
  await checkForRememberedUser();
  await getAndShowStoriesOnStart();

  if (currentUser) {
    updateUIOnUserLogin();
    $(".star").show();
  } else {
    $(".star").hide();
  }
}



function checkForFav() {
  const $lis = $("li");
  if (currentUser.favorites[0]) {
    for (let li of $lis) {
      for (let fav of currentUser.favorites) {
        if (li.id === fav.storyId) {
          const span = li.children;
          const i = span[0].children;
          i[0].classList.remove("far");
          i[0].classList.add("fas");
        }
      }
    }
  }
}


console.warn(
  "HEY STUDENT: This program sends many debug messages to" +
    " the console. If you don't see the message 'start' below this, you're not" +
    " seeing those helpful debug messages. In your browser console, click on" +
    " menu 'Default Levels' and add Verbose"
);
$(start);
