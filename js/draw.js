(function() {
    var EDIBLE_POINT                    = 10;
    var POINT_DISPLAY_X                 = 20;
    var POINT_DISPLAY_Y                 = 40;
    var CANVAS_WIDTH                    = 800;
    var CANVAS_HEIGHT                   = 600;
    var PLAYER_START_X                  = 400;
    var PLAYER_START_Y                  = 300;
    var PLAYER_DEFAULT_MOVE             = 12;
    var SPRITE_SIZE                     = 48;
    var IMAGES_TO_LOAD                  = 4;

    var ENEMY_SPRITE_SIZE_MOD           = 24;
    var ENEMY_SPRITE_SIZE_BASE          = 24;
    var ENEMY_SPEED_BASE                = 8;
    var ENEMY_SPEED_MOD                 = 4;
    // game images   
    var WIDGET_SPRITE_IMAGE             = "images/crystal.svg";
    var PLAYER_SPRITE_IMAGE             = "images/ship_base.svg";
    var ASTEROID_SPRITE_IMAGE           = "images/asteroid.svg";
    var CANVAS_BG_IMAGE	                = "images/heic1107a.jpg";


    var CANVAS_BG_COLOUR                = "black";
    var POINTS_FONT_STYLE               = "30px Arial";
    var POINTS_FONT_COLOR               = "white";
    var END_GAME_FONT_STYLE             = "30px Arial";

    // game states
    var GAME_TITLE_STATE                = 0;
    var IN_GAME_STATE                   = 1;
    var GAME_OVER_STATE                 = 2;
    
    // start/end position of enemy sprites
    var TOP                             = 0;
    var RIGHT                           = 1;
    var BOT                             = 2;
    var LEFT                            = 3;

    var loadedImages = 0;

    var bgImage;
    var shipImage;
    var widgetImage;
    var asteroidImage;

    var gameState;
    var gameInterval;
    var edible;
    var enemies;
    var player;
    var canvas;
    var ctx;
    $(document).ready(function() {
        
        /**
         * sets image assets
         */
	    function loadImages() {

            bgImage = new Image();
            bgImage.src = CANVAS_BG_IMAGE;
            bgImage.onload = imageOnLoad;
     
            shipImage = new Image();
            shipImage.src = PLAYER_SPRITE_IMAGE;
            shipImage.onload = imageOnLoad;
            
            widgetImage = new Image();
            widgetImage.src = WIDGET_SPRITE_IMAGE;
            widgetImage.onload = imageOnLoad;

            asteroidImage = new Image();
            asteroidImage.src = ASTEROID_SPRITE_IMAGE;
            asteroidImage.onload = imageOnLoad;
        }

        /**
         * image on load function
         * checks if all images have been loaded,
         * and starts game if true.
         */
        function imageOnLoad() {
            loadedImages++;
            
            if(loadedImages == IMAGES_TO_LOAD) {
                initGame();
            }
        }
        /**
         * creates a meteorite entity
         */
        function generateEnemy() {
        
            var startSide = Math.floor(Math.random() * 4),
                endSide = Math.floor(Math.random() * 4);

            if(startSide === endSide) {
                endSide = (Math.floor( (Math.random() * 3) + 1 )) % 4;
            }

            var spriteSize = SPRITE_SIZE + Math.floor(Math.random() * ENEMY_SPRITE_SIZE_BASE - ENEMY_SPRITE_SIZE_MOD),
                rotationSpeed = Math.floor(Math.random() * 30),
                xStart = getEnemyXPos(startSide, spriteSize),
                yStart = getEnemyYPos(startSide, spriteSize),
                xEnd = getEnemyXPos(endSide, spriteSize),
                yEnd = getEnemyYPos(endSide, spriteSize),
                moveSpeed = getEnemySpeed();
    
            var enemy = SpriteFactory.createEnemy(moveSpeed, spriteSize, xStart, yStart, 
                    asteroidImage, rotationSpeed);
            enemy.setMove(xEnd, yEnd);
            
            return enemy;
        }
        /**
         * generates a random movement
         * speed for a meteorite
         */
        function getEnemySpeed() {
            return Math.floor(Math.random() * ENEMY_SPEED_BASE + ENEMY_SPEED_MOD);
        }
        /**
         * generates a meteorite's starting x position
         */
        function getEnemyXPos(posArgs, spriteSize) {
            
            var ret = null;

            switch(posArgs) {
                case TOP:
                case BOT:
                    ret = Math.floor(Math.random() * (CANVAS_WIDTH - spriteSize) + (spriteSize / 2));
                    break;
                case RIGHT:
                    ret = spriteSize / 2 + CANVAS_WIDTH;
                    break;
                case LEFT:
                    ret = spriteSize / 2 * -1;
                    break;
                default:
                    break;
            }
            return ret;
        }

        /**
         * generates a meteorite's starting y position
         */
        function getEnemyYPos(posArgs, spriteSize) {
            
            var ret = null;

            switch(posArgs) {
                case TOP:
                    ret = spriteSize / 2 * -1;
                    break;
                case BOT:
                    ret = spriteSize / 2 + CANVAS_HEIGHT;
                    break;
                case LEFT:
                case RIGHT:
                    ret = Math.floor(Math.random() * (CANVAS_HEIGHT - spriteSize) + (spriteSize / 2));
                    break;
                default:
                    break;
            }
            return ret;
        }

        /**
         * generates a widget
         */
        function generateEdible() {
        
            var newX = Math.floor(Math.random() * ( CANVAS_WIDTH - (SPRITE_SIZE * 2) ) ) + SPRITE_SIZE;
            var newY = Math.floor(Math.random() * ( CANVAS_HEIGHT - (SPRITE_SIZE * 2) ) ) + SPRITE_SIZE;

            edible = SpriteFactory.createCollect(
                SPRITE_SIZE / 2, 
                newX, 
                newY, 
                EDIBLE_POINT, 
                widgetImage);
        }

        /**
         * checks sprite collision
         */
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

        /**
         * updates position of the sprites
         */
        function updateSprites() {
            // add/remove meteor if needed

            // move player sprite
            if(player.getIsMoving()) {
                player.move();
            }
            // move enemies
            for(var i = 0; i < enemies.length; i++) {

                if(enemies[i].getIsMoving()) {
                    enemies[i].move();
                }
                else {
                    enemies[i] = generateEnemy();
                }
            }
        }
        /**
         * displays player score
         */
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
        
        /**
         * draw loop
         */
        function drawInGameState() {
	   
            // draw background
            drawBackground();

            // draw player points
            drawPoints(player.getScore());

            // draw player
            player.drawSprite(ctx);

            // draw edibles
            edible.drawSprite(ctx);
            
            // draw enemies
            enemies.forEach(function(enemy) {
                enemy.drawSprite(ctx);
            });
        }

        /**
         * draw title screen
         */
        function displayTitleScreen() {

            // draw background
            ctx.fillStyle = "black";
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // setup text
            ctx.fillStyle = "white";
            ctx.font = "24px Arial";
            ctx.textAlign = "left";

            var xPos = canvas.width / 4;
            var xPosText = xPos + 100;
            var yPos = canvas.height / 5;

            // draw spaceship
            ctx.drawImage(shipImage, xPos, yPos, 72, 72);
            ctx.fillText("You are a spaceship", xPosText, yPos + 40);
            // draw widget
            ctx.drawImage(widgetImage, xPos, yPos * 2, 72, 72);
            ctx.fillText("Collect the space widgets", xPosText, yPos * 2 + 40);
            //draw asteroid
            ctx.drawImage(asteroidImage, xPos, yPos * 3, 72, 72);
            ctx.fillText("Avoid the asteroids", xPosText, yPos * 3 + 40);
        }

        /**
         * draws game over screen
         */
        function displayEndGame() {
            clearInterval(gameInterval);

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
        }

        /**
         * main game loop  
         */
        function gameLoop() {
            
            switch(gameState) {
                case GAME_TITLE_STATE:
                    displayTitleScreen();
                    break; 
                case GAME_OVER_STATE:
                    displayEndGame();
                    break;
                
                case IN_GAME_STATE:
                    inGameStateLoop();
                    break;
                default:
                    break;
            }
        }

        /**
         * loop that runs while a game is active
         */
        function inGameStateLoop() {
            updateSprites();
            checkCollisions();           
            drawInGameState();
            
            if(player.getIsAlive() === false) {                
                gameState = GAME_OVER_STATE;
            }
        };

        /**
         * canvas on click listener
         */
        function canvasClickListener(event) {

            switch(gameState) {
                case IN_GAME_STATE:
                    var x = event.pageX - canvas.offsetLeft;
                    var y = event.pageY - canvas.offsetTop;
                    player.setMove(x, y);
                    break;
                case GAME_TITLE_STATE:
                    
                case GAME_OVER_STATE:
                    initInGameState();
                    break; 
                default:
                    break;
            }
        }

        /**
         * initializes game canvas
         */
        function initCanvas() {
            
            // init canvas
            canvas = document.getElementById('canvas');        
            ctx = canvas.getContext('2d');
            canvas.addEventListener('click', canvasClickListener, false);            
        }

        function initGame() {
            gameState = GAME_TITLE_STATE;
            displayTitleScreen();
        }

        /**
         * initializes in game state
         */
        function initInGameState() {
           
            // init player
            player = SpriteFactory.createPlayer(
              PLAYER_DEFAULT_MOVE, 
              SPRITE_SIZE, 
              PLAYER_START_X, 
              PLAYER_START_Y,
              shipImage);

            // init edible
            generateEdible();

            // init enemies
            enemies = [];
            enemies.push(generateEnemy());

            gameState = IN_GAME_STATE;
            gameInterval = setInterval(gameLoop, 50);
        }        
	    loadImages();
        initCanvas();
    });
})();
