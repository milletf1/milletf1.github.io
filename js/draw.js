(function() {
    var EDIBLE_POINT        = 10;
    var POINT_DISPLAY_X     = 20;
    var POINT_DISPLAY_Y     = 40;
    var CANVAS_WIDTH        = 800;
    var CANVAS_HEIGHT       = 600;
    var PLAYER_START_X      = 400;
    var PLAYER_START_Y      = 300;
    var PLAYER_DEFAULT_MOVE = 12;
    var SPRITE_SIZE         = 48;
    var IMAGES_TO_LOAD      = 2;
   
    var PLAYER_SPRITE_IMAGE = "images/ship_base.svg";
    var CANVAS_BG_IMAGE	    = "images/heic1107a.jpg";
    var CANVAS_BG_COLOUR    = "black";
    var POINTS_FONT_STYLE   = "30px Arial";
    var POINTS_FONT_COLOR   = "white";
    var END_GAME_FONT_STYLE = "30px Arial";

    var IN_GAME_STATE       = 1;
    var GAME_OVER_STATE     = 2;

    // start/end position of enemy sprites
    var TOP                 = 0;
    var RIGHT               = 1;
    var BOT                 = 2;
    var LEFT                = 3;

    var loadedImages = 0;
    var bgImage;
    var shipImage;
    var gameState;
    var gameInterval;
    var edible;
    var enemies;
    var player;
    var canvas;
    var ctx;
    $(document).ready(function() {
        
	function loadImages() {

            bgImage = new Image();
            bgImage.src = CANVAS_BG_IMAGE;
            bgImage.onload = imageOnLoad;
     
            shipImage = new Image();
            shipImage.src = PLAYER_SPRITE_IMAGE;
            shipImage.onload = imageOnLoad;
	}

        function imageOnLoad() {
            loadedImages++;
            
            if(loadedImages == IMAGES_TO_LOAD) {
                initInGameState();
            }
        }
        function generateEnemy() {
        
            var startSide = Math.floor(Math.random() * 4),
                endSide = Math.floor(Math.random() * 4);

            if(startSide === endSide) {
                endSide = (Math.floor( (Math.random() * 3) + 1 )) % 4;
            }

            var xStart = getEnemyXPos(startSide),
                yStart = getEnemyYPos(startSide),
                xEnd = getEnemyXPos(endSide),
                yEnd = getEnemyYPos(endSide),
                moveSpeed = getEnemySpeed();

            var enemy = SpriteFactory.createEnemy(moveSpeed, SPRITE_SIZE, xStart, yStart);
            enemy.setMove(xEnd, yEnd);
            
            return enemy;
        }

        function getEnemySpeed() {
            return Math.floor(Math.random() * 8 + 4);
        }
    
        function getEnemyXPos(posArgs) {
            
            var ret = null;

            switch(posArgs) {
                case TOP:
                case BOT:
                    ret = Math.floor(Math.random() * (CANVAS_WIDTH - SPRITE_SIZE) + (SPRITE_SIZE / 2));
                    break;
                case RIGHT:
                    ret = SPRITE_SIZE / 2 + CANVAS_WIDTH;
                    break;
                case LEFT:
                    ret = SPRITE_SIZE / 2 * -1;
                    break;
                default:
                    break;
            }
            return ret;
        }

        function getEnemyYPos(posArgs) {
            
            var ret = null;

            switch(posArgs) {
                case TOP:
                    ret = SPRITE_SIZE / 2 * -1;
                    break;
                case BOT:
                    ret = SPRITE_SIZE / 2 + CANVAS_HEIGHT;
                    break;
                case LEFT:
                case RIGHT:
                    ret = Math.floor(Math.random() * (CANVAS_HEIGHT - SPRITE_SIZE) + (SPRITE_SIZE / 2));
                    break;
                default:
                    break;
            }
            return ret;
        }

        function generateEdible() {
        
            var newX = Math.floor(Math.random() * ( CANVAS_WIDTH - (SPRITE_SIZE * 2) ) ) + SPRITE_SIZE;
            var newY = Math.floor(Math.random() * ( CANVAS_HEIGHT - (SPRITE_SIZE * 2) ) ) + SPRITE_SIZE;

            edible = SpriteFactory.createCollect(SPRITE_SIZE, newX, newY, EDIBLE_POINT);
        }

        function checkCollisions() {
            // check player collision against collection item
            if(player.checkCollision(edible)) {
                // todo: increment player points
                player.incrementScore(edible.getPoints());
                generateEdible();
                enemies.push(generateEnemy());
            }
            // check player collision against meteors
            enemies.forEach(function(enemy) {
                if(enemy.checkCollision(player)) {
                    player.setIsAlive(false); 
                }
            });
        }

        function updateSprites() {
            // add/remove meteor if needed

            // move player sprite
            if(player.getIsMoving()) {
                player.move();
            }
            // move enemies
            /*for(var i = 0; i < enemies.length; i++) {

                if(enemies[i].getIsMoving()) {
                    enemies[i].move();
                }
                else {
                    enemies[i] = generateEnemy();
                }
            }*/
        }
        function drawPoints(points) {
            ctx.fillStyle = POINTS_FONT_COLOR;
            ctx.font = POINTS_FONT_STYLE;
            ctx.textAlign="left";
            ctx.fillText("" + points, POINT_DISPLAY_X, POINT_DISPLAY_Y);
        }

        function drawBackground() {	    
	  
            ctx.drawImage(bgImage, 0, 0, canvas.width, canvas.height);
	    ctx.restore();
        }
 
        function drawInGameState() {
	   
            // draw background
            drawBackground();

            // draw player points
           // drawPoints(player.getScore());

            // draw player
            player.drawImg(ctx);

            // draw edibles
            //edible.draw(ctx);
            
            // draw enemies
            //enemies.forEach(function(enemy) {
            //    enemy.draw(ctx);
            //});
        }

        function displayEndGame() { 

            // draw background
            ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // draw Game Over            
            ctx.fillStyle = "white";
            ctx.font = "50px Arial";
            ctx.textAlign="center";
            ctx.fillText("Game Over", CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 25);

            // draw click to continue
            ctx.font = "18px Arial";
            ctx.fillText("Click to play again", CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);
            clearInterval(gameInterval);
        }
        function gameLoop() {
            
            switch(gameState) {
                /*
                case GAME_OVER_STATE:
                    displayEndGame();
                    break;
                */
                case IN_GAME_STATE:
                    inGameStateLoop();
                    break;
                default:
                    break;
            }
        }

        
        function inGameStateLoop() {
            updateSprites();
            //checkCollisions();           
            drawInGameState();
            
            if(player.getIsAlive() === false) {                
                gameState = GAME_OVER_STATE;
                displayEndGame();
            }
        };

        function canvasClickListener(event) {
            switch(gameState) {
                case IN_GAME_STATE:
			console.log(canvas.offsetLeft);
			console.log(canvas.offsetTop);
                    var x = event.pageX - canvas.offsetLeft;
                    var y = event.pageY - canvas.offsetTop;
                    player.setMove(x, y);
                    break;
                case GAME_OVER_STATE:
                    initInGameState();
                    break; 
                default:
                    break;
            }
        }

        function initCanvas() {
            
            // init canvas
            canvas = document.getElementById('canvas');        
            ctx = canvas.getContext('2d');
            canvas.addEventListener('click', canvasClickListener, false);            
        }

        function initInGameState() {
            // init player

            player = SpriteFactory.createPlayer(
              PLAYER_DEFAULT_MOVE, 
              SPRITE_SIZE, 
              PLAYER_START_X, 
              PLAYER_START_Y,
              shipImage);

            // init edible
            //generateEdible();

            // init enemies
            //enemies = [];
            //enemies.push(generateEnemy());

            gameState = IN_GAME_STATE;
	    // init timer	    
            gameInterval = setInterval(gameLoop, 50);
        }
	loadImages();
        initCanvas();
    });
})();
