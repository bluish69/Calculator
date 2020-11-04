var thisOperator = "";
var lastCalcNum;
var firstCalc = true;
var firstDigit = true;
var afterSolution = false;
var operatorPressed = false;
var cantDel = false;
var firstClass;
var convertedBut;
var inBox = false;

$(document).click(function (event) {
  //The info popup click function using "inBox()".
  if (event.target.tagName === "I" && event.target.className.length === 27) {
    if (inBox === false) {
      infoBox("show");
    } else {
      infoBox("hide");
    }
  } else {
    if (inBox === true) {
      infoBox("hide");
    }
  }
});

$(".button").click(function (event) {   //Convert the clicked element name into a valid keyname(Using "conver()") that can be used in "checkKey()".
  convertedBut = convert(event.target.className);
  if (afterSolution === true) {
    if (convertedBut === "c") {
      checkKey("c");
    } else if (isNaN(convertedBut) === true) {
      notice("Can't input operators after a solution check!");
    } else {
      $("#calculator-line").text("");
      $("#calculator-line-top").text("");
      checkKey(convertedBut);
      clearAll();
    }
  } else {
    checkKey(convertedBut);
  }
});

$(document).keydown(function (event) {
  //Same but for key presses.
  if (afterSolution === true) {
    //The "afterSolution" state is used to let the code know if you just finished a calculation.
    if (event.code === "KeyC" || event.code === "ArrowRight") {
      checkKey("c");
      playAnimation(2);
    } else if (event.code === "Space") {
      //Space is counted as a number for some reason(Or at least as isNaN === false).
      console.log(event.code + " is not a number!");
    } else if (isNaN(event.key) === true) {
      playAnyways(event.code);
      notice("Can't input operators after a solution check!");
    } else {
      $("#calculator-line").text("");
      $("#calculator-line-top").text("");
      playAnimation(event.key, true);
      checkKey(event.key);
      clearAll();
    }
  } else {
    if (isNaN(event.key) === true) {
      switch (true) {
        case event.code === "KeyD" || event.code === "NumpadSubtract":
          playAnimation(15);
          checkKey("-");
          break;
        case event.code === "KeyA" || event.code === "NumpadAdd":
          playAnimation(14);
          checkKey("+");
          break;
        case event.code === "KeyP" || event.code === "NumpadMultiply":
          playAnimation(1);
          checkKey("*");
          break;
        case event.code === "KeyQ" || event.code === "NumpadDivide":
          playAnimation(0);
          checkKey("/");
          break;
        case event.code === "KeyC" || event.code === "ArrowRight":
          playAnimation(2);
          checkKey("c");
          break;
        case event.code === "Enter" || event.code === "NumpadEnter":
          playAnimation(16);
          checkKey("=");
          break;
        case event.code === "Backspace" || event.code === "NumpadDecimal":
          playAnimation(3);
          checkKey("r");
          break;

        default:
          console.log(event.code);
          break;
      }
    } else {
      playAnimation(event.key, true);
      checkKey(event.key);
    }
  }
});

