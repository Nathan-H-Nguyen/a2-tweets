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

        if (this.text.includes("Watch my")) {
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

        if (end === -1) {
            end = this.text.length;
        }

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

        if (end === -1) {
            return "";
        }

        start = end + 1;

        return this.text.substring(start);
    }

    get activityType():string {
        if (this.source != 'completed_event') {
            return "unknown";
        }

        const text = this.text.includes(" - ") ? this.text.substring(0, this.text.indexOf(" - ") + 1) : this.text;

        if (text.includes(" run ")) {
            return "run";
        } else if (text.includes(" walk ")) {
            return "walk";
        } else if (text.includes(" bike ")) {
            return "bike";
        } else if (text.includes(" hike ")) {
            return "hike";
        } else if (text.includes(" swim ")) {
            return "swim";
        } else if (text.includes(" elliptical ")) {
            return "elliptical";
        } else if (text.includes(" strength ")) {
            return "strength";
        }  else if (text.includes(" crossfit ")) {
            return "crossfit";
        }  else if (text.includes(" stairmaster ") || this.text.includes(" stepwell ")) {
            return "stair";
        }  else if (text.includes(" circuit ")) {
            return "circuit";
        }  else if (text.includes(" group ")) {
            return "group";
        } else if (text.includes(" workout ")) {
            return "workout";
        } else {
            return "other";
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