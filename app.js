"use strict";

var q = document.getElementById("q");
var a = document.getElementById("a");
var m = document.getElementById("m");
var d = document.getElementById("d");

var sol;

var numWords = ["공", "일", "이", "삼", "사", "오", "육", "칠", "팔", "구"]    // ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine"];

var niceThings = ["wow!", "nice!", "good job!", "좋아!", "대박!", "와아!", "impressive!", "sexy!", "incredible!", "nice nice!", "ez!", "진짜!"];

var getRandom = function getRandom(min, max) {
    return Math.floor(min + Math.random() * (max - min));
}

var getRandomElement = function getRandomElement(list) {
    return list[getRandom(0, list.length)];
}

var getNumWord = function getNumWord(i) {
    if (i < 0 || i >= 100) {
	return NaN;
    }
    else if (i < 10) {
	return numWords[i];
    }
    else {

	var tens = Math.floor(i / 10);
	var ones = i % 10;

	var tensStr = (tens === 1 ?
		       "" : numWords[tens])
		       + "십";
	var onesStr = numWords[ones];

	return tensStr + onesStr;
    }
}

var askQ = function () {

    var max = 10;
    if (d.value === "h") max = 100;
    var num1 = getRandom(0, max);
    var num2 = getRandom(0, max);

    var word1 = getNumWord(num1);
    var word2 = getNumWord(num2);

    var ans = num1 + num2;

    sol = ans;
    a.value = "";
    q.innerHTML = word1+" + "+word2;

    return ans;

}

document.addEventListener("keyup", function(e) {

    var text = a.value;
    var num = parseInt(text);

    if (num === sol) {
	m.innerHTML = getRandomElement(niceThings);
	askQ();
    }
    
});

d.addEventListener("change", function(e) {
    m.innerHTML = "시, 작!";
    askQ();
});

sol = 0;
q.innerHTML = "When you're ready, enter \"0\" into the box below.";
a.value = "";
m.innerHTML = "시, 작!";
