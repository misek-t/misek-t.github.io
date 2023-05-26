const quoteApiUrl = "https://api.quotable.io/random?minLength=80&maxLength=100";
const quoteSection = document.getElementById('quote');
const userInput = document.getElementById('quote-input');

let quote = '';
let time = 60;
let timer = '';
let mistakes = 0;

// display random quotes
// async function allow the code to pause and resume anytime while waiting for a certain operations to complete

const renderNewQuote = async () => {
    // fetch the quote from the api url
    const response = await fetch(quoteApiUrl);
    let data = await response.json();
    quote = data.content;

    // the await pauses the code until both of the fetch and response code line completes it operation
    // after both of the response and data code is executed and completed, then the quote = data.content can be executed

    // array of chars in quote
    // converts the quote into an array with '' splits in between
    // if the quote contains 'HELLO', it will split it into an array: ['H', 'E', 'L', 'L', 'O']
    let arr = quote.split('').map((value) => {
        //it remapped the array with the HTML element: <span class="quote-chars">H</span> so it can be styled using the CSS file
        return "<span class='quote-chars'>" + value + "</span>";
    });
    // this code joined all the characters inside the 'arr' array into a single string in the quote section inside the HTML
    quoteSection.innerHTML += arr.join("");
};

// function to compare the user input with the quote
userInput.addEventListener("input", () => {
    // selects the quote chars from before and stored it in the variable 'quoteChars'
    // the quoteChars is collected into a NodeList as the querySelectorAll returns a collection of DOM
    let quoteChars = document.querySelectorAll(".quote-chars");
    // convert the NodeList of quoteChars to an array
    quoteChars = Array.from(quoteChars);

    // splits the user input into an individually array inside the userInputChars variable
    let userInputChars = userInput.value.split("");
    // loop through each char in the quote
    quoteChars.forEach((char, index) => {
        // check the chars with the quote
        if (char.innerText == userInputChars[index]) {
            // if the char from the user input matches with the char from the quote, the success class is applied to the char
            // the success class is defined in the CSS file, where the characters will turn green
            char.classList.add("success");
        }
        
        // if user has not entered anything or backspace
        else if (userInputChars[index] == null) {
            // if the user doesnt typed anything or deleted the char, it removes the success class from the character. which means it will return to the original colour instead of green
            if (char.classList.contains("success")) {
                char.classList.remove("success");
            } else {
                // same as above, it will remove the fail class if it contains the fail class
                char.classList.remove("fail");
            }
        }


        // if the user entered the wrong char
        else {
            // if the char does not have the fail class, it will increase the mistakes counter and add the fail class to the char
            // this code executes when the previous if block is not true, which means the char entered by the user is not the same with the char from the quote
            if (!char.classList.contains("fail")) {
                mistakes++;
                char.classList.add("fail");
            }
            document.getElementById('mistakes').innerText = mistakes;
        }

        // return true if all chars are correct
        // the return value of the element's class list is assigned to success. means that the check variable will be true if all of the elements of the quoteChars has success class
        let check = quoteChars.every((element) => {
            return element.classList.contains("success");
        });

        // end the test if all chars are correct
        // if the check is true, it will execute the displayResult function
        if (check) {
            displayResult();
        }
    });

});

// timer update
function updateTimer() {
    if (time == 0) {
        // end the test if the time reaches 0
        displayResult();
    } else {
        document.getElementById("timer").innerText = --time + "s";
    }
}

// set the time
const timeReduce = () => {
    time = 60;
    timer = setInterval(updateTimer, 1000);
};

// end the test
const displayResult = () => {
    // set the display properties of the result div in the HTML to block
    // block action makes the result div to be visible
    document.querySelector(".result").style.display = "block";
    clearInterval(timer);
    // the none action hides the stop-test id from the HTML. this means it will hide the stop-test button from the display
    document.getElementById("stop-test").style.display = "none";
    // when the disabled function is set to be true, it will prevent the user from modifying anything inside the textarea element in the HTML file
    userInput.disabled = true;
    let timeTaken = 1;
    if (time != 0) {
        timeTaken = (60 - time ) / 100;
    }
    document.getElementById("wpm").innerText = (userInput.value.length / 5 / timeTaken).toFixed(2) + "wpm";
    document.getElementById("accuracy").innerText = Math.round(((userInput.value.length - mistakes) / userInput.value.length) * 100) + "%";
};

// start the test
const startTest = () => {
    mistakes = 0;
    timer = "";
    userInput.disabled = false;
    timeReduce();
    document.getElementById("start-test").style.display = "none";
    document.getElementById("stop-test").style.display = "block";
};

// onload is an event handler that is triggered when an entire webpage is finished loading
// the following code will be executed once the window is finished loading
window.onload = () => {
    userInput.value = "";
    document.getElementById("start-test").style.display = "block";
    document.getElementById("stop-test").style.display = "none";
    userInput.disabled = true;
    renderNewQuote();
}