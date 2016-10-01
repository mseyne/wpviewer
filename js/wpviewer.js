var searchValue = '';
var resultJSON;
var numbResult = 10;
var toReplace = ['<p>','</p>', '<h2>', '</h2>', '<br />', '<br/>', '<ul>', '<li>', '</ul>', '</li>', '<h3>', '</h3>', '<ol>', '</ol>'];

function displaySearchBar(){
    $('#mainNavbar').addClass('hide');
    $('nav form').removeClass('hide');
    $('#search').focus();
}

function hideSearchBar(){
    $('nav form').addClass('hide');
    $('#mainNavbar').removeClass('hide');
}

var getWikipediaResults = function(val){
    $.ajax({
        url: 'https://en.wikipedia.org/w/api.php?action=opensearch&format=json&search=' + val + '&limit=' + numbResult + '&suggest=1&redirects=return&callback=ttt',
        jsonp: 'callback',
        dataType: 'jsonp',
        success: function( data ) {
            resultJSON = data;
            createResultsCards();
        }
    });
}

var createResultsCards = function(){
    $('#results').html('').show();
    $('#searchTitle').html(resultJSON[0]);
    var article = [];
    for (var i = 0; i < numbResult; i++){
        for (var content of resultJSON){
            if(content !== resultJSON[0]){
                article.push(content[i]);
            }
        }
        displayResultCard(article);
        article = [];
    }
}

var displayResultCard = function(article){
    var newCard = '<div class="divider"></div><a href="' + article[2] + '" target="_blank">';
    newCard += '<article class="card-panel result-card hoverable amber lighten-4 z-depth-1">';
    newCard += '<span class="title orange-text text-darken-4">' + article[0] + '</span> : '
    newCard += '<span class="description grey-text text-darken-3">' + article[1] + '</span></article></a>'
    $('#results').append(newCard);
}


var getWikipediaRandom = function(){
    $.getJSON("https://en.wikipedia.org/w/api.php?action=query&generator=random&grnnamespace=0&" +
    "prop=revisions|images|extracts&exchars=250&callback=?&format=json", 
        function(data) {
        resultJSON = data;
        createRandomCard();
    });
}

var createRandomCard = function() {
    $('#randomCard').html('');

    for ( var data in resultJSON.query.pages) {
        var array = resultJSON.query.pages[data];
        var title = array.title;
        var extract = array.extract;
        toReplace.forEach(function(element) {
            extract = extract.split(element).join("");
        });
        var image = getImageUrl(array.images);
        var link = "https://en.wikipedia.org/wiki/" + title;
    }
    displayRandomCard(title, extract, image, link)
}

var displayRandomCard = function(title, extract, image, link) {
    var newCard = '<div class="card-image"><img src=""></div><div class="card-stacked"><div class="card-content">'
    + '<div class="center-align"><h5 class="orange-text"> ' + title + ' </h5></div>'
    + extract + '</div><div class="card-action"><a href="' + link + '">' + link + '</a></div></div>';
    $('#randomCard').append(newCard);
    $('#randomCard').show();
}

var getImageUrl = function(img) {
    var imgUrl = 'https://upload.wikimedia.org/wikipedia/commons/b/b3/Wikipedia-logo-v2-en.svg';

    if (img !== undefined) {
        img = img[0].title;
        console.log(img);
        console.log("https://commons.wikimedia.org/wiki/" + img);
        $.getJSON('https://commons.wikimedia.org/w/api.php?action=query&titles=' + img + '&prop=imageinfo&iiprop=url&format=json&callback=?', function(data){
            for ( var dt in data.query.pages) {
                console.log(data.query.pages[dt].imageinfo !== undefined);
                if (data.query.pages[dt].imageinfo !== undefined) {
                    console.log(data.query.pages[dt].imageinfo[0].url);
                    imgUrl = data.query.pages[dt].imageinfo[0].url;
                }
            }
            console.log("imgUrl", imgUrl);
            $('.card-image > img').attr('src', imgUrl);
        });
    }
}

$('document').ready(function() {

    $('#searchWP').on('click', function() {
        displaySearchBar();
    });

    $('#closeSearch').on('click', function() {
        hideSearchBar();
    });

    $(document).keyup(function(e) {
        if (e.keyCode == 27) { // escape key maps to keycode `27`
            hideSearchBar();
        }
    });

    
    $('#randomWP').on('click', function(){
        $('#results').hide();
        getWikipediaRandom();
    });

    $('#search').keypress(function(event){
        if (event.keyCode === 10 || event.keyCode === 13) 
            event.preventDefault();
    });

    $('#search').bind("enterKeyPressed",function(e){
        $('#randomCard').hide();
        searchValue = $('#search').val();
        hideSearchBar();
        if (searchValue.length > 0){
            getWikipediaResults(searchValue);
        }
    });

    $('#search').keyup(function(e){
        if(e.keyCode == 13){
            $(this).trigger("enterKeyPressed");
        }
    });

});