'use strict';

var GameComponent = require('../../shared/core/component.js');
var _ = require('underscore');


function SpriteComponent(sprites_info) {
	//console.log('inside SpriteComponent constr');
	this.key = 'sprite';
	this._sprites_info = sprites_info;
	this._sprites = {};
}

///
SpriteComponent.prototype = Object.create(GameComponent.prototype);
SpriteComponent.prototype.constructor = SpriteComponent;
///

SpriteComponent.prototype.init = function () {
	this.owner.on('entity.destroy', this.onEntityDestroy.bind(this));

	// console.log('inside SpriteComponent init');

	_.each(this._sprites_info, function (sprite_i, key) {

        if (!_.isNull(sprite_i.scale) && !_.isUndefined(sprite_i.scale)) {
			sprite_i.sprite.scale.setTo(sprite_i.scale.x, sprite_i.scale.y);
        }

        if (!_.isNull(sprite_i.anchor) && !_.isUndefined(sprite_i.anchor)) {
			sprite_i.sprite.anchor.setTo(sprite_i.anchor.x, sprite_i.anchor.y);
        }

        if (!_.isNull(sprite_i.tint) && !_.isUndefined(sprite_i.tint)) {
			sprite_i.sprite.tint = sprite_i.tint;
        }

        if (!_.isNull(sprite_i.width) && !_.isUndefined(sprite_i.width)) {
			sprite_i.sprite.width = sprite_i.width;
        }

        if (!_.isNull(sprite_i.height) && !_.isUndefined(sprite_i.height)) {
			sprite_i.sprite.height = sprite_i.height;
        }

        if (!_.isNull(sprite_i.rotation) && !_.isUndefined(sprite_i.rotation)) {
			sprite_i.sprite.rotation = sprite_i.rotation;
        }

        sprite_i.originalTexture = new Phaser.Rectangle(0, 0, sprite_i.sprite.texture.width, sprite_i.sprite.texture.height);
        sprite_i.sprite.crop(new Phaser.Rectangle(0, 0, sprite_i.sprite.texture.width, sprite_i.sprite.texture.height), false);

        this._sprites[key] = sprite_i.sprite;
    }, this);

	// console.log('after SpriteComponent init');
	//	/* Crop is based on texture (must use texture width and height) */
	//	this.originalTextureRect = new Phaser.Rectangle(0, 0, this.sprite.texture.width, this.sprite.texture.height);
	//	/* Saved original texture rect because crop will modify texture properties */
	//	this.sprite.crop(new Phaser.Rectangle(0, 0, this.sprite.texture.width, this.sprite.texture.height), false);
};

SpriteComponent.prototype.update = function () {
	var transform = this.owner.transform.getTransform();
	
    // MPTest
	if (this.owner.key !== 'test') {
		if (typeof transform.position.x === 'number' && typeof transform.position.y === 'number' && typeof transform.angle === 'number') {
			_.each(this._sprites, function (sprite) {
				sprite.position.x = transform.position.x;
				sprite.position.y = transform.position.y;
				sprite.rotation = transform.angle;
			});
		}
	}
	else {
		if (typeof transform.position.x === 'number' && typeof transform.position.y === 'number' && typeof transform.angle === 'number') {
			_.each(this._sprites, function (sprite) {
				sprite.position.x = transform.position.x;
				sprite.position.y = transform.position.y;
				sprite.rotation = transform.angle;
			});
		}
	}
};

SpriteComponent.prototype.kill = function (key) {
    var sprite = this._sprites[key];
    if (sprite) {
        sprite.kill();
    }
};

SpriteComponent.prototype.revive = function (key) {
	var sprite = this._sprites[key];
	if (sprite) {
		sprite.revive();
	}
};

SpriteComponent.prototype.play = function (key, animation, framesPerSec, loop) {
    var sprite = this._sprites[key];
    if (sprite) {
        sprite.animations.play(animation, framesPerSec, loop);
    }
};

SpriteComponent.prototype.onEntityDestroy = function () {
	_.each(this._sprites, function (sprite) {
        sprite.destroy();
    });
};

SpriteComponent.prototype.getSprite = function (key) {
	return this._sprites[key];
};

SpriteComponent.prototype.cropImage = function (key, percentage) {
	var sprite = this._sprites[key];
	var originalTextureWidth = this._sprites_info[key].originalTexture.width;

	sprite.cropRect.width = originalTextureWidth * percentage;
	sprite.updateCrop();
};

module.exports = SpriteComponent;