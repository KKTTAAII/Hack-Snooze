"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();

  putStoriesOnPage();
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */

function generateStoryMarkup(story) {
  // console.debug("generateStoryMarkup", story);

  const hostName = story.getHostName();
  return $(`
      <li id="${story.storyId}">
        <span class="star">
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

/** Gets list of stories from server, generates their HTML, and puts on page. */

function putStoriesOnPage() {
  console.debug("putStoriesOnPage");

  $allStoriesList.empty();

  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }

  $allStoriesList.show();
}

async function submitNewStory(evt){
  console.debug("submitNewStory");
  evt.preventDefault();
  const submittedAuthor = $('#author').val();
  const submittedTitle = $('#title').val();
  const submittedUrl = $('#url').val();
  
  let newStory = await storyList.addStory(currentUser,
    {title: submittedTitle, author: submittedAuthor, url: submittedUrl});
  let newListOfStory = generateStoryMarkup(newStory);
  $newStoryForm.hide('slow');
  $signupForm.hide();
  $allStoriesList.prepend(newListOfStory);

  $('#author').val('');
  $('#title').val('');
  $('#url').val('');
}

$newStoryForm.on("submit", submitNewStory);

function toggleFavorites(evt){
  console.debug("toggleFavorites");
  const target = $(evt.target);
  target.toggleClass("fillBackground");
}

