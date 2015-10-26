//base properties
// xPos
// yPos
// moveSpeed
// bgColor (this could be an image)
// size

//base functions
// move
// draw
// getXPos
// getYPos
// getSize
// getMoveSpeed
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

    _movableSprite.prototype.setMoveTarget = function(x, y) {
        this.xTarget = x;
        this.yTarget = y;
        this.isMoving = false;
    };

    _movableSprite.prototype.move = function() {

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
