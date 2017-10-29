require('isomorphic-fetch')
import { ItemsList, ListItem, ItemTitle, ItemMeta, ItemBy, 
	ItemHost, ItemScore, ItemTime, ItemKids } from './src/Items';

/*
The official Firebase API (https://github.com/HackerNews/API) requires multiple network
connections to be made in order to fetch the list of Top Stories (indices) and then the
summary content of these stories. Directly requesting these resources makes server-side
rendering cumbersome as it is slow and ultimately requires that you maintain your own 
cache to ensure full server renders are efficient. 

To work around this problem, we can use one of the unofficial Hacker News APIs, specifically
https://github.com/cheeaun/node-hnapi which directly returns the Top Stories and can cache 
responses for 10 minutes. In ReactHN, we can use the unofficial API for a static server-side
render and then 'hydrate' this once our components have mounted to display the real-time 
experience. 

The benefit of this is clients loading up the app that are on flakey networks (or lie-fi)
can still get a fast render of content before the rest of our JavaScript bundle is loaded.
 */

/**
 * Fetch top stories
 */
exports.fetchNews = function(page) {
	page = page || ''
	return fetch('http://node-hnapi.herokuapp.com/news' + page).then(function(response) {
	  return response.json()
	}).then(function(json) {
	  var stories = '<ItemsList start="1">'
	  json.forEach(function(data, index) {
	      var story = '<ListItem style="margin-bottom: 16px;">' +
	          '<ItemTitle style="font-size: 18px;"><a href="' + data.url + '">' + data.title + '</a> ' +
	          '<ItemHost>(' + data.domain + ')</ItemHost></ItemTitle>' +
	          '<ItemMeta><ItemScore>' + data.points + ' points</ItemScore> ' +
	          '<ItemBy>by <a href="https://news.ycombinator.com/user?id=' + data.user + '">' + data.user + '</a></ItemBy> ' +
	          '<ItemTime>' + data.time_ago + ' </ItemTime> | ' +
	          '<a href="/news/story/' + data.id + '">' + data.comments_count + ' comments</a></ItemMeta>'
	      '</ListItem>'
	      stories += story
	  })
	  stories += '</ItemsList>'
	  return stories
	})		
}

function renderNestedComment(data) {
	return '<div class="Comment__kids">' +
		        '<div class="Comment Comment--level1">' +
		            '<div class="Comment__content">' +
		                '<div class="Comment__meta"><span class="Comment__collapse" tabindex="0">[–]</span> ' +
		                    '<a class="Comment__user" href="#/user/' + data.user + '">' + data.user + '</a> ' +
		                    '<time>' + data.time_ago + '</time> ' +
		                    '<a href="#/comment/' + data.id + '">link</a></div> ' +
		                '<div class="Comment__text">' +
		                    '<div>' + data.content +'</div> ' +
		                    '<p><a href="https://news.ycombinator.com/reply?id=' + data.id + '">reply</a></p>' +
		                '</div>' +
		            '</div>' +
		        '</div>' +
		    '</div>'
}

function generateNestedCommentString(data) {
	var output = ''
	data.comments.forEach(function(comment) {
		output+= renderNestedComment(comment)
		if (comment.comments) {
			output+= generateNestedCommentString(comment)
		} 
	})
	return output
}

/**
 * Fetch details of the story/post/item with (nested) comments
 * TODO: Add article summary at top of nested comment thread
 */
exports.fetchItem = function(itemId) {
	return fetch('https://node-hnapi.herokuapp.com/item/' + itemId).then(function(response) {
		return response.json()
	}).then(function(json) {
		var comments = ''
		json.comments.forEach(function(data, index) {
			var comment = '<ItemKids>' + 
			'<div class="Comment Comment--level0">' +
		    '<div class="Comment__content">' +
		        '<div class="Comment__meta"><span class="Comment__collapse" tabindex="0">[–]</span> ' +
		            '<a class="Comment__user" href="#/user/' + data.user + '">' + data.user + '</a> ' +
		            '<time>' + data.time_ago + '</time> ' +
		            '<a href="#/comment/' + data.id + '">link</a></div> ' +
		        '<div class="Comment__text">' +
		            '<div>' + data.content +'</div> ' + 
		            '<p><a href="https://news.ycombinator.com/reply?id=' + data.id + '">reply</a></p>' +
		        '</div>' +
		    '</div>' +
		   '</ItemKids>'
			comments += generateNestedCommentString(data) + '</div>' + comment
		})
		return comments
	})
}