const START_DELAY = 0.15;
const UPDATE_FREQUENCY = 0.2;
const SHEET_FEED_JSON_URL = 'https://spreadsheets.google.com/feeds/cells/1WZMpQOfnCp9A2_SCQ0ETLWT0EN5WbL8SBS6sWxOeXys/1/public/values?alt=json-in-script';

// TODO enable/disable extension by UI
// TODO Run at xx:00 or xx:30
chrome.alarms.create("myAlarm", {
    delayInMinutes: START_DELAY,
    periodInMinutes: UPDATE_FREQUENCY
});

chrome.alarms.onAlarm.addListener(function(alarm) {
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        fetch(SHEET_FEED_JSON_URL)
        .then(res => res.text())
        .then(originJsonText => {
            const firstBracketIndex = originJsonText.indexOf('{');
            const validJsonText = originJsonText.substr(firstBracketIndex).slice(0, -2);
            
            return JSON.parse(validJsonText);
        })
        .then(json => {
            const cells = json.feed.entry;
            let vnMeaning = null;
            let words = [];
            for (cell of cells) {
                const data = cell.gs$cell;
                if (data.col == 1) {
                    vnMeaning = data.$t;
                    words[vnMeaning] = [];
                } else {
                    words[vnMeaning].push(data.$t);
                }
            }

            const keys = Object.keys(words);
            const randomKey = keys[Math.floor(Math.random() * keys.length)];
            const randomWordKey = Math.floor(Math.random() * words[randomKey].length);
            // TODO Fix page needs to be refresh before using
            chrome.tabs.sendMessage(tabs[0].id, {data: {
                vnMeaning: randomKey,
                jpWords: words[randomKey],
                randomWordKey: randomWordKey
            }}, function(response) {
                console.log('success');
            });
        })
        .catch(err => {
            throw err;
        });
	});
});
