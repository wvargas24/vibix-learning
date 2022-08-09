(function() {
    window.onload = function () {
      // INITIALIZATION OF SELECT
      // =======================================================
      HSCore.components.HSTomSelect.init('.js-select')
    }

    const validateButton = (element, button) =>{
        if ( element.val() != '') {
            $(button).prop("disabled", false);
        }else{
            $(button).prop("disabled", true);
        }
    }
    
    $(document).ready(() => {
        $("#btnTagOut").on( "click", function(e) {
            e.preventDefault();
            $('#car-tag-out').css('background','linear-gradient(333.43deg, #F26903 -1.45%, rgba(255, 109, 0, 0) 177.81%)');
            $('#car-tag-out img').attr('src','../assets/svg/logos/tag-out-02.svg');
            $('#car-tag-out h6').text('Tag Back In');
            $('#car-tag-out h6').css('color','#ffffff');
            $('#tagOutModal').modal('toggle');
            $('#btnTagOut').css('display','none');
            $('#btnTagBackIn').css('display','block');
        });
        
        $("#btnTagBackIn").on( "click", function(e) {
            e.preventDefault();
            $('#car-tag-out').css('background','linear-gradient(151.07deg, rgba(156, 224, 194, 0) -75.93%, #9CE0C2 95.65%)');
            $('#car-tag-out img').attr('src','../assets/svg/logos/tag-out.svg');
            $('#car-tag-out h6').text('Tag Out');
            $('#car-tag-out h6').css('color','var(--bs-acqua-dark)');
            $('#tagOutModal').modal('toggle');
            $('#btnTagOut').css('display','block');
            $('#btnTagBackIn').css('display','none');
        });

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
        
        $(".ts-control input").on({
            change: function (e) {
                e.preventDefault();
            },
            keyup: function () {
                validateButton($(this),'#support-student-button');
            },
            blur: function () {
                validateButton($(this),'#support-student-button');            
            }
        });

        $("#support-student-date").on({
            change: function (e) {
                e.preventDefault();
            },
            keyup: function () {
                validateButton($(this),'#support-student-button');
            },
            blur: function () {
                validateButton($(this),'#support-student-button');            
            }
        });

        $("#support-student-time").on({
            change: function (e) {
                e.preventDefault();
            },
            keyup: function () {
                validateButton($(this),'#support-student-button');
            },
            blur: function () {
                validateButton($(this),'#support-student-button');            
            }
        });
        
        $("#support-student-observations").on({
            change: function (e) {
                e.preventDefault();
            },
            keyup: function () {
                validateButton($(this),'#support-student-button');
            },
            blur: function () {
                validateButton($(this),'#support-student-button');            
            }
        });

        const button = document.querySelector('.emoji-icon');

        const picker = new EmojiButton();

        button.addEventListener('click', () => {
            picker.togglePicker(button);
        
        });

        picker.on('emoji', emoji => {
            document.querySelector('.emojiarea-editor').innerHTML += emoji;
        });
    });

})()

