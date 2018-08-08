import React, { Component } from 'react';
import rebase from "re-base";
import firebase from "@firebase/app";
import "@firebase/database";


import Story from "./components/Story"

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

function getItemLink(id) {
  return `https://news.ycombinator.com/item?id=${id}`;
}

//components
function fetchNewsStory(id, idx) {
  const rank = idx + 1;
  return new Promise(resolve => {
    apiService.fetch(`/item/${id}`, {
      then(data) {
        let item = data;
        item.userURL = getUserLink(item.by);
        item.itemLink = getItemLink(item.id);
        item.rank = rank;
        item.comments = item.kids ? item.kids.length : 0;
        resolve(item);
      }
    });
  });
}

class App extends Component {
  state = {
    allStories: [],
    stories: [],
    startIndex: 0,
    endIndex: 0
  };

  fetchStoriesPerPage() {
    let storyIds = this.state.allStories;
    let actions = storyIds.slice(this.state.startIndex, this.state.endIndex).map(fetchNewsStory);
    let results = Promise.all(actions);
    results.then(data => this.setState({ stories: data }));
  }
  
  handleClick() {
    let lastIndex = this.state.endIndex + 20;
    this.setState({ endIndex: lastIndex }, () => this.fetchStoriesPerPage());
  }

  componentDidMount() {
    apiService.fetch(`/topstories`, {
      context: this,
      then(res) {
        this.setState({ allStories: res, startIndex: 0, endIndex: 20 })
        this.fetchStoriesPerPage();
      }
    });
  }

  render() {

    return (
      <div className="wrap">
        <div className="app-header">
          <div className="app-logo">
            <span>HN</span>
          </div>
        </div>
        <div className="app-body">
          <Story storyItems={this.state.stories} />
          {this.state.stories.length > 0 &&
            <div className="btn-container">
              <button className="btn-load" onClick={() => {this.handleClick()}}>Load More</button>
            </div>
          }
        </div>
        <div className="appFooter">
        </div>
      </div>
    );
  }
}

export default App;
