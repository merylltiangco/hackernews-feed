import React, { Component } from "react";
import FontAwesome from "react-fontawesome";

export default class Story extends Component{
    render(){
       const items = this.props.storyItems;
       if(items.length > 0){
        return(
            <div className="list-wrapper">
            {items.map((story) =>
              <div key={story.id} className="story-wrapper">
                <div className="story-header">
                  <div>{story.rank}.</div>
                  <a href={story.url}>{story.title}</a>
                </div>
                <div className="story-footer">
                  <div><FontAwesome name="star"/>{story.score} </div>
                  <div><FontAwesome name="user"/><a href={story.userURL}>{story.by}</a></div>
                  <div><FontAwesome name="clock-o"/>{new Date(story.time * 1000).toDateString()}</div>
                  <div><FontAwesome name="comments"/><a href={story.itemLink}>{story.comments} comments</a></div>
                </div>
              </div>
            )}
          </div>
           );
       }else{
           return(
               <div className="loader">
                <FontAwesome name="cog" spin/>
               </div>
           );
       }
    }
}