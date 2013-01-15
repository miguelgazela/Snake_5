$(document).ready(function(){
   	canvas = document.getElementById('gameField');
   	c = canvas.getContext('2d');

    if (Modernizr.localstorage)
        localStorageAvailable = true;
    else
        localStorageAvailable = false;

    setup(50, 70, 10, 50);
 });

function setup(h, w, ps, r) {
    height = h;
    width = w;
    pixelsize = ps;
    rate = r;

    snake_P1 = [];
    //snake_P2 = [];
    food = [];
    score_P1 = 0;
    //score_P2 = 0;
    gameHasStarted = false;
    gamePaused = false;

    canvas.height = h*ps;
    canvas.width = w*ps;

    $(document).keydown(function (e) {
        //console.log(e.which);
        switch(e.which) {
        case 38: // up P1
            if(dir != 2) {
                newdir = 0;
            }
            break;
        case 39: // right P1
            if(dir != 3) {
                newdir = 1;
            }
            break;
        case 40: // down P1
            if(dir != 0) {
                newdir = 2;
            }
            break;
            case 37: // left P1
                if(dir != 1) {
                    newdir = 3;
                }
            break;
            case 32: // space
            {
                if(!gameHasStarted)
                    startNewGame();
                else
                    togglePause();
            }
            break;
            case 67: // c
            {
                if(localStorageAvailable && localStorage['gameHasStarted'] === 'true')
                    resumeGame();
            }
            break;
            case 83: // s
            {
                //rate -= 20;
            }
            break;
        case 27: // esc
        {

        }
            break;
        case 87: // up P2
            break;
        case 83: // down P2
            break;
        case 65: // left P2
            break;
        case 68: // esc P2
            break;
        }
    });

    $(document).keyup(function(e) {
        switch(e.which) {
            case 83: // s
            {
                //rate += 20;
            }
            break;
        }
    });
    showIntro();
}

function showIntro() {
    c.fillStyle = '#000';
    c.fillRect(0, 0, width*pixelsize, height*pixelsize);
    c.fillStyle = '#fff';
    c.font = '30px sans-serif';
    c.textAlign = 'center';
    c.fillText('Snake', width/2*pixelsize, height/4*pixelsize, width*pixelsize);
    c.font = '12px sans-serif';
    c.fillText('Arrows = change direction.', width/2*pixelsize, height/2*pixelsize);
    c.fillText('Space = start/pause.', width/2*pixelsize, height/1.5*pixelsize);
    if(localStorageAvailable && (localStorage['gameHasStarted'] === 'true'))
        c.fillText('\'c\' = resume game.', width/2*pixelsize, height/1.4*pixelsize);
}

function startNewGame() {
    var x = Math.floor(width/2), y = Math.floor(height/2);
    genFood();    
    snake_P1 = [
        [x, y],
        [--x, y],
        [--x, y],
        [--x, y]
    ];
    dir = 1;
    newdir = 1;
    score_P1 = 0;
    gameHasStarted = true;
    gamePaused = false;

    // save game info
    if(localStorageAvailable) {
        localStorage['gameHasStarted'] = true;
        localStorage['dir'] = 1;
        localStorage['newdir'] = 1;
        localStorage['score_P1'] = 0;
        saveSnake();
    }
    frame();
}

function resumeGame() {
    // load snake_P1
    var snake_size = parseInt(localStorage['snake_size']);
    for(var i = 0; i < snake_size; i++) {
        snake_P1[i] = [parseInt(localStorage['snake_P1.'+i+'.x']),
                        parseInt(localStorage['snake_P1.'+i+'.y'])];
    }

    //snake_P2 = [];
    food = [parseInt(localStorage['food.x']),parseInt(localStorage['food.y'])];
    score_P1 = parseInt(localStorage['score_P1']);
    //score_P2 = 0;
    gameHasStarted = true;
    //gamePaused = true;
    dir = parseInt(localStorage['dir']);
    newdir = dir;

    c.fillStyle = '#000';
    c.fillRect(0, 0, width*pixelsize, height*pixelsize);
    c.fillStyle = '#fff';
    drawFood();
    drawSnake();

    togglePause();
}

