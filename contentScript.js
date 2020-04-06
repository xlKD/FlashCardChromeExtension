chrome.runtime.onMessage.addListener( function(request, sender, sendResponse) {
    const vnMeaning = request.data.vnMeaning;
    const jpWords = request.data.jpWords;
    const randomWordKey = request.data.randomWordKey;

    if ( document.getElementById('popup-jp-word') ) {
        document.getElementById('text_jp_word').innerHTML = jpWords[randomWordKey];
        document.getElementById('text_jp_word').style.display = 'block';
        document.getElementById('text_flip').innerHTML = vnMeaning + '<br>' + jpWords.join();
        document.getElementById('text_flip').style.display = 'none';
    } else {
        const popupHTML = '<div id="popup-jp-word" '
            + 'style="position:fixed;top:30px;right:30px;z-index:999999;text-align:center;color:#8a6d3b;background:#fcf8e3;border:solid 1px #faebcc;border-radius:5px;min-width:100px;padding:4px">'
            + '<span id="btn_close" style="float:right;cursor:pointer">X</span>'
            + '<p id="text_jp_word" style="cursor:pointer;">'
            + jpWords[randomWordKey]
            + '</p>'
            + '<p id="text_flip" style="cursor:pointer;display:none">'
            + vnMeaning + '<br>' + jpWords.join()
            + '</p>'
            + '</div>'; 
        let popup = document.createElement('div');
        popup.innerHTML = popupHTML;

        document.body.appendChild(popup);

        const scriptTagHTML = 
            'document.getElementById("btn_close").addEventListener("click", function() {'
            + '    document.getElementById("popup-jp-word").remove();'
            + '});'
            + 'document.getElementById("text_jp_word").addEventListener("click", function() {'
            + '    document.getElementById("text_jp_word").style.display = "none";'
            + '    document.getElementById("text_flip").style.display = "block";'
            + '});'
            + 'document.getElementById("text_flip").addEventListener("click", function() {'
            + '    document.getElementById("text_jp_word").style.display = "block";'
            + '    document.getElementById("text_flip").style.display = "none";'
            + '});';

        let injectScript = document.createElement("script");
        injectScript.innerHTML = scriptTagHTML;
        document.head.appendChild(injectScript);
    }

    sendResponse({data: request.data, success: true});
});
