(function() {
    var EDIBLE_POINT        = 10;
    var CANVAS_WIDTH        = 800;
    var CANVAS_HEIGHT       = 600;
    var PLAYER_START_X      = 32;
    var PLAYER_START_Y      = 32;
    var PLAYER_DEFAULT_MOVE = 12;
    var SPRITE_SIZE         = 8;
    var gameInterval;
    var edible;
    var player;
    var canvas;
    var ctx;
    $(document).ready(function() {
        
        function updateSprites() {
            // add/remove meteor if needed

            // move player sprite
            if(player.getIsMoving()) {
                player.move();
            }
            // move meteors
        }
        
        function checkCollisions() {
            // check player collision against collection item
            if(player.checkCollision(edible)) {
                // todo: increment player points
                generateEdible();
            }
            // check player collision against meteors
        }

        function generateEdible() {
        
            var newX = Math.floor(Math.random() * ( CANVAS_WIDTH - (SPRITE_SIZE * 2) ) ) + SPRITE_SIZE;
            var newY = Math.floor(Math.random() * ( CANVAS_HEIGHT - (SPRITE_SIZE * 2) ) ) + SPRITE_SIZE;

            edible = SpriteFactory.createCollect(SPRITE_SIZE, newX, newY, EDIBLE_POINT);
        }

        function draw() {

            // draw background
            ctx.fillStyle = "white";
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // draw player
            player.draw(ctx);

            //draw edibles
            edible.draw(ctx);
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
        }
        init();
    });
})();
