function parseTweets(runkeeper_tweets) {
	//Do not proceed if no tweets loaded
	if(runkeeper_tweets === undefined) {
		window.alert('No tweets returned');
		return;
	}

	// Tweet Count
	tweet_array = runkeeper_tweets.map(function(tweet) {
		return new Tweet(tweet.text, tweet.created_at);
	});

	//This line modifies the DOM, searching for the tag with the numberTweets ID and updating the text.
	//It works correctly, your task is to update the text of the other tags in the HTML file!
	document.getElementById('numberTweets').innerText = tweet_array.length;

	// Tweet Dates
	const dates = tweet_array.map(tweet => tweet.time);
	const first_date = new Date(Math.min(...dates));
	const last_date = new Date(Math.max(...dates));

	const options = {
		weekday: "long",
		year: "numeric",
		month: "long",
		day: "numeric",
	}

	document.getElementById('firstDate').innerText = first_date.toLocaleDateString("en-US", options);
	document.getElementById('lastDate').innerText = last_date.toLocaleDateString("en-US", options);

	// Tweet Categories
	const categories = tweet_array.map(tweet => tweet.source);
	const completed_event = categories.filter(item => item === "completed_event").length;
	const live_event = categories.filter(item => item === "live_event").length;
	const achievement = categories.filter(item => item === "achievement").length;
	const miscellaneous = categories.filter(item => item === "miscellaneous").length;

	document.getElementsByClassName("completedEvents")[0].innerText = completed_event;
	document.getElementsByClassName("completedEventsPct")[0].innerText = ((completed_event / tweet_array.length)*100).toFixed(2) + "%";

	document.getElementsByClassName("liveEvents")[0].innerText = live_event;
	document.getElementsByClassName("liveEventsPct")[0].innerText = ((live_event / tweet_array.length)*100).toFixed(2) + "%";

	document.getElementsByClassName("achievements")[0].innerText = achievement;
	document.getElementsByClassName("achievementsPct")[0].innerText = ((achievement / tweet_array.length)*100).toFixed(2) + "%";

	document.getElementsByClassName("miscellaneous")[0].innerText = miscellaneous;
	document.getElementsByClassName("miscellaneousPct")[0].innerText = ((miscellaneous / tweet_array.length)*100).toFixed(2) + "%";

	// User-written Tweet
	const user_written = tweet_array.map(tweet => tweet.written);
	const user_written_count = user_written.filter(item => item).length;

	document.getElementsByClassName("completedEvents")[1].innerText = completed_event;
	document.getElementsByClassName("written")[0].innerText = user_written_count;
	document.getElementsByClassName("writtenPct")[0].innerText = ((user_written_count / completed_event)*100).toFixed(2) + "%";

}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	loadSavedRunkeeperTweets().then(parseTweets);
});