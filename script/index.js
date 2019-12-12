/*
JS Fighter project continued on by OWA development
OWA Employees
1. Ashton Sisson
2.Harry Nelson
3.Daniel Williams
4.
9.Mykahl Luciano
*/

//Sets default values for the fighter class
const START_HP = 100;
const START_SP = 20;
const DEFAULT_ATK = 5;
const DEFAULT_DEF = 5;
const DEFAULT_TEK = 5;

//sets constants names
const P0NAME = 'Crash';
const P0CHARA = 'crashr';
const P1NAME = 'Sam';
const P1CHARA = 'saml';

let playerTurn = false; //declares a value used for tracking player turn.
let logging = true; //declares a value used to toggle logging

//creates the players
let Player0;
let Player1;

// declared variables for the html div boxes
let gameBox;
let headerBox;
let graphicsBox;
let barsBox;
let controlsBox;
let outputBox;
let sp;

//Creates a class called Fighter to generate fighters easily and using less code
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
    console.log(this.name + ' attacked ' + target.name); //logs attack

    let damage = (Math.round(Math.random() + 1) * this.atk) //Does the attack with a random chance to be double. this is done by getting random number between one and zero, converts it to just one or zero and adds one to it making it randomly one or two. then it takes the one or two times the damage to deal random double damage
    let reducedDamage = Math.round(damage / 6) //Creates reducedDamage which is used to deal less damage then normal for when they dodge
    let dodge = Math.round(Math.random()) //Gets a random value to determine wether to dodge

    if (dodge) {
      outputBox.innerHTML += '<br>' + target.name + ' dodged ' + this.name + '\'s attack and was hit only hit for ' + reducedDamage + ' damage'; // outputs to the outputbox
      damage = reducedDamage // sets damage to reduced damage when dodgeing
      document.getElementById(this.charaName).src = 'img/' + this.charaName + '_attack.png'; //sets the attacker to attacking graphics
      document.getElementById(target.charaName).src = 'img/' + target.charaName + '_dodge.png'; //sets the target to dodgeing graphics
      koCheck(target, damage); //runs ko check
    } else {
      outputBox.innerHTML += '<br>' + this.name + ' attacked ' + target.name + ' for ' + damage + ' damage!' // outputs to the outputbox
      document.getElementById(this.charaName).src = 'img/' + this.charaName + '_attack.png'; //sets the attacker to attacking graphics
      document.getElementById(target.charaName).src = 'img/' + target.charaName + '_hit.png'; //sets the target to hit graphics
      koCheck(target, damage); //runs ko check
    }
  }

  //used for a single attack
  single(target) {
    this.attack(target);
    endTurn();
  }

  //used for a double attack
  double(target) {
    this.attack(target);
    this.attack(target);
    endTurn();
  }

  //used to recover
  recover() {
    console.log('Recovered!'); //Logs the recovery in console

    //save old text
    let oldtext = outputBox.innerHTML;
    //if they have enough Sp
    if (this.sp >= 3) {
      //minus 3 sp from total sp
      this.sp = this.sp - 3;
      //calculate recovery
      let recovery = this.tek * 2;
      //heal player
      koCheck(this, -recovery);
      outputBox.innerHTML += '<br>' + this.name + ' Recovered ' + recovery; //logs recovery to output box
      document.getElementById(this.charaName).src = 'img/' + this.charaName + '_spell.png'; //sets player casting the recovery spell to spell graphics
    } else {
      outputBox.innerHTML = "not enough SP" //If the sp is to low it logs to the output box
    }
    endTurn() // calls end turn
  }




}

//function used to start up the game
function startup() {
  //creates two players using the fighter class
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

  //used to log players stats in the console
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
    controlsBox.innerHTML += '<br><button type="button" name="attack" onclick="Player1.double(Player0)">Double Attack!</button><br>';
    controlsBox.innerHTML += '<br><button type="button" name="attack" onclick="Player1.recover(Player0)">Recover</button><br>';
  } else {
    //show buttons for player0 and overwrites player1's controls
    controlsBox.innerHTML = '<button type="button" name="attack" onclick="Player0.single(Player1)">Single Attack!</button>';
    controlsBox.innerHTML += '<br><button type="button" name="attack" onclick="Player0.double(Player1)">Double Attack!</button><br>';
    controlsBox.innerHTML += '<br><button type="button" name="attack" onclick="Player0.recover(Player1)">Recover</button><br>';
  }
}

//checks the target's HP is less than or equal to 0, Then retuns true or false.
function koCheck(target, amount) {
  target.hp = target.hp - amount; // subtracts/heals damage

  if (target.hp <= 0) {
    document.getElementById(target.charaName).src = 'img/' + target.charaName + '_ko.png'; //Sets the charectors graphics to ko if hp is zero or less
    hideControls(); //Calls hide controls to end the game if they are KOed
    return true; //returns KO check as true
  } else {
    return false; //returns KO check as false
  }
}

//This function takes all the info to build an HP or SP bar, and ensure it is not greater than 100 or less than 0
function updateBar(player, hpsp, min, max) {
  let calculated = ((min / max) * 100); //sets calculated % for the health bar as min/max then turns to a percent

  //If calulated is greater than or less then the calculated then it sets it too 100% or 0% accordingly
  if (calculated > 100) {
    calculated = 100;
  } else if (calculated < 0) {
    calculated = 0;
  }

  //Displays respective bars
  return '<div class="' + hpsp + 'Bar"><div style="width:' + calculated + '%;" id="p0' + hpsp + 'Fill" class="' + hpsp + 'Fill">' + min + '</div></div>';

}

//This function makes the hp/sp bars and places them in the barsBox useing the updateBar
function updateBars() {
  barsBox.innerHTML = updateBar(Player0, 'hp', Player0.hp, START_HP);
  barsBox.innerHTML += updateBar(Player0, 'sp', Player0.sp, START_SP);
  barsBox.innerHTML += updateBar(Player1, 'hp', Player1.hp, START_HP);
  barsBox.innerHTML += updateBar(Player1, 'sp', Player1.sp, START_SP);
}

// Creates endTurn used to either end the turn or pass it onto the next player
function endTurn() {
  playerTurn = !playerTurn; //inverts value for playerTurn

  //runs koCheck to see if either player is KOed
  if (koCheck(Player0, 0) || koCheck(Player1, 0)) {
    hideControls(); //calls hideControls to end the game
    updateBars(); //calls updateBars in order to update the bars
  } else {
    showControls() //shows controls for next players turn
    updateBars(); //calls updateBars in order to update the bars
  }
}

//creates function for hiding controls to end the game by showing a reset button to restart the game
function hideControls() {
  //overwrites the contols with a reset button to restart the game
  controlsBox.innerHTML = '<button type="button" value="Refresh Page" name="refresh" onClick="window.location.reload();">Refresh </button>';
}

/*
MHW = 'delicious'
MHWoutput > MHWinput

Sometimes you Git the Hub...
Sometimes the Hub Git you!!!
*/
