/** SEARCH BAR SECTION **/

var searchBarFormEl = document.querySelector("#search-bar-form"); // <form> ID
var animeInputEl = document.querySelector("#anime-title"); // form <input> id
var searchBarResEl = document.querySelector("#search-bar-results"); // search results <div> id
var resetHistBtn = document.querySelector("#clear-history"); // clear history button

var getFranchiseData = function(title) {
    var franNewsUrl = "https://cdn.animenewsnetwork.com/encyclopedia/api.xml?title=~" + title;

    fetch(franNewsUrl).then(function(res) {
        if (res.ok) {
            // parse XML data
            res.text().then(function(data) {
                var parser = new DOMParser();
                var xml = parser.parseFromString(data, "text/xml");

                // testing XML data output //
                console.log(xml);

                displayTitleData(xml);

            });
        } 
        else {
            console.log("Anime data Not Found");
        }
    })
    
    .catch(function(error) {
        console.log("Unable to connect to Anime News Network");
    });

};

var searchClick = function(event) {

    getFranchiseData(event.target.textContent);

};

var displaySearchHistory = function() {

    if (localStorage.getItem("titles")) {
        
        var histHeadingEl = document.createElement("h4");
        histHeadingEl.textContent = "Re-visit Recent Searches:";
        searchBarResEl.appendChild(histHeadingEl);

        var searchHistoryList = localStorage.getItem("titles").split(',');

        for (var i=1; i < searchHistoryList.length; i++) {
            var titleSearchEl = document.createElement("button");
            titleSearchEl.textContent = searchHistoryList[i];
            searchBarResEl.appendChild(titleSearchEl);
            titleSearchEl.addEventListener("click", searchClick);
        };

    }
};

var addToHistory = function(title) {

    // store searched city in `localStorage` if city exists
    if (title) {

        if (localStorage.getItem("titles")) {
            var searchHistoryList = localStorage.getItem("titles");
        }
        else {
            var searchHistoryList = [];
        }

        var newSearch = title;

        // IF newSearch IS IN LIST, THEN DO NOT ADD AGAIN
        if (searchHistoryList.includes(newSearch)) {
            console.log(newSearch + " is already in the list...");
        }
        else {
            localStorage.setItem("titles", [...[searchHistoryList], newSearch]);
        }

    }

};

