// Nature Gifs

// Variable to store API Key
const apiKey = config.API_KEY;

// Create an array of strings related to topics that interest me. Save it to a variable called topics.
let topics = ['Moon', 'Clouds', 'Sky', 'Constellations', 'Sun', 'Sand', 'Coral', 'Reef', 'Geyser', 'Wind', 'Forest', 'Trees', 'Plants', 'Flowers', 'Glacier', 'Northern Lights', 'Ocean', 'Mist',
'Waves', 'Lake', 'Snow', 'Ice', 'Rain', 'Sunrise', 'Sunset', 'Waterfall', 'Mountains', 'Stars', 'Fog'];


// Create a div to hold the buttons
const gifButtons = $('<div id="gif-buttons">');
// Append the #gifButtons div to the #gifs div.
$('#gifs').append(gifButtons);

const displayButtons = function() {
  // If a div exists, remove it.
  $('#gif-buttons').empty();
  // Loop over the topics array with the each() method.
  $.each(topics, function(index, btn) {
    // Create HTML buttons for each string in the topics array.
    const button = $('<button class="topic">');
    // Set the button html text to the text of each string in the topics array.
    button.html(btn);
    // Append the buttons to the div with the ID of gif-buttons.
    gifButtons.append(button);
  });
  // Execute getURL()
  getURL();
}; // end displayButtons()


const getURL = function() {
  // Clear the searchTerm text every time the user clicks a button.
  $(this).text('');
  // When the user clicks on a button, the searchTerm is set to the button text and the url complete. The url is passed to the getData function and getData() is executed.
  $('.topic').on('click', function() {
    // Remove the #images div if it already exists.
    $('#images').remove();
    // Store the searchTerm (the clicked button text) in a variable to use in the url query search.
    const searchTerm = $(this).text();
    console.log(searchTerm);
    // Access the Giphy API and request the following by adding these parameters to the url:
    // q=searchTerm (button text captured on the button click event),
    // limit=10 (only 10 giphy images are requested),
    // rating=y,g,pg (only the following ratings are requested)

    // Use https to begin the Giphy url to avoid the 'Mixed Content' error when a secure page requests an insecure endpoint. 
		const url = 'https://api.giphy.com/v1/gifs/search?api_key=' + apiKey + '&q=' + searchTerm + '&limit=10&offset=0&rating=g,pg,pg-13&lang=en'
    // Execute getData() and pass it the url.
    getData(url);
    // Remove the .topic click event.
    $('.topic').off();
  }); // end on #topic click event
}; // end getGifs()


const getData = function(url) {
  // Execute ajax () request.
  $.ajax({
    url: url,
    method: "GET"
  }).done(function(response) {
    console.log(response);
    // Create an images div to display all the gifs.
    const images = $('<div id="images">');
    // Append the #images div to the #gifs div.
    $('#gifs').append(images);
    // Loop over the response and access the data
    $.each(response.data, function(index) {
      // Create an .image div to hold each gif .img div and gif .rating div.
      const gifImage = $('<div class="gif-image">');
      // Create an HTML img tag for each image and populate the src attribute with the response.data for the image url.
      const img = $('<div class="img"><img src="' + response.data[index].images.fixed_width_still.url + '" data-still="' + response.data[index].images.fixed_width_still.url + '" data-animate="' + response.data[index].images.fixed_width.url + '"></div>');
      // Create an HTML p tag for each image rating.
      const rating = $('<div class="rating"><p>Rating: ' + response.data[index].rating + '</p></div>');
      gifImage.append(img);
      gifImage.append(rating);
      //$('#gifs').append(gifImage);
      images.append(gifImage);
    }); // end the loop over response.data
    // Execute getURL() if a .topic button is clicked again.
    getURL();
    // Execute animate() if an image is clicked.
    animate();
  }).fail(function() { // if done() returns an error fail() will execute
    console.log('There was an error with your request.');
  }); // end fail()
}; // end getData()


