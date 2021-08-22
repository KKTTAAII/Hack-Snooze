"use strict";

let storyList;

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();
  putStoriesOnPage();
}

function generateStoryMarkup(story) {
  // console.debug("generateStoryMarkup", story);

  const hostName = story.getHostName();

  return $(`
      <li id="${story.storyId}">
        <span class="star" id="favStar">
          <i class="fa-star far"></i>
        </span>  
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
      </li>
    `);
}

function putStoriesOnPage() {
  console.debug("putStoriesOnPage");

  $allStoriesList.empty();

  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }
  $allStoriesList.show();
}

async function submitNewStory(evt) {
  console.debug("submitNewStory");
  evt.preventDefault();

  const submittedAuthor = $("#author").val();
  const submittedTitle = $("#title").val();
  const submittedUrl = $("#url").val();

  let newStory = await storyList.addStory(currentUser, {
    title: submittedTitle,
    author: submittedAuthor,
    url: submittedUrl,
  });

  let newListOfStory = generateStoryMarkup(newStory);
  $newStoryForm.hide("slow");
  $signupForm.hide();
  $allStoriesList.prepend(newListOfStory);

  currentUser.ownStories.push(newStory);
  storyList.stories.unshift(newStory);

  $("#author").val("");
  $("#title").val("");
  $("#url").val("");
}

$newStoryForm.on("submit", submitNewStory);

async function toggleFavorites(evt) {
  console.debug("toggleFavorites");

  const target = $(evt.target);
  target.toggleClass("far fas");
  const liOfThatTarget = target.closest("li");
  const storyId = liOfThatTarget[0].id;

  if (target.hasClass("fas")) {
    let added = await currentUser.addFavortie(
      storyId, 
      currentUser.username
    );
  } else {
    let deleted = await currentUser.removeFavorite(
      storyId,
      currentUser.username
    );
  }
}

$("ol").on("click", ".fa-star", toggleFavorites);

async function removeStory(evt) {
  console.debug("removeStory");
  const target = $(evt.target);
  const liOfThatTarget = target.closest("li");
  const storyId = liOfThatTarget[0].id;
  const myStories = currentUser.ownStories;

  for (let i = 0; i < myStories.length; i++) {
    if (storyId === myStories[i].storyId) {
      liOfThatTarget.remove();
      myStories.splice(i, 1);
    }
  }

  for (let i = 0; i < storyList.stories.length; i++) {
    if (storyId === storyList.stories[i].storyId) {
      await currentUser.deleteStory(storyList.stories[i].storyId);
      storyList.stories.splice(i, 1);
    }
  }
}

$("ol").on("click", ".trash-can", removeStory);