function checkKey(key) {
  //Biggest backbone of the code, basically takes the converted keys and translate it into different functions/actions.
  if (isNaN(key) === true) {
    if (key === "=") {
      if (operatorPressed === false) {
        $("#calculator-line").text(
          calc(thisOperator, lastCalcNum, Number($("#calculator-line").text()))
        );
        topAdd("=");
        afterSolution = true;
      } else {
        notice("Can't do a result while operator is pressed!");
      }
    } else if (key === "/" || key === "*" || key === "+" || key === "-") {
      if (firstCalc === true) {
        //Another important state for checking if it's the first calculation done since clear or page load.
        thisOperator = key;
        topAdd(thisOperator);
        lastCalcNum = Number($("#calculator-line").text());
        firstCalc = false;
        operatorPressed = true;
      } else {
        if (operatorPressed === false) {
          if (cantDel === false) {
            $("#calculator-line").text(
              calc(
                thisOperator,
                lastCalcNum,
                Number($("#calculator-line").text())
              )
            );
            topAdd($("#calculator-line").text(), true);
            lastCalcNum = Number($("#calculator-line").text());
          }
          operatorPressed = true;
          thisOperator = key;
          topAdd(thisOperator);
          firstDigit = true;
          cantDel = false;
        } else {
          notice("Operator is pressed already!");
        }
      }
    } else if (key === "c") {
      $("#calculator-line").text("0");
      topAdd("c");
      clearAll();
    } else if (key === "r") {
      //The delete function is complex, so I divided it into 3 different scenarios that the function can run on.
      if (firstCalc === true) {
        deleteFunc(1);
      } else if (firstCalc === false && operatorPressed === false) {
        deleteFunc(2);
      } else if (firstCalc === false && operatorPressed === true) {
        deleteFunc(3);
      } else {
        notice("Shouldn't get this notice, contact me please!");
      }
    } else {
      console.log(key);
    }
  } else {
    //The last one is for normal numbers, checks if you shouldn't type anymore and adds it visually.
    if (cantDel === false) {
      if (
        $("#calculator-line").text().length <= 14 ||
        operatorPressed === true
      ) {
        operatorPressed = false;
        if (firstCalc === true) {
          if ($("#calculator-line").text() === "0") {
            $("#calculator-line").text("");
            $("#calculator-line").text($("#calculator-line").text() + key);
            $("#calculator-line-top").text("");
            topAdd(key);
          } else {
            $("#calculator-line").text($("#calculator-line").text() + key);
            topAdd(key);
          }
        } else {
          if ($("#calculator-line").text() !== "" && firstDigit === true) {
            if (key === "0") {
              notice("Can't put 0 as first char.");
            } else {
              $("#calculator-line").text("");
              $("#calculator-line").text($("#calculator-line").text() + key);
              topAdd(key);
              firstDigit = false;
            }
          } else {
            $("#calculator-line").text($("#calculator-line").text() + key);
            topAdd(key);
          }
        }
      } else {
        notice("Can't input numbers longer than 15 characters!");
      }
    } else {
      notice("Can't type numbers without an operator!");
    }
  }
}

function deleteFunc(state) {
  switch (state) {
    case 1:
      if ($("#calculator-line").text().length > 1) {
        $("#calculator-line").text(
          $("#calculator-line")
            .text()
            .slice(0, $("#calculator-line").text().length - 1)
        );
        $("#calculator-line-top").text(
          $("#calculator-line-top")
            .text()
            .slice(0, $("#calculator-line-top").text().length - 1)
        );
      } else {
        $("#calculator-line").text("0");
        $("#calculator-line-top").text("0");
      }
      break;
    case 2:
      if (cantDel === true) {
        notice("Can't delete any further!");
      } else if ($("#calculator-line").text().length > 1) {
        $("#calculator-line").text(
          $("#calculator-line")
            .text()
            .slice(0, $("#calculator-line").text().length - 1)
        );
        $("#calculator-line-top").text(
          $("#calculator-line-top")
            .text()
            .slice(0, $("#calculator-line-top").text().length - 1)
        );
      } else if ($("#calculator-line").text().length === 1) {
        $("#calculator-line").text("0");
        firstDigit = true;
        $("#calculator-line-top").text(
          $("#calculator-line-top")
            .text()
            .slice(0, $("#calculator-line-top").text().length - 1)
        );
        operatorPressed = true;
      } else {
        notice("Shouldn't get this notice, contact me please!");
      }
      break;
    case 3:
      $("#calculator-line-top").text(
        $("#calculator-line-top")
          .text()
          .slice(0, $("#calculator-line-top").text().length - 1)
      );
      thisOperator = "";
      cantDel = true;
      operatorPressed = false;
      break;

    default:
      console.log(
        "Shouldn't happen, 'deleteFunc()' input is different than 1-3"
      );
      break;
  }
}

function topAdd(char, sum) {
  //Basically controls the top line visuals.
  if (char === "c") {
    $("#calculator-line-top").text("0");
  } else {
    if (sum === true) {
      $("#calculator-line-top").text(char);
    } else {
      if ($("#calculator-line-top").text().length < 32) {
        $("#calculator-line-top").text($("#calculator-line-top").text() + char);
      } else if ($("#calculator-line-top").text().length === 32) {
        $("#calculator-line-top").text(
          $("#calculator-line-top").text() + "..."
        );
      } else {
        notice(
          "Line top won't show longer than 32 chars(will still register!)"
        );
      }
    }
  }
}