const animate = function() {
  // Initial image is still. The variable still is set to true.
  let still = true;
  $('img').on('click', function() {
    // If still is true ...
    if(still) {
      // Set the img src attribute value to animate.
      $(this).attr('src', $(this).attr('data-animate'));
      // Still is now false.
      still = false;
    } else {
      // Set the img src attribute value to still.
      $(this).attr('src', $(this).attr('data-still'));
      // Still is now true.
      still = true;
    }
  }); // end .images on click event
}; // end animate()


const addATopic = function() {
  // Create an HTML form element with an input and submit button.
  const formDiv = $('<div id="gif-form">');
  const newTopic = $('<div id="new-topic" class="form-group">'+
                   '<label for="input">Add a topic about nature</label>' +
                   '<input type="text" class="form-control">'+
                   '<button id="add-topic" class="btn btn-default" type="submit">Submit</button>' +
                   '</div>');
  // Append the form to the formDiv.
  formDiv.append(newTopic);
  // Append the formDiv to the #gifs div.
  $('#gifs').append(formDiv);

  // Thank You - http://stackoverflow.com/questions/3617797/regex-to-match-only-letters
  // Regular expression pattern to match only strings that consist of one or more letters. 
	// This pattern starts with a ^ and ends with a $ to match all characters with the following character set [a-zA-Z] (letters only).
  const lettersOnly = /^[a-zA-Z]+$/;

  // Create a click event to add a new button for a new topic.
  $('#add-topic').on('click', function(e) {
    // Ensure that the input field accepts letter characters only.
    if($('input[type=text]').val().match(lettersOnly)) {
      // Prevent the form from submitting and refreshing the page.
      e.preventDefault();
      // Get the text the user typed in the input field.
      const input = $('input[type=text]').val();
      // Add the user input (text) to the topics array.
      topics.push(input);
      // Clear the input field.
      $('input[type=text]').val('');
      // Execute displayButtons() to create the new button and display it.
      displayButtons();
      // Check to ensure that the input field contains text so empty buttons aren't added when the button is clicked.
    } else if($('input[type=text]').val().length === 0) {
      alert('Please enter a new topic of interest.');
    } else {
      // If the user types a character other than a letter, the following alert will appear.
      alert('Letters only please.');
      // Clear the input field.
      $('input[type=text]').val('');
    } // end if($('input[type=text]').val().match(lettersOnly))
  }); // end #add-topic click event

  // Create an enter keyup event to add a new button for a new topic.
  $(document).on('keyup', function(e) {
    // Check to ensure that the input field contains text so empty buttons aren't added when the enter key is released.
    if($('input[type=text]').val().length > 0 && e.keyCode === 13) {
      // Ensure that the input field accepts letter characters only.
      if($('input[type=text]').val().match(lettersOnly)) {
        // Prevent the form from submitting and refreshing the page.
        e.preventDefault();
        // Get the text the user typed in the input field.
        const input = $('input[type=text]').val();
        // Add the user input (text) to the topics array.
        topics.push(input);
        // Clear the input field.
        $('input[type=text]').val('');
        // Execute displayButtons() to create and display an updated list of buttons from the strings in the topics array.
        displayButtons();
      } else {
        // If the user types a character other than a letter, the following alert will appear.
        alert('Letters only please.');
        // Clear the input field.
        $('input[type=text]').val('');
      } // end if($('input[type=text]').val().match(lettersOnly))
    } // end if($('input[type=text]').val().length > 0 && e.keyCode === 13)
  }); // end document keyup event
}; // end addATopic()


// When the DOM is ready, execute the following functions.
$(document).ready(function() {

  // Thank You - http://stackoverflow.com/questions/6459581/toggle-active-class-in-nav-bar-with-jquery
  // Add .selected styles to the .topic button that is clicked.
  // Bind the event listener to the document to target the dynamically created buttons and pass the class of the button elements (.topic) to the .on() method.
  $(document).on('click', '.topic', function() {
    // Remove the selected class from all .topic elements
    $('.topic').removeClass('selected');
    // Add the selected class to 'this' element.
      $(this).addClass('selected');
  }); // end .topic click event

  displayButtons();
  addATopic();
});
