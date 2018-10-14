"use strict";

/* oh fuck we're coding oh fuck 
   apparently we're writing korean or some shit
*/

// GLOBAL VARIABLES

// STATIC
// Never ever reassign these in the code!  Otherwise who knows what will happen!

var debug = false; // flag for debugging.

var q = document.getElementById("q"); // <p> element containing the Korean question.
var a = document.getElementById("a"); // <input> element of type text and containing the user's answer (in numeric form).
var m = document.getElementById("m"); // <p> element containing messages to the user (usually a nice thing).
var l = document.getElementById("l"); // that's an L, not an i; <select> element containing the language to be used (0 = Sino-Korean, 1 = Native Korean).
var d = document.getElementById("d"); // <select> element containing the difficulty (0 = 1-10, 1 = 1-100).

var numWords_sino = ["공", "일", "이", "삼", "사", "오", "육", "칠", "팔", "구"] // The Sino-Korean numbers for zero through nine, indexed appropriately.
// The Sino-Korean system has a nice way of generating numbers with just "십" and the digits, so rather than create a separate list with "십" in it, I just hardcoded it.
var numWords_nat = ["공", "하나", "둘", "셋", "넷", "다섯", "여섯", "일곱", "여덟", "아홉"]; // The Native Korean numbers for zero through nine, indexed appropriately.
// Since the Native Korean system uses separate words for 10, 20, 30, etc, I include a separate list for those numbers.
var numWords_natTens = ["공", "열", "스물", "서른", "마흔", "쉰", "예순", "일흔", "여든", "아흔"]; // The Native Korean numbers for 10, 20, 30, etc, indexed appropriately.  

var niceThings = ["wow!", "nice!", "good job!", "좋아!", "대박!", "와아!", "impressive!", "sexy!", "incredible!", "nice nice!", "ez!", "진짜!"]; // Some nice things to say to the user.

// DYNAMIC
// Update based on the state of the program.

var sol; // numeric variable containing the correct solution to the problem.
var diff; // numeric variable containing the current difficulty.
var lang;  // numeric variable containing the language in use (0 = Sino-Korean, 1 = Native Korean).

// HELPER FUNCTIONS

var sendMessage = function sendMessage(text) { // sends a message to the DOM, which just means putting it in m.
    // As one might imagine, invoking this function changes state.
    m.innerHTML = text;
}

var getRandom = function getRandom(min, max) { // helper function to get a random integer between "min" and "max".
    return Math.floor(min + Math.random() * (max - min));
}

var getRandomElement = function getRandomElement(list) { // helper function to pull a random element from a list.
    return list[getRandom(0, list.length)];
}

var getNumWord = function getNumWord(i, l) { // function that converts an integer i into a "word number" in either the Sino or Native format, specificed by the value of integer l (L, not i; 0 = Sino, 1 = Native).
    if (i < 0 || i >= 100) { // we're restricting i to 0-100 because fuck the big numbers.
	return NaN;
    }
    
    if ( l === 0) { // for Sino-Korean numbers.
	if (i < 10) { // The obvious case.
	    return numWords_sino[i];
	}
	else { // This is where things get tricky.
	    
	    var tens = Math.floor(i / 10);
	    var ones = i % 10; // First, extract the value of the individual digits.

	    var tensStr;
	    var onesStr; // Let tensStr and onesStr be the string values of the tens and ones place.
	    
	    if (tens === 1) { tensStr = "십"; } // In the case of 1, no preface is necessary.
	    else { tensStr = numWords_sino[tens] + "십"; } // Otherwise, the method is pretty easy.
	    
	    onesStr = numWords_sino[ones];

	    return tensStr + onesStr;
	}	    
    }
    else if (l === 1) { // for Native Korean numbers.
	if (i < 10) { // Again, obvious.
	    return numWords_nat[i];
	}
	else {
	    var tens = Math.floor(i / 10); // I miss integer division.
	    var ones = i % 10; // Same as above.

	    return numWords_natTens[tens] + numWords_nat[ones]; // wow, so easy!
	    // It's easier because we hardcoded all the numbers 10-90.  I chose to use more logic and less memory for the Sino-Korean converter; if I were to hardcode 10-90 for the Sino system as well, it would be easier to look at, but perhaps less elegant.
	}
    }
    else { // in this case, our value for l was invalid, so we'll just terminate peacefully.  I don't know how this would happen, but just in case.
	return NaN; 
    }
}

// MAIN FUNCTION

var newQuestion = function () { // This is the function that will generate a new addition problem for the user.
    // It's a little ugly because it has both logic and state changes, but all the state changes are grouped together at the bottom, so at least it's nicely legible.

    var max; // The maximum number to roll.
    if (diff === 0) {
	max = 10;
    }
    else if (diff === 1) {
	max = 100;
    }
    else { // if this happens, we fucked up.
	return NaN;
    }
    
    var num1 = getRandom(0, max);
    var num2 = getRandom(0, max);

    var word1 = getNumWord(num1, lang); // recall that lang is a global variable.
    var word2 = getNumWord(num2, lang);

    var ans = num1 + num2;

    // State changes happen here!
    sol = ans; // sol is a global variable.
    a.value = "";
    q.innerHTML = word1+" + "+word2;

    return ans; // We don't really use this value, but it seems to make sense to return it.

}

// DOM MODIFICATIONS

document.addEventListener("keyup", function(e) { // any time the user enters a keystroke, we'll run this to see if they have the right answer.
    // would it involve fewer updates if we updated only on a button press or enter keystroke instead?  yes, of course.
    // But the app feels much, much snappier this way.
    // Technically, the user could guess correctly more easily with this setup, but honestly, I don't care that much.

    // Read input from a.
    var ans = parseInt(a.value);

    // If the answer is correct, OR if we're debugging, we can just enter 0 over and over again.  Very useful.
    if (ans === sol ||
	(debug = true && ans === 0)) {
	sendMessage(getRandomElement(niceThings)); // Send a nice thing because the user was right!
	newQuestion();
    }
    
});

l.addEventListener("change", function(e) { // any time the value here is changed, update "lang" and get a new question.
    lang = parseInt(l.value); // Thanks HTML for sending all my values as strings.
    sendMessage("시, 작!");
    newQuestion();
});
d.addEventListener("change", function(e) { // same as above but for "diff".
    diff = parseInt(d.value);
    sendMessage("시, 작!");
    newQuestion();
});

var init = function init() { // On first run, we want the solution to be 0, the language to be Sino-Korean, and the difficulty to be easy.
    sol = 0;
    lang = 0;
    diff = 0;
    q.innerHTML = "When you're ready, enter \"0\" into the box below.";
    a.value = "";
    sendMessage("시, 작!");
}

init();
