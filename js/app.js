/* eslint-disable no-undef */
/* eslint-disable func-names */
/* eslint-disable no-param-reassign */

// player, enemies, items
let player;
let heart;
let gem;
let key;
const allEnemies = [];

// keyboard controls
let rightPressed = false;
let leftPressed = false;
let downPressed = false;
let upPressed = false;

// stats
let lifes = 3;
let rounds = 0;
const hearts = document.getElementById('hearts');
const roundsOutput = document.getElementById('rounds');

// show how many lifes are left
function showLife() {
  hearts.innerHTML = '';
  for (let i = 0; i < lifes; i += 1) {
    const heartsLeft = document.createElement('img');
    heartsLeft.setAttribute('src', 'images/Heart.png');
    hearts.appendChild(heartsLeft);
  }
}

// show overlay
function overlayOn(id) {
  document.getElementById(id).style.display = 'block';
}

// hide overlay
function overlayOff() {
  document.getElementById('win').style.display = 'none';
}

// checks if player is hit
function collisionDetection() {
  for (let i = 0; i < allEnemies.length; i += 1) {
    const hit = allEnemies[i];
    if (player.x + player.width > hit.x
      && player.x - player.width < hit.x + hit.width
      && player.y + player.height > hit.y
      && player.y - player.height < hit.y + hit.height) {
      // take one life
      lifes -= 1;
      showLife();

      //  game over alert
      if (lifes === 0) {
        overlayOn('game-over');
      }

      // set player back to first position
      player.x = 200;
      player.y = 400;
    }
  }
}

// show item
function showItem(item) {
  item.x = item.show;
}

// hide item
function hideItem(item) {
  item.x = -100;
}

// speed up the bugs
function hurryBug() {
  for (let i = 0; i < allEnemies.length; i += 1) {
    const hit = allEnemies[i];
    hit.fast += 1;
  }
}

// slow down the bugs
function slowBug() {
  for (let i = 0; i < allEnemies.length; i += 1) {
    const hit = allEnemies[i];
    hit.fast /= 2;
  }
}

// the bugs
const Enemy = function (lane, fast) {
  this.x = -130;
  this.y = lane;
  this.fast = fast;
  this.height = 25;
  this.width = 45;
  this.sprite = 'images/enemy-bug.png';
};

// checks if player reaches item
function collectionDetection(item) {
  if (player.x + player.width > item.x
    && player.x - player.width < item.x + item.width
    && player.y + player.height > item.y
    && player.y - player.height < item.y + item.height) {
    hideItem(item);

    // check if collected item is a heart
    if (item === heart && lifes < 5) {
      // add one life
      lifes += 1;
      showLife();
    }

    // check if collected item is gem
    if (item === gem) {
      // slow bugs
      slowBug();
    }

    // check if collected item is gem
    if (item === key) {
      // release the bugs
      const i = allEnemies.length;
      if (i % 3 === 0) {
        const enemy = new Enemy(140, 2);
        allEnemies.push(enemy);
      } else if (i % 2 === 0) {
        const enemy = new Enemy(55, 2);
        allEnemies.push(enemy);
      } else {
        const enemy = new Enemy(255, 2);
        allEnemies.push(enemy);
      }
    }
  }
}

// move the bugs
Enemy.prototype.update = function () {
  if (this.x < 500) {
    this.x = this.x + this.fast;
  } else {
    this.x = -130;
  }
};

// draw bugs
Enemy.prototype.render = function () {
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// create bugs
const enemy1 = new Enemy(55, 3);
const enemy2 = new Enemy(140, 1);
const enemy3 = new Enemy(225, 2);

// put bugs in the allEnemies Array
allEnemies.push(enemy1);
allEnemies.push(enemy2);
allEnemies.push(enemy3);

// Player
// eslint-disable-next-line func-names
const Player = function () {
  this.sprite = 'images/char-cat-girl.png';
  this.x = 200;
  this.y = 400;
  this.width = 25;
  this.height = 45;
};

// in case of reaching the water
function win() {
  rounds += 1;
  roundsOutput.textContent = rounds;
  hideItem(heart);
  hideItem(gem);
  hideItem(key);

  // show heart, gem, key
  if (rounds % 7 === 0) {
    showItem(heart);
  } else if (rounds % 4 === 0) {
    showItem(gem);
  } else if (rounds % 10 === 0) {
    showItem(key);
  }

  // ask player to go outside when 50 rounds are played
  if (rounds > 0 && (rounds % 50) === 0) {
    overlayOn('win');
  }
  player.y = 400;
  player.x = 200;
  hurryBug();
}

// move the player around
Player.prototype.update = function () {
  if (rightPressed && player.x < 410) {
    player.x += 5;
  } else if (leftPressed && player.x > 0) {
    player.x -= 5;
  } else if (upPressed && player.y > -30) {
    player.y -= 5;
  } else if (downPressed && player.y < 400) {
    player.y += 5;
  }

  // check if player is hit
  collisionDetection();
  if (player.y === -30) {
    win();
  }
};

// draw player
Player.prototype.render = function () {
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Place the player object in a variable called player
player = new Player();

// Heart
const Heart = function () {
  this.sprite = 'images/Heart.png';
  this.show = Math.floor(Math.random() * Math.floor(400));
  this.x = -100;
  this.y = 170;
  this.width = 25;
  this.height = 45;
};

// draw heart
Heart.prototype.render = function () {
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// check if heart is collected
Heart.prototype.update = function () {
  collectionDetection(heart);
};

// call Heart
heart = new Heart();

// Gem
const Gem = function () {
  this.sprite = 'images/Gem Orange.png';
  this.show = Math.floor(Math.random() * Math.floor(400));
  this.x = -100;
  this.y = 170;
  this.width = 30;
  this.height = 30;
};

// draw Gem
Gem.prototype.render = function () {
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// check if Gem is collected
Gem.prototype.update = function () {
  collectionDetection(gem);
};

// call Gem
gem = new Gem();

// Key
const Key = function () {
  this.sprite = 'images/Key.png';
  this.show = Math.floor(Math.random() * Math.floor(400));
  this.x = -100;
  this.y = 170;
  this.width = 30;
  this.height = 30;
};

// draw Key
Key.prototype.render = function () {
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// check if Key is collected
Key.prototype.update = function () {
  collectionDetection(key);
};

// call Key
key = new Key();

// reload page
function reload() {
  document.location.reload();
}

// play again after game over
const again = document.getElementById('again');
again.addEventListener('click', reload);

// play some more after 50, 100... games
const more = document.getElementById('more');
more.addEventListener('click', overlayOff);

// keys are pressed
function keyDownHandler(e) {
  if (e.keyCode === 39) {
    rightPressed = true;
  } else if (e.keyCode === 37) {
    leftPressed = true;
  } else if (e.keyCode === 38) {
    upPressed = true;
  } else if (e.keyCode === 40) {
    downPressed = true;
  }
}

// keys are not pressed anymore
function keyUpHandler(e) {
  if (e.keyCode === 39) {
    rightPressed = false;
  } else if (e.keyCode === 37) {
    leftPressed = false;
  } else if (e.keyCode === 38) {
    upPressed = false;
  } else if (e.keyCode === 40) {
    downPressed = false;
  }
}

// listen for keyboard events
document.addEventListener('keydown', keyDownHandler, false);
document.addEventListener('keyup', keyUpHandler, false);

// check lifes left & display hearts
showLife();
