//sets up default values for the fighters
const START_HP = 100;
const START_SP = 20;
const DEFAULT_ATK = 10;
const DEFAULT_DEF = 5;
const DEFAULT_TEK = 5;
const SPLOSS = 3
const RECOVER = 2

//sets constants for player names
const P0NAME = 'Crash';
const P0CHARA = 'crashr';
const P1NAME = 'Sam';
const P1CHARA = 'saml';

//generates the players using the fighter class
let Player0;
let Player1;

//Toggles wether or not to show the oldText
let playerTurn = false;
let logging = true;


// declared variables for the boxes
let gameBox;
let headerBox;
let graphicsBox;
let barsBox;
let controlsBox;
let outputBox;
let sp;

//This class is used to create fighters
class Fighter {

  constructor(name, charaName) {
    //'contructor' is in all JS classes
    // It gets run immediately when a new object is created from a class
    // Set all of our default values for this new fighter here
    this.name = name;
    this.hp = START_HP;
    this.sp = START_SP;
    this.atk = DEFAULT_ATK;
    this.def = DEFAULT_DEF;
    this.tek = DEFAULT_TEK;
    this.charaName = charaName;
  }

  //this logs who attacked who
  attack(target) {
    let oldText = outputBox.innerHTML; //save current outputBox to old text
    console.log(this.name + ' attacked ' + target.name); //logs attack to the console

    let damage = (Math.round(Math.random() + 1) * this.atk); //Does the attack with a random chance to be double. this is done by getting random number between one and zero, converts it to just one or zero and adds one to it making it randomly one or two. then it takes the one or two times the damage to deal random double damage
    let reducedDamage = Math.round(damage / 6); //Reduces the damage by six and round it to the nearest whole number
    let dodge = Math.round(Math.random()); //Uses the randomisation system from before to get 1 or 2 (true and false) for the dodge
    if (dodge) {
      outputBox.innerHTML = target.name + ' dodged ' + this.name + '\'s attack and was hit only hit for ' + reducedDamage + ' damage' + '<br><br>'; // outputs to the outputbox
      outputBox.innerHTML += oldText; //Used to add it to the old text
      outputBox.innerHTML += target.name + ' has ' + target.hp + ' health remaining' + '<br><br>'; //logs to the outputBox
      damage = reducedDamage //sets damage done to reduced damage
      document.getElementById(this.charaName).src = 'img/' + this.charaName + '_attack.png'; //sets the image for the attaker to attacking
      document.getElementById(target.charaName).src = 'img/' + target.charaName + '_dodge.png'; //sets the image for the target to dodgeing
      koCheck(target, damage); //runs ko check
    } else {
      outputBox.innerHTML = this.name + ' attacked ' + target.name + ' for ' + damage + ' damage!' + '<br><br>'; // outputs to the outputbox
      outputBox.innerHTML += oldText;//Used to add it to the old text
      outputBox.innerHTML += target.name + ' has ' + target.hp + ' health remaining' + '<br><br>';//logs to the outputBox
      document.getElementById(this.charaName).src = 'img/' + this.charaName + '_attack.png'; //sets the image for the attaker to attacking
      document.getElementById(target.charaName).src = 'img/' + target.charaName + '_hit.png'; //sets the image for the target to hit
      koCheck(target, damage); //runs ko check
    }
  }

  single(target) {
    this.attack(target); //calls the attack function
    endTurn();//Calls endTurn
  }

  double(target) {

    let oldText = outputBox.innerHTML  //save current outputBox to old text

    if(this.sp >= 5){
      this.sp = this.sp - 5; //if sp is greater than or equal to five then it subtracts five
      this.attack(target); //if sp is greater than or equal to five then it calls attack
      this.attack(target); //if sp is greater than or equal to five then it calls attack a second time
    }else {
        outputBox.innerHTML = "not enough SP" + '<br><br>'; //logs not enough sp to outputBox
        outputBox.innerHTML += oldText;  //logs oldText to outputBox
    }
    endTurn(); //Calls endTurn
  }

  //this logs that they recovered
  recover() {
    console.log('Recovered!');

    //saves the current outputBox to old text
    let oldtext = outputBox.innerHTML

    //if they have enough SP

    if (this.sp >= SPLOSS) {
      //minus 3 SP from total SP
      this.sp = this.sp - SPLOSS;
      //calculate recovery
      let recovery = this.tek * RECOVER;
      //heal player
      koCheck(this, -recovery);
      outputBox.innerHTML = this.name + ' Recovered ' + recovery + '<br><br>'; //logs the recovery to the outputBox
      outputBox.innerHTML += oldText; //adds the old text to the output box
    } else {
      outputBox.innerHTML = "not enough SP" + '<br><br>'; //logs not enough SP to the outputBox
      outputBox.innerHTML += oldText; //adds the old text to the output box
    }
    endTurn();//Calls endTurn
  }
}


