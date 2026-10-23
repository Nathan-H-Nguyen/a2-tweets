class Tweet {
	private text:string;
	time:Date;

	constructor(tweet_text:string, tweet_time:string) {
        this.text = tweet_text;
		this.time = new Date(tweet_time);//, "ddd MMM D HH:mm:ss Z YYYY"
	}

	//returns either 'live_event', 'achievement', 'completed_event', or 'miscellaneous'
    get source():string {
        if (this.text.includes("completed") || this.text.includes("posted")) {
            return "completed_event";
        }

        if (this.text.includes("Watch")) {
            return "live_event";
        }

        if (this.text.includes("Achieved")) {
            return "achievement";
        }

        return "miscellaneous";
    }

    //returns a boolean, whether the text includes any content written by the person tweeting.
    get written():boolean {
        if (!(this.text.includes("completed") || this.text.includes("posted"))) {
            return false;
        }

        if (!this.text.includes("-")) {
            return false;
        }

        return true;
    }

    get writtenText():string {
        if(!this.written) {
            return "";
        }
        //TODO: parse the written text from the tweet
        return "";
    }

    get activityType():string {
        if (this.source != 'completed_event') {
            return "unknown";
        }
        
        if (this.text.includes(" run ")) {
            return "run";
        } else if (this.text.includes(" walk ")) {
            return "walk";
        } else if (this.text.includes(" bike ")) {
            return "bike";
        } else if (this.text.includes(" hike ")) {
            return "hike";
        } else if (this.text.includes(" swim ")) {
            return "swim";
        } else if (this.text.includes(" workout ")) {
            return "workout";
        } else {
            return "unknown";
        }
    }

    get distance():number {
        if(this.source != 'completed_event') {
            return 0;
        }

        // First character after "Just completed a "
        const start = 17;

        if (!"0123456789".includes(this.text.charAt(17))) {
            return 0;
        }

        var end = start;
        while (this.text.charAt(end) !== ' ') {
            end++;
        }

        var res = parseFloat(this.text.substring(start, end));

        if (this.text.substring(end, end+2) === "km") {
            res /= 1.609;
        }

        return res;
    }

    getHTMLTableRow(rowNumber:number):string {
        //TODO: return a table row which summarizes the tweet with a clickable link to the RunKeeper activity
        return "<tr></tr>";
    }
}