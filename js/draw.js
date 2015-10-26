$(document).ready(function() {

    
    // onclick  = move ship


    var canvas = document.getElementById('canvas');
    var ctx = canvas.getContext('2d');

    var id = ctx.createImageData(1,1); 
    var d = id.data;    
    d[0] = 255; // r
    d[1] = 255; // g
    d[2] = 255; // b
    d[3] = 0;   // a

    var x = 32;
    var y = 32;
/*
    function drawDot(ctx, img, x, y) {

        ctx.putImageData(img, x, y);
    }
*/
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    var gameInterval;

    var player = SpriteFactory.createPlayer(0, 8, 32, 32);
    player.draw(ctx);

    function updateSprites() {
        console.log("updating sprites");
        // add/remove meteor if needed
        // move player sprite
        // move meteors
    }
    
    function checkCollisions() {
        console.log("checking collisions");
        // check player collision against collection item
        // check player collision against meteors
    }

    function draw() {
        console.log("drawing sprites");
    }

    function gameLoop() {
        // check if game still in progress
        updateSprites();
        checkCollisions();
        draw();
    }
    
//    gameInterval = window.setInterval(gameLoop, 100);
/*

    var path = new Path2D();

    path.arc(x, y, 8, 0, Math.PI * 2, false);
    ctx.fillStyle = "rgba(255, 0, 0, 1)";
    ctx.fill(path);
*/
});
