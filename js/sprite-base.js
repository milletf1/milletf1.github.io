var SpriteFactory = (function () {

    var PLAYER_COLOUR   = "rgba(255, 0, 0, 1)";
    var EAT_COLOUR      = "rgba(0, 255, 0, 1)"; 
    var ENEMY_COLOUR    = "rgba(0, 0, 255, 1)";

    /**
     * Base sprite
     */
    function _baseSprite(size, xPos, yPos, spriteImage) {        
        this.size = size;        
        this.xPos = xPos;
        this.yPos = yPos;
        this.spriteImg = spriteImage;
    }    
    _baseSprite.prototype.constructor = _baseSprite;

    _baseSprite.prototype.getXPos = function() {
        return this.xPos;
    };
    
    _baseSprite.prototype.getYPos = function() {
        return this.yPos;
    };

    _baseSprite.prototype.setXPos = function(x) {
        this.xPos = x;
    };

    _baseSprite.prototype.setYPos = function(y) {
        this.yPos = y;
    };

    _baseSprite.prototype.getSize = function() {
        return this.size;
    };

    _baseSprite.prototype.drawSprite = function(ctx) {
        ctx.drawImage(this.spriteImg, this.xPos, this.yPos, this.size, this.size);	   	   
    };

    _baseSprite.prototype.getImage = function() {
        return this.spriteImg;
    };

    _baseSprite.prototype.getImageData = function() {

        var canvas = document.createElement("canvas");
        canvas.width = this.size;
        canvas.height = this.size;

        var ctx = canvas.getContext("2d");
        ctx.drawImage(this.spriteImg, 0, 0, this.size, this.size);

        return ctx.getImageData(0, 0, canvas.width, canvas.height).data;        
    }

    _baseSprite.prototype.checkCollision = function(otherSprite, bgImage) {

        var thisX = Math.round(this.xPos);
        var thisY = Math.round(this.yPos);
        var otherX = Math.round(otherSprite.getXPos());
        var otherY = Math.round(otherSprite.getYPos());

        // find top left and bottom right corners of overlap
        var xMin = Math.max(thisX, otherX),
            yMin = Math.max(thisY, otherY),
            xMax = Math.min(thisX + this.size, otherX + otherSprite.getSize()),
            yMax = Math.min(thisY + this.size, otherY + otherSprite.getSize());
        
        // return false if there is not an overlap
        if(xMin >= xMax || yMin >= yMax) {
            return false;
        }

        // perform collision check        
        var pixelsThis = this.getImageData();
        var pixelsOther = otherSprite.getImageData();

        for(var pX = xMin; pX < xMax; pX++) {
            for(var pY = yMin; pY < yMax; pY++) {               

                // translate pixel location                
                var pixel1 = ((pX - thisX) + (pY - thisY) * this.size) * 4 + 3;
                var pixel2 = ((pX - otherX) + (pY - otherY) * otherSprite.getSize()) * 4 + 3;
                              
                if(pixelsThis[pixel1] !== 0 && pixelsOther[pixel2] !== 0) {
                    return true;
                }        
            }
        }
        return false;
    };

     
    /**
     * Edible sprite
     */
    function _edibleSprite(size, xPos, yPos, pointValue, spriteImage) {
        _baseSprite.call(this, size, xPos, yPos, spriteImage);

        this.pointValue = pointValue;
    };
    _edibleSprite.prototype = Object.create(_baseSprite.prototype);

    _edibleSprite.prototype.getPoints = function() {
        return this.pointValue;
    };

    /**
     * Movable sprite
     */
    function _movableSprite(moveSpeed, size, xPos, yPos, spriteImage) {
        _baseSprite.call(this, size, xPos, yPos, spriteImage);

        this.moveSpeed = moveSpeed;
        this.xTarget = xPos;
        this.yTarget = yPos;
        this.isMoving = false;
	    this.xOffset = 0;
    	this.yOffset = 0;
    };
    _movableSprite.prototype = Object.create(_baseSprite.prototype);

    _movableSprite.prototype.getIsMoving = function () {
        return this.isMoving;
    };  

    _movableSprite.prototype.setMove = function(x, y) {
        this.xTarget = x + -this.xOffset;
        this.yTarget = y + -this.yOffset;
        this.isMoving = true;
    };

    _movableSprite.prototype.move = function() {

        var deltaX = this.xTarget - this.xPos;
        var deltaY = this.yTarget - this.yPos;

        var dist = Math.sqrt(deltaX*deltaX+deltaY*deltaY);
        
        var velX = (deltaX/dist) * this.moveSpeed;
        var velY = (deltaY/dist) * this.moveSpeed;

        if(dist > this.moveSpeed) {
            this.xPos += velX;
            this.yPos += velY;
        }       
        else {
            
            //normalise
            var normX = velX / this.moveSpeed,
                normY = velY / this.moveSpeed;
           
            // update distance
            velX = normX * Math.floor(dist);
            velY = normY * Math.floor(dist);

            this.xPos += velX;
            this.yPos += velY;

            // move 
            this.isMoving = false;
        }    
    };

    /**
     * Player sprite
     */
    function _playerSprite(moveSpeed, size, xPos, yPos, spriteImage) {
        _movableSprite.call(this, moveSpeed, size, xPos, yPos, spriteImage);         
 	
        this.points = 0;
        this.isAlive = true;
    	this.xOffset = size/2;
    	this.yOffset = size/2;
    };
    _playerSprite.prototype = Object.create(_movableSprite.prototype);

    _playerSprite.prototype.getScore = function() {
        return this.points;
    };
    _playerSprite.prototype.getIsAlive = function() {
        return this.isAlive;
    };
    _playerSprite.prototype.setIsAlive = function(aliveState) {
        this.isAlive = aliveState;
    };

    _playerSprite.prototype.incrementScore = function(points) {
        this.points += points;
    };
    
    _playerSprite.prototype.drawSprite = function(ctx) {
        ctx.save();

	    // set translate
        var x = this.xPos + this.xOffset;
        var y = this.yPos + this.yOffset;
        ctx.translate(x , y);
     
        // set rotation
        var deltaX = this.xTarget - this.xPos;
        var deltaY = this.yTarget - this.yPos;
        var rot = Math.atan2(deltaY, deltaX);
     
        ctx.rotate(rot);
     
        ctx.drawImage(this.spriteImg, -this.xOffset, -this.yOffset, this.size, this.size);	   
    
    	ctx.restore();
    };
    
    _playerSprite.prototype.getImageData = function() {

        var canvas = document.createElement("canvas");
        canvas.width = this.size;
        canvas.height = this.size;

        var ctx = canvas.getContext("2d");
       
        ctx.save();

	    // set translate
        var x = this.xOffset;
        var y = this.yOffset;
        ctx.translate(x , y);
     
        // set rotation
        var deltaX = this.xTarget - this.xPos;
        var deltaY = this.yTarget - this.yPos;
        var rot = Math.atan2(deltaY, deltaX);
     
        ctx.rotate(rot);
     
        ctx.drawImage(this.spriteImg, -this.xOffset, -this.yOffset, this.size, this.size);	   
    
    	ctx.restore();
        
        return ctx.getImageData(0, 0, canvas.width, canvas.height).data;        
    }
    /**
     * Enemy sprite
     */
    function _enemySprite(moveSpeed, size, xPos, yPos) {
        _movableSprite.call(this, moveSpeed, ENEMY_COLOUR, size, xPos, yPos);   
    };
    _enemySprite.prototype = Object.create(_movableSprite.prototype);

    /**
     * Factory
     */
    var createPlayer = function(moveSpeed, size, xPos, yPos, shipImage) {
        return new _playerSprite(moveSpeed, size, xPos, yPos, shipImage);
    };
    var createCollect = function(size, xPos, yPos, pointValue, spriteImage) {
        return new _edibleSprite(size, xPos, yPos, pointValue, spriteImage);
    };

    var createEnemy = function(moveSpeed, size, xPos, yPos) {
        return new _enemySprite(moveSpeed, size, xPos, yPos);
    };

    return {
        createEnemy: createEnemy,
        createCollect: createCollect,
        createPlayer: createPlayer      
    };
})();
