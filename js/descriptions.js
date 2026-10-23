function parseTweets(runkeeper_tweets) {
	//Do not proceed if no tweets loaded
	if(runkeeper_tweets === undefined) {
		window.alert('No tweets returned');
		return;
	}

	//TODO: Filter to just the written tweets
	tweet_array = runkeeper_tweets.map(function(tweet) {
		return new Tweet(tweet.text, tweet.created_at);
	});

	written_tweets = tweet_array.filter(item => item.written)
}

function addEventHandlerForSearch() {
	//TODO: Search the written tweets as text is entered into the search box, and add them to the table
	const input = document.getElementById("textFilter");
	const table = document.getElementById("tweetTable");
	const search_count = document.getElementById("searchCount");
	const search_text = document.getElementById("searchText");

	// On page load set to 0 since no input
	search_count.innerText = 0;
	search_text.innerText = "";

	input.addEventListener("input", () => {
		search_text.innerText = input.value;

		if (input.value === "") {
			table.innerHTML = "";
			search_count.innerText = 0;
			return;
		}

		const matches = written_tweets.filter(item => item.writtenText.toLowerCase().includes(input.value.toLowerCase()));

		search_count.innerText = matches.length;
		table.innerHTML = matches.map((item, i) => item.getHTMLTableRow(i+1)).join("");
	})
}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	addEventHandlerForSearch();
	loadSavedRunkeeperTweets().then(parseTweets);
});