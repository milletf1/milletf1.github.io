var SpriteFactory = (function () {

    var PLAYER_COLOUR   =   "rgba(255, 0, 0, 1)";

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

    _baseSprite.prototype.draw = function(ctx) {
        var path = new Path2D();
        path.arc(this.xPos, this.yPos, this.size, 0, Math.PI * 2, false);
        ctx.fillStyle = this.bgColor;
        ctx.fill(path);
    };
    _baseSprite.prototype.constructor = _baseSprite; 
    /**
     * Movable sprite
     */
    function _movableSprite(moveSpeed, bgColor, size, xPos, yPos) {
        _baseSprite.call(this, bgColor, size, xPos, yPos);
        this.moveSpeed = moveSpeed;
        this.xTarget = xPos;
        this.yTarget = yPos;
        this.isMoving = false;
    };
    _movableSprite.prototype = Object.create(_baseSprite.prototype);

    _movableSprite.prototype.getIsMoving = function () {
        return this.isMoving;
    };  

    _movableSprite.prototype.setMove = function(x, y) {
        this.xTarget = x;
        this.yTarget = y;
        this.isMoving = true;
    };

    _movableSprite.prototype.move = function() {

        var deltaX = this.xTarget - this.xPos;
        var deltaY = this.yTarget - this.yPos;

        var dist = Math.sqrt(deltaX*deltaX+deltaY*deltaY);
        
        var velX = (deltaX/dist) * this.moveSpeed;
        var velY = (deltaY/dist) * this.moveSpeed;

        if(dist > this.size) {
            this.xPos += velX;
            this.yPos += velY;
        }       
        else {
            this.isMoving = false;
        }
    
    };


    /**
     * Player sprite
     */
    function _playerSprite(moveSpeed, size, xPos, yPos) {
        _movableSprite.call(this, moveSpeed, PLAYER_COLOUR, size, xPos, yPos);       
    };
    _playerSprite.prototype = Object.create(_movableSprite.prototype);

    /**
     * Factory
     */
    var createPlayer = function(moveSpeed, size, xPos, yPos) {
        return new _playerSprite(moveSpeed, size, xPos, yPos);
    };
    return {
        //createMeteor: createMeteor,
        //createCollect: createCollect,
        createPlayer: createPlayer      
    };
})();
