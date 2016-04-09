/**
 * Run the load scripts on doc ready
 *
 * @since 0.1.0
 */

$(document).ready(init);



/**
 * Make a task editable when it is double clicked
 *
 * @since 0.1.0
 */

$(document).on('dblclick','ul li',function(){

    if(!$(this).hasClass('editable')){

        var height = $(this).innerHeight();
        var width = $(this).width();
        var text = $(this).text();
        $(this).text('').addClass('editable');

        $(this).append('<textarea type="text" style="width: '+width+'px; min-height: '+height+'px;"></textarea>');

        $(this).find('textarea').focus().val(text);

    }

});



/**
 * Detect the enter key being pressed inside the textarea and save the item back in the list
 *
 * @since 0.1.0
 */

$(document).on('keypress', 'textarea', function(){

    var key = window.event.keyCode;

    if (key == 13) {

        save_edit($(this));

        return false;
    }

});



/**
 * Detect when the textarea loses focus
 *
 * @since 0.1.0
 */

$(document).on('focusout', 'textarea', function(){

    save_edit($(this));

});



/**
 * Store the edited item and save
 *
 * @param {object} elem - The element that was edited
 * @since 0.1.0
 */

function save_edit(elem){

    var text = elem.val();

    elem.parent().text(text).removeClass('editable');

    store_items()

}



/**
 * Show the add task area when the button is clicked
 *
 * @since 0.1.0
 */

$('.add-task a').click(function(){
    $('header, main').addClass('inactive');
    $('section.add-task').fadeIn(250);
    $('#task').focus();
})



/**
 * Add the created task to the correct list based on the buttons id, refresh the lists and store the items
 *
 * @since 0.1.0
 */

$('.buttons button').click(function(){
    var list = $(this).attr('id');
    var text = $('#task').val();

    $('ul.' + list + '-list').append('<li class="ui-state-default" style="display: block;">' + text + '</li>');

    $('header, main').removeClass('inactive');
    $('section.add-task').fadeOut(250);
    $('#task').val('');

    $('ul').sortable('refresh');

    store_items();
})



/**
 * Show the are you sure prompt when the delete button is clicked
 *
 * @since 0.1.0
 */

$('.delete .clear').click(function(){
    $('.delete').hide();
    $('.delete-sure').show();
})



/**
 * Revert back to the delete button when no is pressed on the are you sure prompt
 *
 * @since 0.1.0
 */

$('.delete-sure .no').click(function(){
    $('.delete-sure').hide();
    $('.delete').show();
})



/**
 * Run the delete_completed() function and reset the delete area
 *
 * @since 0.1.0
 */

$('.delete-sure .yes').click(function(){
    $('.delete-sure').hide();
    $('.delete').show();

    delete_complete();
})




/**
 * Initialise the app
 *
 * @since 0.1.0
 */

function init(){

    get_lists();

    get_time();
    get_date();

    /** Fades items in */
    $('ul.items li').fadeIn(500);

    /** Initialise the sortable plugin */
    $('ul').sortable({
        connectWith: 'ul',
        placeholder: 'ui-state-highlight',
        receive: function( event, ui ) {
            store_items()
        }
    });

}



/**
 * Get the time and update it in the header
 *
 * @returns Current time into #time element
 * @since 0.1.0
 */

function get_time() {
    var today = new Date();
    var h = today.getHours();
    var m = today.getMinutes();
    var s = today.getSeconds();
    m = add_zero(m);
    s = add_zero(s);

    var time = h + ":" + m + ":" + s;

    $('#time').html(time);

    var t = setTimeout(get_time, 500);
}



/**
 * Adds a zero into the single digit number
 *
 * @param {number} i - The number to check
 * @returns Inputted number with a prefixed zero if < 10
 * @since 0.1.0
 */

function add_zero(i) {
    if (i < 10) {
        i = "0" + i
    }
    
    return i;
}



/**
 * Get the date and update it in the header
 *
 * @returns text - Formatted date into the header
 * @since 0.1.0
 */

function get_date(){
    var m_names = new Array("January", "February", "March",
        "April", "May", "June", "July", "August", "September",
        "October", "November", "December");

    var d = new Date();
    var curr_date = d.getDate();
    var sup = "";
    if (curr_date == 1 || curr_date == 21 || curr_date ==31)
    {
        sup = "st";
    }
    else if (curr_date == 2 || curr_date == 22)
    {
        sup = "nd";
    }
    else if (curr_date == 3 || curr_date == 23)
    {
        sup = "rd";
    }
    else
    {
        sup = "th";
    }

    var curr_month = d.getMonth();
    var curr_year = d.getFullYear();

    $('#date').html(curr_date + "<sup>" + sup + "</sup> "
        + m_names[curr_month] + " " + curr_year);
}



/**
 * Store the 'today' list into chrome storage
 *
 * @since 0.1.0
 */

function store_today(){

    var today = $('ul.today-list').html();

    chrome.storage.sync.set({'list_today': today});

}



/**
 * Store the 'another day' list into chrome storage
 *
 * @since 0.1.0
 */

function store_another_day(){

    var another_day = $('ul.another-day-list').html();

    chrome.storage.sync.set({'list_another_day': another_day});

}



/**
 * Store the 'completed' list into chrome storage
 *
 * @since 0.1.0
 */

function store_completed(){

    var completed = $('ul.completed').html();

    chrome.storage.sync.set({'list_completed': completed});

}



/**
 * Run all of the storage functions
 *
 * @since 0.1.0
 */

function store_items(){
    store_today();
    store_another_day();
    store_completed();
}



/**
 * Get the lists from storage and output in the right lists
 *
 * @since 0.1.0
 */

function get_lists(){
    chrome.storage.sync.get('list_today', function(items) {
        $('ul.today-list').html(items.list_today);
    });

    chrome.storage.sync.get('list_another_day', function(items) {
        $('ul.another-day-list').html(items.list_another_day);
    });

    chrome.storage.sync.get('list_completed', function(items) {
        $('ul.completed').html(items.list_completed);
    });
}



/**
 * Delete all lists. This will essentially reset the app.
 *
 * @since 0.1.0
 */

function delete_lists(){
    chrome.storage.sync.remove('list_today', function(items) {
    });

    chrome.storage.sync.remove('list_another_day', function(items) {
    });

    chrome.storage.sync.remove('list_completed', function(items) {
    });
}



/**
 * Remove items from the completed column
 *
 * @since 0.1.0
 */

function delete_complete(){
    chrome.storage.sync.remove('list_completed', function(items) {
        $('ul.completed').html('')
    });

    chrome.storage.sync.set({'list_completed': ''});
}