function calc(operator, num1, num2) {
  //Almost the most simple function in the code, but the one that calculates it all.
  switch (operator) {
    case "-":
      return num1 - num2;
      break;
    case "+":
      return num1 + num2;
      break;
    case "*":
      return num1 * num2;
      break;
    case "/":
      return num1 / num2;
      break;
    default:
      return console.log(num1 + " " + operator + " " + num2);
      break;
  }
}

function clearAll() {
  //The clear funtion that's used after pressing the CE button and when clearning calc after a solution.
  thisOperator = "";
  lastCalcNum = null;
  firstCalc = true;
  firstDigit = true;
  afterSolution = false;
  operatorPressed = false;
  cantDel = false;
}

function convert(longString) {
  //The convert function used when clicking an element.
  firstClass = longString.split(" ");
  firstClass = firstClass[0];
  if (isNaN(firstClass.slice(firstClass.length - 1))) {
    switch (firstClass) {
      case "div":
        playAnimation(0);
        return "/";
        break;
      case "mult":
        playAnimation(1);
        return "*";
        break;
      case "ce":
        playAnimation(2);
        return "c";
        break;
      case "add":
        playAnimation(14);
        return "+";
        break;
      case "sub":
        playAnimation(15);
        return "-";
        break;
      case "enter":
        playAnimation(16);
        return "=";
        break;
      case "del":
        playAnimation(3);
        return "r";
        break;

      default:
        console.log(firstClass);
        break;
    }
  }else{
    var convNum = Number(firstClass.slice(firstClass.length - 1));
    switch (true) {
      case convNum > 0 && convNum <= 3:
        playAnimation(convNum + 9);
        break;
      case convNum > 3 && convNum <= 6:
        playAnimation(convNum + 3);
        break;
      case convNum > 6 && convNum <= 9:
        playAnimation(convNum - 3);
        break;
      default:
        playAnimation(13);
        break;
    }
    return convNum;
  }
}

function infoBox(onOff) {
  if (onOff === "show") {
    playSound(3);
    $(".invisble-help").fadeIn(400);
    $(".invisble-help").addClass("brt");
    inBox = true;
  } else if (onOff === "hide") {
    $(".invisble-help").fadeOut(400);
    $(".invisble-help").removeClass("brt");
    inBox = false;
  }
}

function notice(text) {
  //A notice function, used to give indications to the user what is he doing wrong.
  if ($(".alert-text").css("display") === "none") {
    var alertTime = text.length * 80;
    $(".alert-text").text(text);
    $(".alert-text").fadeIn(800).fadeOut(alertTime);
  } else {
    console.log("Notice is being used, but this is your alert!");
    console.log(text);
  }
}

function playSound(type) {
  //Simple adjustable "playSound()" function.
  var soundName = new Audio("sounds/sound" + type + ".mp3");
  soundName.play();
}

function playAnimation(itemPlace, numbers) {
  //Playing the animation based on the position in the ".button" array.
  if (itemPlace === 3) {
    playSound(2);
  } else if (itemPlace === 2) {
    //Also using this function to call for different sound effects.
    playSound(4);
  } else {
    playSound(1);
  }
  itemPlace = Number(itemPlace);
  if (numbers === true) {
    switch (true) {
      case itemPlace > 0 && itemPlace <= 3:
        itemPlace += 9;
        break;
      case itemPlace > 3 && itemPlace <= 6:
        itemPlace += 3;
        break;
      case itemPlace > 6 && itemPlace <= 9:
        itemPlace -= 3;
        break;
      default:
        itemPlace = 13;
        break;
    }
  }
  $(".button").eq(itemPlace).addClass("pressed");
  setTimeout(function () {
    $(".button").eq(itemPlace).removeClass("pressed");
  }, 100);
}

function playAnyways(code) {
  //This is a really pointless function that animate the button anyways.
  switch (true) {
    case code === "KeyD" || code === "NumpadSubtract":
      playAnimation(15);
      break;
    case code === "KeyA" || code === "NumpadAdd":
      playAnimation(14);
      break;
    case code === "KeyP" || code === "NumpadMultiply":
      playAnimation(1);
      break;
    case code === "KeyQ" || code === "NumpadDivide":
      playAnimation(0);
      break;
    case code === "Backspace" || code === "NumpadDecimal":
      playAnimation(3);
      break;
    case code === "Enter" || code === "NumpadEnter":
      playAnimation(16);
      break;
    default:
      console.log(code);
      break;
  }
}