function startup() {
  //creates two players with the fighter class
  Player0 = new Fighter(P0NAME, P0CHARA);
  Player1 = new Fighter(P1NAME, P1CHARA);

  //this makes a shortcut for 'document.getElementById'
  gameBox = document.getElementById('gameBox');
  headerBox = document.getElementById('headerBox');
  graphicsBox = document.getElementById('graphicsBox');
  barsBox = document.getElementById('barsBox');
  controlsBox = document.getElementById('controlsBox');
  outputBox = document.getElementById('outputBox');

  //this shows the fighter images in the graphics box
  graphicsBox.innerHTML = '<img id ="' + Player0.charaName + '" src="img/' + Player0.charaName + '_idle.png" alt="' + Player0.name + '" class="fighterIMG">';
  graphicsBox.innerHTML += '<img id ="' + Player1.charaName + '" src="img/' + Player1.charaName + '_idle.png" alt="' + Player1.name + '" class="fighterIMG">';

  //logs each players name and attack to console
  console.log('My name is ' + Player0.name + ' and my ATK is ' + Player0.atk);
  console.log('My name is ' + Player1.name + ' and my ATK is ' + Player1.atk);


  showControls(); //runs the showControls() function
  updateBars(); //runs the updateBars() function
}

function showControls() {
  //checks to see which players turn it is and show the apropriate controls
  if (playerTurn) {
    //show buttons for player1 and overwrites player0's controls
    controlsBox.innerHTML = '<button type="button" name="attack" onclick="Player1.single(Player0)">Single Attack!</button>';
    controlsBox.innerHTML += '<br><button type="button" name="attack" onclick="Player1.double(Player0)">Double Attack!</button><br>'
    controlsBox.innerHTML += '<br><button type="button" name="attack" onclick="Player1.recover(Player0)">Recover</button><br>'
  } else {
    //show buttons for player0 and overwrites player1's controls
    controlsBox.innerHTML = '<button type="button" name="attack" onclick="Player0.single(Player1)">Single Attack!</button>';
    controlsBox.innerHTML += '<br><button type="button" name="attack" onclick="Player0.double(Player1)">Double Attack!</button><br>'
    controlsBox.innerHTML += '<br><button type="button" name="attack" onclick="Player0.recover(Player1)">Recover</button><br>'
  }
}

//checks the target's HP is less than or equal to 0, Then retuns true or false.
function koCheck(target, amount) {
  target.hp = target.hp - amount; //subtracts amoount from target's HP
  if (target.hp <= 0) {
    document.getElementById(target.charaName).src = 'img/' + target.charaName + '_ko.png'; //sets targets img to ko if a players hp is lessthan or equal to zero
    hideControls(); //calls hideControls
    return true; //returns koCheck as true if it is true
  } else {
    return false;//returns koCheck as false if it is false
  }
}

//This function takes all the info to build an HP or SP bar, and ensure it is not greater than 100 or less than 0
function updateBar(player, hpsp, min, max) {
  let calculated = ((min / max) * 100);//calculates the variable calculated, which is used for the bar's fill
  if (calculated > 100) {
    calculated = 100; //sets calculated to 100 if it is greater than 100 so the bar will not overflow even if the health is more than 100
  } else if (calculated < 0) {
    calculated = 0; //sets calculated to 0 if it is less than 0 so the bar will not have negitive filling
  }

//returrns the bar it has created to be completed in updateBars
  return '<div class="' + hpsp + 'Bar"><div style="width:' + calculated + '%;" id="p0' + hpsp + 'Fill" class="' + hpsp + 'Fill">' + min + '</div></div>';

}

//This function makes the hp/sp bars and places them in the barsBox useing the updateBar
function updateBars() {
  barsBox.innerHTML = updateBar(Player0, 'hp', Player0.hp, START_HP);
  barsBox.innerHTML += updateBar(Player0, 'sp', Player0.sp, START_SP);
  barsBox.innerHTML += updateBar(Player1, 'hp', Player1.hp, START_HP);
  barsBox.innerHTML += updateBar(Player1, 'sp', Player1.sp, START_SP);
}

// EndTurn code
function endTurn() {
  playerTurn = !playerTurn; //switches playerTurn
  //  adds 1 sp to the player who's turn is switched to
  //  stops from overfilling
  if (Player0.sp < START_SP) {
    Player0.sp += !playerTurn;
  }
  if (Player1.sp < START_SP) {
    Player1.sp += playerTurn;
  }
  if (koCheck(Player0, 0) || koCheck(Player1, 0)) {
    hideControls();//Calls hideControls
    updateBars();//Calls updateBars
  } else {
    showControls();//Calls showControls
    updateBars();//Calls updateBars
  }
}

function hideControls() {
  //overwrites all controls with a reset button once the game is over
  controlsBox.innerHTML = '<button type="button" value="Refresh Page" name="refresh" onClick="window.location.reload();">Refresh </button>';
}

/*
Sometimes you Git the Hub
Sometimes the Hub Gits you

MHW = 'delicious'
MHWoutput > MHWinput
*/
