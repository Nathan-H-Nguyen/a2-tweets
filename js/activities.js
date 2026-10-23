function parseTweets(runkeeper_tweets) {
	//Do not proceed if no tweets loaded
	if(runkeeper_tweets === undefined) {
		window.alert('No tweets returned');
		return;
	}
	
	tweet_array = runkeeper_tweets.map(function(tweet) {
		return new Tweet(tweet.text, tweet.created_at);
	});

	// Determining activity type and distance
	const distinct_activities = new Set();
	for (const tweet of tweet_array) {
		distinct_activities.add(tweet.activityType)
	}

	document.getElementById("numberActivities").innerText = distinct_activities.size

	const count = {};
	for (const tweet of tweet_array) {
		count[tweet.activityType] = (count[tweet.activityType] || 0) + 1;
	}

	const topThreeActivities = Object.entries(count).sort((a, b) => b[1] - a[1]).slice(0, 3);

	document.getElementById("firstMost").innerText = topThreeActivities[0][0];
	document.getElementById("secondMost").innerText = topThreeActivities[1][0];
	document.getElementById("thirdMost").innerText = topThreeActivities[2][0];

	shortest_distance = Infinity;
	shortest_activity = "";
	longest_distance = -Infinity;
	longest_activity = "";

	for (const tweet of tweet_array) {
		activity = tweet.activityType;
		distance = tweet.distance

		if (activity === topThreeActivities[0][0] || activity === topThreeActivities[1][0] || activity === topThreeActivities[2][0]) {
			if (distance < shortest_distance) {
				shortest_distance = distance;
				shortest_activity = activity;
			}

			if (distance > longest_distance) {
				longest_distance = distance;
				longest_activity = activity;
			}
		}
	}

	document.getElementById("longestActivityType").innerText = longest_activity;
	document.getElementById("shortestActivityType").innerText = shortest_activity;


	weekend_count = 0;
	weekend_sum = 0;
	weekday_count = 0;
	weekday_sum = 0;

	for (const tweet of tweet_array) {
		if (tweet.time.getDay() == 0 || tweet.time.getDay() == 6) {
			weekend_count++;
			weekend_sum += tweet.distance;
		} else {
			weekday_count++;
			weekday_sum += tweet.distance;
		}
	}

	document.getElementById("weekdayOrWeekendLonger").innerText = (weekend_sum / weekend_count) > (weekday_sum / weekday_count) ? "weekends" : "weekdays";



	//TODO: create a new array or manipulate tweet_array to create a graph of the number of tweets containing each type of activity.

	activity_vis_spec = {
	  "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
	  "description": "A graph of the number of Tweets containing each type of activity.",
	  "data": {
	    "values": tweet_array
	  }
	  //TODO: Add mark and encoding
	};
	vegaEmbed('#activityVis', activity_vis_spec, {actions:false});

	//TODO: create the visualizations which group the three most-tweeted activities by the day of the week.
	//Use those visualizations to answer the questions about which activities tended to be longest and when.
}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	loadSavedRunkeeperTweets().then(parseTweets);
});