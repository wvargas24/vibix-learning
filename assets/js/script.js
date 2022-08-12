(function() {
    window.onload = function () {
        // INITIALIZATION OF NAVBAR VERTICAL ASIDE
        // =======================================================
        var sidebar = $('.js-navbar-vertical-aside').hsSideNav();

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

        
        if ($('.emoji-icon').length > 0) {
            const button = document.querySelector('.emoji-icon');
            const picker = new EmojiButton();

            button.addEventListener('click', () => {
                picker.togglePicker(button);
            
            });

            picker.on('emoji', emoji => {
                document.querySelector('.emojiarea-editor').innerHTML += emoji;
            });
        }
        
    });
    
})()


var docReady = function docReady(fn) {
    // see if DOM is already available
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', fn);
    } else {
        setTimeout(fn, 1);
    }
};
var resize = function resize(fn) {
    return window.addEventListener('resize', fn);
};
    
var isIterableArray = function isIterableArray(array) {
    return Array.isArray(array) && !!array.length;
};

var camelize = function camelize(str) {
    var text = str.replace(/[-_\s.]+(.)?/g, function (_, c) {
    return c ? c.toUpperCase() : '';
    });
    return "".concat(text.substr(0, 1).toLowerCase()).concat(text.substr(1));
};

var getData = function getData(el, data) {
    try {
    return JSON.parse(el.dataset[camelize(data)]);
    } catch (e) {
    return el.dataset[camelize(data)];
    }
};

var utils = {
    docReady: docReady,
    resize: resize,
    isIterableArray: isIterableArray,
    camelize: camelize,
    getData: getData
};
/* -------------------------------------------------------------------------- */
/*                                 Glightbox                                */
/* -------------------------------------------------------------------------- */

var glightboxInit = function glightboxInit() {
    if (window.GLightbox) {
        window.GLightbox({
            selector: '[data-gallery]'
        });
    }
};

/*-----------------------------------------------
|   Chat
-----------------------------------------------*/


var chatInit = function chatInit() {
    var Events = {
    CLICK: 'click',
    SHOWN_BS_TAB: 'shown.bs.tab',
    KEYUP: 'keyup',
    EMOJI: 'emoji'
    };
    var Selector = {
    CHAT_SIDEBAR: '.chat-sidebar',
    CHAT_CONTACT: '.chat-contact',
    CHAT_CONTENT_SCROLL_AREA: '.chat-content-scroll-area',
    CHAT_CONTENT_SCROLL_AREA_ACTIVE: '.card-chat-pane.active .chat-content-scroll-area',
    CHAT_EMOJIAREA: '.chat-editor-area .emojiarea-editor',
    BTN_SEND: '.btn-send',
    EMOJIEAREA_EDITOR: '.emojiarea-editor',
    BTN_INFO: '.btn-info',
    CONVERSATION_INFO: '.conversation-info',
    CONTACTS_LIST_SHOW: '.contacts-list-show'
    };
    var ClassName = {
    UNREAD_MESSAGE: 'unread-message',
    TEXT_PRIMARY: 'text-primary',
    SHOW: 'show'
    };
    var DATA_KEY = {
    INDEX: 'index'
    };
    var $chatSidebar = document.querySelector(Selector.CHAT_SIDEBAR);
    var $chatContact = document.querySelectorAll(Selector.CHAT_CONTACT);
    var $chatEmojiarea = document.querySelector(Selector.CHAT_EMOJIAREA);
    var $btnSend = document.querySelector(Selector.BTN_SEND);
    var $currentChatArea = document.querySelector(Selector.CHAT_CONTENT_SCROLL_AREA); // Set scrollbar position

    var setScrollbarPosition = function setScrollbarPosition($chatArea) {
    if ($chatArea) {
        var scrollArea = $chatArea;
        scrollArea.scrollTop = $chatArea.scrollHeight;
    }
    };

    setTimeout(function () {
    setScrollbarPosition($currentChatArea);
    }, 700);
    document.querySelectorAll(Selector.CHAT_CONTACT).forEach(function (el) {
    el.addEventListener(Events.CLICK, function (e) {
        var $this = e.currentTarget;
        $this.classList.add('active'); // Hide contact list sidebar on responsive

        window.innerWidth < 768 && !e.target.classList.contains('hover-actions') && ($chatSidebar.style.left = '-100%'); // Remove unread-message class when read

        $this.classList.contains(ClassName.UNREAD_MESSAGE) && $this.classList.remove(ClassName.UNREAD_MESSAGE);
    });
    });
    $chatContact.forEach(function (el) {
    el.addEventListener(Events.SHOWN_BS_TAB, function () {
        $chatEmojiarea.innerHTML = '';
        $btnSend.classList.remove(ClassName.TEXT_PRIMARY);
        var TargetChatArea = document.querySelector(Selector.CHAT_CONTENT_SCROLL_AREA_ACTIVE);
        setScrollbarPosition(TargetChatArea);
    });
    }); // change send button color on

    if ($chatEmojiarea) {
    $chatEmojiarea.setAttribute('placeholder', 'Type a message');
    $chatEmojiarea.addEventListener(Events.KEYUP, function (e) {
        if (e.target.textContent.length <= 0) {
        $btnSend.classList.remove(ClassName.TEXT_PRIMARY);

        if (e.target.innerHTML === '<br>') {
            e.target.innerHTML = '';
        }
        } else {
        $btnSend.classList.add(ClassName.TEXT_PRIMARY);
        }

        var TargetChatArea = document.querySelector(Selector.CHAT_CONTENT_SCROLL_AREA_ACTIVE);
        setScrollbarPosition(TargetChatArea);
    });
    } // Open conversation info sidebar


    $chatEmojiarea && document.querySelectorAll(Selector.BTN_INFO).forEach(function (el) {
        el.addEventListener(Events.CLICK, function (e) {
            var $this = e.currentTarget;
            var dataIndex = utils.getData($this, DATA_KEY.INDEX);
            var $info = document.querySelector("".concat(Selector.CONVERSATION_INFO, "[data-").concat(DATA_KEY.INDEX, "='").concat(dataIndex, "']"));
            $info.classList.toggle(ClassName.SHOW);
        });
    }); // Show contact list sidebar on responsive

    document.querySelectorAll(Selector.CONTACTS_LIST_SHOW).forEach(function (el) {
        el.addEventListener(Events.CLICK, function () {
            $chatSidebar.style.left = 0;
        });
    }); // Set scrollbar area height on resize

    utils.resize(function () {
        var TargetChatArea = document.querySelector(Selector.CHAT_CONTENT_SCROLL_AREA_ACTIVE);
        setScrollbarPosition(TargetChatArea);
    }); // Emoji append in message text

    // $chatEmojiarea && window.picker.on(Events.EMOJI, function (selection) {
    //     document.querySelector(Selector.EMOJIEAREA_EDITOR).innerHTML += selection.emoji;
    // });
};

docReady(chatInit);
docReady(glightboxInit);