var Block = cc.Sprite.extend({
    ctor: function( x1, y1, x2, y2 ) {
        this._super();
        this.initWithFile( 'res/images/ground.png',
                           cc.rect( 0, 0, x2-x1, y2 - y1 ) );
        this.setAnchorPoint( cc.p( 0, 0 ) );
        this.setPosition( cc.p( x1, y1 ) );
    },

    getTopY: function() {
        return cc.rectGetMaxY( this.getBoundingBoxToWorld() );
    },

    hitTop: function( oldRect, newRect ) {
        var blockRect = this.getBoundingBoxToWorld();
        if ( cc.rectGetMinY( oldRect ) >= cc.rectGetMaxY( blockRect ) ) {
            var loweredNewRect = cc.rect( newRect.x,
                                          newRect.y - 1,
                                          newRect.width,
                                          newRect.height + 1 );
            var unionRect = cc.rectUnion( oldRect, loweredNewRect );
            return cc.rectIntersectsRect( unionRect, blockRect );
        }
        return false;
    },

    onTop: function( rect ) {
        var blockRect = this.getBoundingBoxToWorld();
        var blockMinX = cc.rectGetMinX( blockRect );
        var blockMaxX = cc.rectGetMaxX( blockRect );
        var minX = cc.rectGetMinX( rect );
        var maxX = cc.rectGetMaxX( rect );
        return ( minX <= blockMaxX ) && ( blockMinX <= maxX );
    }
});

