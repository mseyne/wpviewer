var searchValue = '';
var resultJSON;
var numbResult = 10;

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
    $('#searchTitle').html(searchValue);
    $.ajax({
        url: 'https://en.wikipedia.org/w/api.php?action=opensearch&format=json&search=' + val + '&limit=' + numbResult + '&suggest=1&redirects=return&callback=ttt',
        jsonp: 'callback',
        dataType: 'jsonp',
        success: function( data ) {
            resultJSON = data;
            displayCards();
        }
    });
}

var displayCards = function(){
    console.log(resultJSON);
    var i = 0;
    while ( i < numbResult ){
        for ( var result in resultJSON){
            console.log(resultJSON[result][i]);
        }
        i++
    }
}


$('document').ready(function(){

    $('#searchWP').on('click', function(){
        displaySearchBar();
    });

    $('#closeSearch').on('click', function(){
        hideSearchBar();
    });

    $(document).keyup(function(e) {
        if (e.keyCode == 27) { // escape key maps to keycode `27`
            hideSearchBar();
        }
    });

    
    $('#randomWP').on('click', function(){
        console.log('random');
    });

    $('#search').bind("enterKey",function(e){
        searchValue = $('#search').val();
        hideSearchBar();
        getWikipediaResults(searchValue);
    });

    $('#search').keyup(function(e){
        if(e.keyCode == 13)
        {
            $(this).trigger("enterKey");
        }
    });

});