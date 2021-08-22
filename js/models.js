"use strict";

const BASE_URL = "https://hack-or-snooze-v3.herokuapp.com";
const DELETE_URL =
  "https://private-anon-5022fdbd4d-hackorsnoozev3.apiary-proxy.com/stories/";

class Story {
  constructor({ storyId, title, author, url, username, createdAt }) {
    this.storyId = storyId;
    this.title = title;
    this.author = author;
    this.url = url;
    this.username = username;
    this.createdAt = createdAt;
  }

  getHostName() {
    const url = this.url;
    let name = new URL(url);
    return name.hostname;
  }
}

class StoryList {
  constructor(stories) {
    this.stories = stories;
  }

  static async getStories() {
    // Note presence of `static` keyword: this indicates that getStories is
    //  **not** an instance method. Rather, it is a method that is called on the
    //  class directly. Why doesn't it make sense for getStories to be an
    //  instance method?

    const response = await axios({
      url: `${BASE_URL}/stories`,
      method: "GET",
    });

    const stories = response.data.stories.map((story) => new Story(story));

    return new StoryList(stories);
  }

  async addStory(user, newStory) {
    const response = await axios({
      url: `${BASE_URL}/stories`,
      method: "POST",
      data: {
        token: user.loginToken,
        story: {
          title: newStory.title,
          author: newStory.author,
          url: newStory.url,
        },
      },
    });

    let { story } = response.data;

    return new Story({
      storyId: story.storyId,
      title: story.title,
      author: story.author,
      url: story.url,
      username: user.username,
      createdAt: story.createdAt,
    });
  }
}


class User {
  constructor(
    { username, name, createdAt, favorites = [], ownStories = [] },
    token
  ) {
    this.username = username;
    this.name = name;
    this.createdAt = createdAt;

    this.favorites = favorites.map((s) => new Story(s));
    this.ownStories = ownStories.map((s) => new Story(s));

    this.loginToken = token;
  }

  static async signup(username, password, name) {
    const response = await axios({
      url: `${BASE_URL}/signup`,
      method: "POST",
      data: { user: { username, password, name } },
    });

    let { user } = response.data;

    return new User(
      {
        username: user.username,
        name: user.name,
        createdAt: user.createdAt,
        favorites: user.favorites,
        ownStories: user.stories,
      },
      response.data.token
    );
  }

  static async login(username, password) {
    const response = await axios({
      url: `${BASE_URL}/login`,
      method: "POST",
      data: { user: { username, password } },
    });

    let { user } = response.data;

    return new User(
      {
        username: user.username,
        name: user.name,
        createdAt: user.createdAt,
        favorites: user.favorites,
        ownStories: user.stories,
      },
      response.data.token
    );
  }

  static async loginViaStoredCredentials(token, username) {
    try {
      const response = await axios({
        url: `${BASE_URL}/users/${username}`,
        method: "GET",
        params: { token },
      });

      let { user } = response.data;

      return new User(
        {
          username: user.username,
          name: user.name,
          createdAt: user.createdAt,
          favorites: user.favorites,
          ownStories: user.stories,
        },
        token
      );
    } catch (err) {
      console.error("loginViaStoredCredentials failed", err);
      return null;
    }
  }

  async addFavortie(storyId, username) {
    const response = await axios({
      url: `${BASE_URL}/users/${username}/favorites/${storyId}`,
      method: "POST",
      data: {
        token: this.loginToken,
      },
    });

    const favorite = response.data.user.favorites;
    this.favorites = favorite;
    return favorite;
  }

  async removeFavorite(storyId, username) {
    const response = await axios({
      url: `${BASE_URL}/users/${username}/favorites/${storyId}`,
      method: "DELETE",
      data: {
        token: this.loginToken,
      },
    });

    const favorite = response.data.user.favorites;
    this.favorites = favorite;
    return favorite;
  }

  async deleteStory(storyId) {
    const response = await axios({
      url: `${DELETE_URL}/${storyId}`,
      method: "DELETE",
      data: {
        token: this.loginToken,
      },
    });
  }
}
