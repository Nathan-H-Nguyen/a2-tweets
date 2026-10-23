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

        if (!this.text.includes(" - ")) {
            return false;
        }

        return true;
    }

    get writtenText():string {
        if(!this.written) {
            return "";
        }

        const start = this.text.indexOf(" - ") + 3;
        const end = this.text.indexOf(" http", start);

        return this.text.substring(start, end);
    }

    get link():string {
        if (!this.written) {
            return "";
        }

        let start = this.text.indexOf(" - ") + 3;
        let end = this.text.indexOf(" http", start);

        start = end + 1;
        end = this.text.indexOf(" ", start);

        return this.text.substring(start, end);
    }

    get rest():string {
        if (!this.written) {
            return "";
        }

        let start = this.text.indexOf(" - ") + 3;
        let end = this.text.indexOf(" http", start);

        start = end + 1;
        end = this.text.indexOf(" ", start);

        start = end + 1;

        return this.text.substring(start);
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

        let start = 0;

        while (start < this.text.length && !"0123456789".includes(this.text.charAt(start))) {
            start++;
        }

        // No number in tweet, should never happen tho
        if (start === this.text.length) {
            return 0;
        }

        let end = start;
        while (end < this.text.length && "0123456789.".includes(this.text.charAt(end))) {
            end++;
        }

        // Time not distance
        if (this.text.charAt(end) === ':') {
            return 0;
        }

        const res = parseFloat(this.text.substring(start, end));

        if (this.text.substring(end + 1, end + 3) === "km") {
            return res / 1.609;
        }

        return res;
    }

    getHTMLTableRow(rowNumber:number):string {
        return `
            <tr>
                <td>${rowNumber}</td>
                <td>${this.activityType}</td>
                <td>${this.writtenText} <a href="${this.link}" target="_blank">${this.link}</a> ${this.rest}</td>
            </tr>
        `;
    }
}