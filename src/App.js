import React, { Component } from 'react';
import rebase from "re-base";
import firebase from "@firebase/app";
import "@firebase/database";

//initialize db
firebase.initializeApp({ databaseURL: "https://hacker-news.firebaseio.com" });
let db = firebase.database();
const api = rebase.createClass(db);

//data fetch service
const apiService = {
  fetch(endpoint, options) {
    return api.fetch(`/v0${endpoint}`, options);
  }
};

//helpers
function getUserLink(uname) {
  return `https://news.ycombinator.com/user?id=${uname}`;
}

//components
function fetchNewsStory(id, idx) {
  const rank = idx + 1;
  return new Promise(resolve => {
    apiService.fetch(`/item/${id}`, {
      then(data) {
        let item = data;
        item.userURL = getUserLink(item.by);
        item.rank = rank;
        item.comments = item.kids ? item.kids.length : 0;
        resolve(item);
      }
    });
  });
}

class App extends Component {
  state = {
    stories: []
  };

  fetchStoryIds() {
    return apiService.fetch(`/topstories`, {
      context: this,
      then(res) {
        let actions = res.slice(0, 20).map(fetchNewsStory);
        let results = Promise.all(actions);
        results.then(data => this.setState({ stories: data }));
      }
    });
  }

  componentDidMount() {
    this.fetchStoryIds();
  }

  render() {
    return (
      <div className="app">
        <header className="app-header">

        </header>
        <main className="app-body">
          <div className="list-wrapper">
            {this.state.stories.map((story) =>
              <div key={story.id} className="story-wrapper">
                <div className="story-header">
                  <span>{story.rank}</span>
                  <a href={story.url}>{story.title}</a>
                </div>
                <div className="story-footer">
                  <span>{story.score}</span>
                  <span>by <a href={story.userURL}>{story.by}</a></span>
                  <span>{new Date(story.time * 1000).toDateString()}</span>
                  <span><a href={story.url}>{story.comments} comments</a></span>
                </div>
              </div>
            )}
          </div>
        </main>
        <footer className="appFooter">
  
        </footer>
      </div>
    );
  }
}

export default App;