function saveSnake() {
    if(localStorageAvailable) {
        for(var i = 0; i < snake_P1.length; i++) {
                localStorage['snake_P1.'+i+'.x'] = snake_P1[i][0];
                localStorage['snake_P1.'+i+'.y'] = snake_P1[i][1];
            }
            localStorage['snake_size'] = snake_P1.length;
    }
}

function endGame() {
    gameHasStarted = false;

    if(localStorageAvailable)
        localStorage['gameHasStarted'] = false;

    c.fillStyle = 'rgba(0,0,0,0.8)';
    c.fillRect(0, 0, width*pixelsize, height*pixelsize);
    c.fillStyle = '#f00';
    c.font = '20px sans-serif';
    c.textAlign = 'center';
    c.fillText('Game Over', width/2*pixelsize, height/2*pixelsize);
    c.fillStyle = '#fff';
    c.font = '12px sans-serif';
    c.fillText('Score: ' + score_P1, width/2*pixelsize, height/1.5*pixelsize);
}

 function togglePause() {
    if(!gamePaused) {
        gamePaused = true;
        c.fillStyle = '#fff';
        c.font = '20px sans-serif';
        c.textAlign = 'center';
        c.fillText('Paused', width/2*pixelsize, height/2*pixelsize);
    }
    else {
        gamePaused = false;
        frame();
    }
}

function testCollision(x, y) {
    var i, l;
    if(x < 0 || x > width-1) {
        return true;
    }
    if(y < 0 || y > height-1) {
        return true;
    }
    for(i = 0, l = snake_P1.length; i < l; i++) {
        if(x == snake_P1[i][0] && y == snake_P1[i][1]) {
            return true;
        }
    }
    return false;
}

 function genFood() {
    var x, y;
    do {
        x = Math.floor(Math.random()*(width-1));
        y = Math.floor(Math.random()*(height-1));
    } while(testCollision(x, y));
    food = [x, y];

    if(localStorageAvailable) {
        localStorage['food.x'] = food[0];
        localStorage['food.y'] = food[1];
    }
}

function drawSnake() {
    var i, l, x, y;
    for(i = 0, l = snake_P1.length; i < l; i++) {
        x = snake_P1[i][0];
        y = snake_P1[i][1];
        c.fillRect(x*pixelsize, y*pixelsize, pixelsize, pixelsize);
    }
}

function drawFood() {
    c.beginPath();
    c.arc((food[0]*pixelsize)+pixelsize/2, (food[1]*pixelsize)+pixelsize/2, pixelsize/2, 0, Math.PI*2, false);
    c.fill();
}

function updateScore() {
    $('#score').text(++score_P1);
    if(localStorageAvailable)
        localStorage['score_P1'] = score_P1;
}

function frame() {
    if(!gameHasStarted || gamePaused) {
        return;
    }

    var x = snake_P1[0][0], y = snake_P1[0][1];

    switch(newdir) {
        case 0:
            y--;
            break;
        case 1:
            x++;
            break;
        case 2:
            y++;
            break;
        case 3:
            x--;
            break;
    }

    if(testCollision(x, y)) {
        endGame();
        return;
    }

    snake_P1.unshift([x, y]);

    if(x == food[0] && y == food[1]) {
        updateScore();
        genFood();
    }
    else {
        snake_P1.pop();

    }
    dir = newdir;

    saveSnake();
    if(localStorageAvailable) {
        localStorage['rate'] = rate;
        localStorage['dir'] = newdir;
    }

    c.fillStyle = '#000';
    c.fillRect(0, 0, width*pixelsize, height*pixelsize);
    c.fillStyle = '#fff';
    drawFood();
    drawSnake();

console.log(rate);
    setTimeout(frame, rate);
}