var displayAnimeData = function(event, data) {

    searchBarResEl.textContent = "";

    var animeTitleEl = document.createElement("h2");
    animeTitleEl.textContent = event.target.textContent;
    searchBarResEl.appendChild(animeTitleEl);

    var descBool = false;
    var epBool = false;

    // GRAB AND DISPLAY DATA FROM API
    var animeTag = data.getElementsByTagName("anime");
    for (var i = 0; i < animeTag.length; i++) {
        var animeTVName = animeTag[i].getAttribute("name");
        var animeTVType = animeTag[i].getAttribute("type");

        if (animeTVName == animeTitleEl.textContent && animeTVType == "TV") {

            var animeInfoLength = animeTag[i].getElementsByTagName("info").length;

            for (var j = 0; j < animeInfoLength; j++) {
                if (animeTag[i].getElementsByTagName("info")[j].getAttribute("type") == "Picture") {
                    var animeImgEl = document.createElement("img");
                    animeImgEl.setAttribute("src", animeTag[i].getElementsByTagName("info")[j].getAttribute("src"));

                    searchBarResEl.appendChild(animeImgEl);
                    
                    break;
                }
            };

            for (var j = 0; j < animeInfoLength; j++) {
                if (animeTag[i].getElementsByTagName("info")[j].getAttribute("type") == "Number of episodes") {
                    var animeEpEl = document.createElement("h3");
                    animeEpEl.textContent = "No. of Episodes";

                    searchBarResEl.appendChild(animeEpEl);

                    var animeDescription = animeTag[i].getElementsByTagName("info")[j].textContent;

                    var animeDivEpEl = document.createElement("div");
                    animeDivEpEl.textContent = animeDescription;
                    searchBarResEl.appendChild(animeDivEpEl);

                    epBool = true;
                    break;
                }
            };

            for (var j = 0; j < animeInfoLength; j++) {
                if (animeTag[i].getElementsByTagName("info")[j].getAttribute("type") == "Plot Summary") {
                    var animePlotEl = document.createElement("h3");
                    animePlotEl.textContent = "Plot Summary";

                    searchBarResEl.appendChild(animePlotEl);

                    var animeDescription = animeTag[i].getElementsByTagName("info")[j].textContent;

                    var animeDescEl = document.createElement("div");
                    animeDescEl.innerHTML = animeDescription;
                    searchBarResEl.appendChild(animeDescEl);

                    descBool = true;
                    break;
                }
            };

            // if no # of episodes found
            if (!epBool) {
                var animeH3El = document.createElement("h3");
                animeH3El.textContent = "No. of Episodes";

                searchBarResEl.appendChild(animeH3El);

                var animeNoEpEl = document.createElement("div");
                animeNoEpEl.textContent = "Sorry, number of episodes for this anime was found...";
                searchBarResEl.appendChild(animeNoEpEl);
                
                console.log("Sorry, number of episodes for this anime was found...");
            }

            // if no plot summary was found
            if (!descBool) {
                var animePlotEl = document.createElement("h3");
                animePlotEl.textContent = "Plot Summary";

                searchBarResEl.appendChild(animePlotEl);

                var animeNoDescEl = document.createElement("div");
                animeNoDescEl.textContent = "Sorry, no plot summary for this anime was found...";
                searchBarResEl.appendChild(animeNoDescEl);
                
                console.log("Sorry, no plot summary for this anime was found...");
            }

            var animeCreditEl = document.createElement("h4");
            animeCreditEl.innerHTML = 'Source of data: Anime News Network API. Full details at <span id="ann"></span>.';
            searchBarResEl.appendChild(animeCreditEl);

            var annCreditsEl = document.querySelector("#ann");
            var creditUrl = "https://www.animenewsnetwork.com/encyclopedia/anime.php?id=" + animeTag[i].getAttribute("id");
            annCreditsEl.innerHTML = '<a href="' + creditUrl + '" target="_blank">Anime News Network</a>';

        }
    };
};

var displayTitleData = function(data) {

    searchBarResEl.textContent = "";

    var titleResEl = document.createElement("h2");
    titleResEl.textContent = "Results: ";
    searchBarResEl.appendChild(titleResEl);

    // if anime exists in data
    if (data.getElementsByTagName("anime").length > 0) {

        // get titles of anime that correspond to the search result
        var animeTag = data.getElementsByTagName("anime");
        for (var i = 0; i < animeTag.length; i++) { 
            var animeTVType = animeTag[i].getAttribute("type");
            if (animeTVType == "TV") {
                var animeTitleInfo = animeTag[i].getAttribute("name");

                // for every title, append to the page
                var animeTitleListEl = document.createElement("ul");

                var animeTitleEl = document.createElement("li");
                animeTitleEl.textContent = animeTitleInfo;

                animeTitleListEl.appendChild(animeTitleEl);
                searchBarResEl.appendChild(animeTitleListEl);
                // on click, display anime description
                animeTitleEl.addEventListener("click", function(event) {
                    displayAnimeData(event, data);
                    displaySearchHistory();
                });
            }
        };
        
    }
    // if anime was not found in data
    else {
        var notFoundEl = document.createElement("div");
        notFoundEl.textContent = "No results found. Please try again.";

        searchBarResEl.appendChild(notFoundEl);

        console.log("Anime not found...");
    }
    


};

var formSubmitHandler = function(event) {
    event.preventDefault();

    searchBarResEl.textContent = "";

    var animeTitle = animeInputEl.value.trim();

    if (animeTitle) {
        getFranchiseData(animeTitle);
        addToHistory(animeTitle);

        // reset form
        animeInputEl.value = "";
    }
    else {
        var notFoundEl = document.createElement("div");
        notFoundEl.textContent = "Please enter an anime title.";

        searchBarResEl.appendChild(notFoundEl);
        
        console.log("please enter an anime title!!!!!!");
    }

};

var clearHistory = function() {
    localStorage.clear();
    location.reload();
};

searchBarFormEl.addEventListener("submit", formSubmitHandler);
resetHistBtn.addEventListener("click", clearHistory);