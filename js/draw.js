(function() {
    var EDIBLE_POINT        = 10;
    var CANVAS_WIDTH        = 800;
    var CANVAS_HEIGHT       = 600;
    var PLAYER_START_X      = 400;
    var PLAYER_START_Y      = 300;
    var PLAYER_DEFAULT_MOVE = 12;
    var SPRITE_SIZE         = 8;
    // start/end position of enemy sprites
    var TOP                 = 0;
    var RIGHT               = 1;
    var BOT                 = 2;
    var LEFT                = 3;

    var gameInterval;
    var edible;
    var enemies;
    var player;
    var canvas;
    var ctx;
    $(document).ready(function() {
        

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
                generateEdible();
                enemies.push(generateEnemy());
            }
            // check player collision against meteors
            enemies.forEach(function(enemy) {
                if(enemy.checkCollision(player)) {
                    console.log("player is kill");    
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
            for(var i = 0; i < enemies.length; i++) {

                if(enemies[i].getIsMoving()) {
                    enemies[i].move();
                }
                else {
                    enemies[i] = generateEnemy();
                }
            }
        }
        
        function draw() {

            // draw background
            ctx.fillStyle = "white";
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // draw player
            player.draw(ctx);

            // draw edibles
            edible.draw(ctx);
            
            // draw enemies
            enemies.forEach(function(enemy) {
                enemy.draw(ctx);
            });
        }

        function gameLoop() {
            // check if game still in progress
            updateSprites();
            checkCollisions();
            draw();
        }

        function canvasClickListener(event) {
            var x = event.pageX - canvas.offsetLeft;
            var y = event.pageY - canvas.offsetTop;
            player.setMove(x, y);
        }

        function init() {
            // init canvas
            canvas = document.getElementById('canvas');        
            ctx = canvas.getContext('2d');
            canvas.addEventListener('click', canvasClickListener, false);
            // init player
            player = SpriteFactory.createPlayer(
              PLAYER_DEFAULT_MOVE, SPRITE_SIZE, PLAYER_START_X, PLAYER_START_Y);

            // init timer
            gameInterval = window.setInterval(gameLoop, 50);

            // init edible
            generateEdible();

            // init enemies
            enemies = [];
            enemies.push(generateEnemy());
        }
        init();
    });
})();
