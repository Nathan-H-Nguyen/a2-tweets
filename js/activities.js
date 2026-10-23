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

	const top_three_activities = Object.entries(count).sort((a, b) => b[1] - a[1]).slice(0, 3);

	document.getElementById("firstMost").innerText = top_three_activities[0][0];
	document.getElementById("secondMost").innerText = top_three_activities[1][0];
	document.getElementById("thirdMost").innerText = top_three_activities[2][0];

	shortest_distance = Infinity;
	shortest_activity = "";
	longest_distance = -Infinity;
	longest_activity = "";

	for (const tweet of tweet_array) {
		activity = tweet.activityType;
		distance = tweet.distance

		if (activity === top_three_activities[0][0] || activity === top_three_activities[1][0] || activity === top_three_activities[2][0]) {
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
	activity_data = tweet_array.map(item => ({ activityType: item.activityType, distance: item.distance, time: item.time}));
	const top_types = top_three_activities.map(([type]) => type);
	const top_three_data = activity_data.filter((item => top_types.includes(item.activityType)));

	activity_vis_spec = {
	  "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
	  "description": "A graph of the number of Tweets containing each type of activity.",
	  "data": {
	    "values": activity_data
	  },
	  "mark": "bar",
	  "encoding": {
		"x": {"field": "activityType", "type": "nominal", "sort": "-y", "title": "Activity"},
		"y": {"aggregate": "count", "type": "quantitative", "title": "Number of Tweets", "scale": { "domainMax": Math.ceil(Math.max(...Object.values(count)) * 1.1)}}
	  }
	};
	vegaEmbed('#activityVis', activity_vis_spec, {actions:false});

	//TODO: create the visualizations which group the three most-tweeted activities by the day of the week.
	distance_vis_spec = {
	  "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
	  "description": "A graph of the distances of the top three activities by days of the week.",
	  "data": {
	    "values": top_three_data
	  },
	  "mark": "point",
	  "encoding": {
		"x": {"field": "time", "timeUnit": "day", "type": "ordinal", "title": "time (day)"},
		"y": {"field": "distance", "type": "quantitative", "title": "distance"},
		"color": {"field": "activityType", "type": "nominal", "title": "Activity"}
	  }
	};
	vegaEmbed('#distanceVis', distance_vis_spec, {actions:false});

	distance_vis_aggregated_spec = {
	  "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
	  "description": "A graph of the mean distances of the top three activities by days of the week.",
	  "data": {
	    "values": top_three_data
	  },
	  "mark": "point",
	  "encoding": {
		"x": {"field": "time", "timeUnit": "day", "type": "ordinal", "title": "time (day)"},
		"y": {"field": "distance", "type": "quantitative", "title": "Mean of distance", "aggregate": "mean"},
		"color": {"field": "activityType", "type": "nominal", "title": "Activity"}
	  }
	};
	vegaEmbed('#distanceVisAggregated', distance_vis_aggregated_spec, {actions:false});

	//Use those visualizations to answer the questions about which activities tended to be longest and when.
	// bruh just now seeing this and I already did it above manually

	distanceVisAggregated = document.getElementById("distanceVisAggregated");
	distanceVis = document.getElementById("distanceVis");

	distanceVisAggregated.style.display = "none";

	document.getElementById("aggregate").addEventListener("click", () => {
		distanceVis.style.display = distanceVisAggregated.style.display === "none" ? "none" : "";
		distanceVisAggregated.style.display = distanceVisAggregated.style.display === "none" ? "" : "none";
		document.getElementById("aggregate").innerText = distanceVisAggregated.style.display === "none" ? "Show all activities" : "Show means";
	});
}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	loadSavedRunkeeperTweets().then(parseTweets);
});