$(document).ready(() => {
    $("#edit-profile-button").on( "click", function() {
        console.log( $( this ).text() );
        $( this ).css('display','none');
        var text = $("#about-me-text");
        var interests = $("#about-me-interests");
        var paragraph = $(".navbar-dropdown-account p");
        var button = $("#save-profile-button");

        text.css('display','inline-block');
        interests.css('display','inline-block');
        button.css('display','inline-block');
        paragraph.css('display','none');
    });
    
    $("#save-profile-button").on( "click", function() {
        console.log( $( this ).text() );
        $( this ).css('display','none');
        var text = $("#about-me-text");
        var interests = $("#about-me-interests");
        var paragraph = $(".navbar-dropdown-account p");
        var button = $("#edit-profile-button");

        text.css('display','none');
        interests.css('display','none');
        button.css('display','inline-block');
        paragraph.css('display','inline-block');
    });
    
    $(".ts-control>input").on({
        change: function (e) {
            e.preventDefault();
        },
        keyup: function () {
            $( this ).siblings().remove();
        },
        blur: function () {
            $( this ).siblings().remove();
        }
    });

});


(function() {
    window.onload = function () {
      // INITIALIZATION OF SELECT
      // =======================================================
      HSCore.components.HSTomSelect.init('.js-select')
    }
})()
