var SpriteFactory = (function () {

    var PLAYER_COLOUR   = "rgba(255, 0, 0, 1)";
    var EAT_COLOUR      = "rgba(0, 255, 0, 1)"; 
    var ENEMY_COLOUR    = "rgba(0, 0, 255, 1)";

    /**
     * Base sprite
     */
    function _baseSprite(bgColor, size, xPos, yPos) {    
        this.bgColor = bgColor;
        this.size = size;        
        this.xPos = xPos;
        this.yPos = yPos;
    }
    
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

    _baseSprite.prototype.checkCollision = function(otherSprite) {
   	// todo implement pixel collision 
        var dx = this.xPos - otherSprite.getXPos(),
            dy = this.yPos - otherSprite.getYPos();
        var dist = Math.sqrt(dx * dx + dy * dy);

        return dist < this.size + otherSprite.getSize()
    };

    _baseSprite.prototype.draw = function(ctx) {
        var path = new Path2D();
        path.arc(this.xPos, this.yPos, this.size, 0, Math.PI * 2, false);
        ctx.fillStyle = this.bgColor;
        ctx.fill(path);
    };
    
    
    _baseSprite.prototype.constructor = _baseSprite;

    /**
     * Edible sprite
     */
    function _edibleSprite(size, xPos, yPos, pointValue) {
        _baseSprite.call(this, EAT_COLOUR, size, xPos, yPos);
        this.pointValue = pointValue;
    };
    _edibleSprite.prototype = Object.create(_baseSprite.prototype);
    _edibleSprite.prototype.getPoints = function() {
        return this.pointValue;
    };
    /**
     * Movable sprite
     */
    function _movableSprite(moveSpeed, bgColor, size, xPos, yPos) {
        _baseSprite.call(this, bgColor, size, xPos, yPos);
        this.moveSpeed = moveSpeed;
	this.size = 48;
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
        _movableSprite.call(this, moveSpeed, PLAYER_COLOUR, size, xPos, yPos);         
 	this.points = 0;
        this.isAlive = true;
	this.spriteImg = spriteImage;	// todo: sort this out in base sprite
//	this.spriteImg.src = "images/ship_base.svg";	
	//todo real sprite size;
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
    
    _playerSprite.prototype.drawImg = function(ctx) {
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
    var createCollect = function(size, xPos, yPos, pointValue) {
        return new _edibleSprite(size, xPos, yPos, pointValue);
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
