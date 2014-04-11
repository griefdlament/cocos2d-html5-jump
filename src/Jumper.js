var Jumper = cc.Sprite.extend({
    ctor: function( x, y ) {
        this._super();
        this.initWithFile( 'res/images/jumper.png' );
        this.setAnchorPoint( cc.p( 0.5, 0 ) );
        this.x = x;
        this.y = y;

        this.maxVx = 8;
        this.accelX = 0.25;
        this.backAccelX = 0.5;
        this.jumpV = 20;
        this.g = -1;
        
        this.vx = 0;
        this.vy = 0;

        this.moveLeft = false;
        this.moveRight = false;
        this.jump = false;

        this.groundBlock = null;

        this.blocks = [];

        this.updateSpritePosition();
    },

    updateSpritePosition: function() {
        this.setPosition( cc.p( Math.round( this.x ),
                                Math.round( this.y ) ) );
    },

    getPlayerRect: function() {
        var spriteRect = this.getBoundingBoxToWorld();
        var spritePos = this.getPosition();

        var dX = this.x - spritePos.x;
        var dY = this.y - spritePos.y;
        return cc.rect( spriteRect.x + dX,
                        spriteRect.y + dY,
                        spriteRect.width,
                        spriteRect.height );
    },
    
    update: function() {
        var currentPositionRect = this.getPlayerRect();

        this.updateYMovement();
        this.updateXMovement();

        var newPositionRect = this.getPlayerRect();
        this.handleCollision( currentPositionRect,
                              newPositionRect );

        this.updateSpritePosition();
    },

    updateXMovement: function() {
        if ( this.groundBlock ) {
            if ( ( !this.moveLeft ) && ( !this.moveRight ) ) {
                this.autoDeaccelerateX();
            } else if ( this.moveRight ) {
                this.accelerateX( 1 );
            } else {
                this.accelerateX( -1 );
            }
        }
        this.x += this.vx;
        this.handleBorder();
    },
	
	handleBorder: function() {
		if ( this.x < 0 ) {
            this.x += screenWidth;
        }
        if ( this.x > screenWidth ) {
            this.x -= screenWidth;
        }
	},

    updateYMovement: function() {
        if ( this.groundBlock ) {
            this.vy = 0;
            if ( this.jump ) {
                this.vy = this.jumpV;
                this.y = this.groundBlock.getTopY() + this.vy;
                this.groundBlock = null;
            }
        } else {
            this.vy += this.g;
            this.y += this.vy;
        }
    },

    isSameDirection: function( dir ) {
        return ( ( ( this.vx >= 0 ) && ( dir >= 0 ) ) ||
                 ( ( this.vx <= 0 ) && ( dir <= 0 ) ) );
    },

    accelerateX: function( dir ) {
        if ( this.isSameDirection( dir ) ) {
            this.handleSameDirection( dir );
        } else {
            this.handleDifferentDirection( dir );
        }
    },
	
	handleSameDirection: function( dir ) {
		this.vx += dir * this.accelX;
        if ( Math.abs( this.vx ) > this.maxVx ) {
			this.vx = dir * this.maxVx;
        }
	},
	
	handleDifferentDirection: function( dir ) {
		if ( Math.abs( this.vx ) >= this.backAccelX ) {
            this.vx += dir * this.backAccelX;
        } else {
            this.vx = 0;
        }
	},
    
    autoDeaccelerateX: function() {
        if ( Math.abs( this.vx ) < this.accelX ) {
            this.vx = 0;
        } else if ( this.vx > 0 ) {
            this.vx -= this.accelX;
        } else {
            this.vx += this.accelX;
        }
    },

    handleCollision: function( oldRect, newRect ) {
        if ( this.groundBlock ) {
            this.handleGrounded( newRect );
        } else {
            this.handleFalling( oldRect, newRect );
        }
    },
	
	handleGrounded: function( rect ) {
		if ( !this.groundBlock.onTop( rect ) ) {
            this.groundBlock = null;
        }
	},
	
	handleFalling: function( oldRect, newRect ) {
		if ( this.vy <= 0 ) {
            var groundBlock = this.findGroundBlock( this.blocks,
                                              oldRect,
                                              newRect );
            
            if ( groundBlock ) {
                this.groundBlock = groundBlock;
                this.y = groundBlock.getTopY();
                this.vy = 0;
            }
        }
	},
    
    findGroundBlock: function( blocks, oldRect, newRect ) {
        var groundBlock = null;
        var groundBlockTopY = -1;
        
        blocks.forEach( function( b ) {
            if ( b.hitTop( oldRect, newRect ) ) {
                if ( b.getTopY() > groundBlockTopY ) {
                    groundBlockTopY = b.getTopY();
                    groundBlock = b;
                }
            }
        }, this );
        
        return groundBlock;
    },
    
    handleKeyDown: function( e ) {
        if ( Jumper.KEYMAP[ e ] != undefined ) {
            this[ Jumper.KEYMAP[ e ] ] = true;
        }
    },

    handleKeyUp: function( e ) {
        if ( Jumper.KEYMAP[ e ] != undefined ) {
            this[ Jumper.KEYMAP[ e ] ] = false;
        }
    },

    setBlocks: function( blocks ) {
        this.blocks = blocks;
    }
});

Jumper.KEYMAP = {}
Jumper.KEYMAP[cc.KEY.left] = 'moveLeft';
Jumper.KEYMAP[cc.KEY.right] = 'moveRight';
Jumper.KEYMAP[cc.KEY.up] = 'jump';
        
