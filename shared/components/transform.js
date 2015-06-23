'use strict'

var _ = require('underscore');

function Transform(owner) {
	this._position = {"x": 0, "y": 0}; 
	this._velocity = {"x": 0, "y": 0}; // remove this 
	this._angle = 0;
	// localPosition and localAngle are used declared when initLocalVariables is called
	// this._localPosition = {"x": 0, "y": 0}; 
	// this._localAngle = 0;
	this._owner = owner;
};

Transform.prototype.updateAfterWorldStep = function(){
	this.syncWithBody();
};

Transform.prototype.syncWithBody = function(){
	var phsicsComponent = this._owner.components.get('physics');
	if( phsicsComponent ){
		var body = this._owner.components.get('physics').body;
		this.setPositionWithoutUpdateBody({ "x": body.position[0], "y": body.position[1] });
		this.setVelocityWithoutUpdateBody({ "x": body.velocity[0], "y": body.velocity[1] });
		this.setAngleWithoutUpdateBody(body.angle);
	}
};

// Update transform and body position
Transform.prototype.setPosition = function( position ){
	// if( this._owner.key === 'test' ){
	// 	console.log("setPosition.begin:");
	// 	console.log("	x = " + this._position.x);
	// 	console.log("	y = " + this._position.y);
	// }
	this.setPositionWithoutUpdateBody(position);
	this.updateBodyPosition();
	// if( this._owner.key === 'test' ){
	// 	console.log("setPosition.end:");
	// 	console.log("	x = " + this._position.x);
	// 	console.log("	y = " + this._position.y);
	// }
};

// Update transform and body position
Transform.prototype.setDeltaPosition = function( deltaPosition ){
	// if( this._owner.key === 'test' ){
	// 	console.log("setDeltaPosition.begin:");
	// 	console.log("	x = " + this._position.x);
	// 	console.log("	y = " + this._position.y);
	// 	console.log(deltaPosition);
	// }
	var newPosition = {
		"x": this._position.x + deltaPosition.dx,
		"y": this._position.y + deltaPosition.dy 
	};
	this.setPositionWithoutUpdateBody(newPosition);
	this.updateBodyPosition();
	// if( this._owner.key === 'test' ){
	// 	console.log("setDeltaPosition.end:");
	// 	console.log("	x = " + this._position.x);
	// 	console.log("	y = " + this._position.y);
	// }
};

Transform.prototype.updateBodyPosition = function(){
	var phsicsComponent = this._owner.components.get('physics');
	if( phsicsComponent ){
		var body = phsicsComponent.body;
		body.position[0] = this._position.x;
		body.position[1] = this._position.y;
	}
};

// Update transform position
Transform.prototype.setPositionWithoutUpdateBody = function( position ){
	// if( this._owner.key === 'test' ){
	// 	console.log("setPositionWithoutUpdateBody.begin:");
	// 	console.log("	x = " + this._position.x);
	// 	console.log("	y = " + this._position.y);
	// 	console.log(position);
	// }

	if( !position || typeof position.x !== 'number' || typeof position.y !== 'number' )
		console.error('Transform.prototype.setPositionWithoutUpdateBody = function( position ) : invalid argument');
	
	var deltaPosition = {
		"dx": position.x - this._position.x,
		"dy": position.y - this._position.y
	}

	this._position.x = position.x;
	this._position.y = position.y;
	this.updateLocalPosition();

	// Update children position
	if( this._owner.childrenManager.hasChildren() && ( deltaPosition.dx !== 0 || deltaPosition.dy !== 0 ) ){
		_.each( this._owner.childrenManager.getChildrenArray(), function( e, i, l ){
			// console.error(deltaPosition);
			e.transform.setDeltaPosition(deltaPosition);
		});
	}

	// if( this._owner.key === 'test' ){
	// 	console.log("setPositionWithoutUpdateBody.end:");
	// 	console.log("	x = " + this._position.x);
	// 	console.log("	y = " + this._position.y);
	// }
};

Transform.prototype.updateLocalPosition = function(){
	if( this._owner.father ){
		var fatherPosition = this._owner.father.transform.getPosition();
		this._localPosition = {
			"x": this._position.x - fatherPosition.x,
			"y": this._position.y - fatherPosition.y
		}
	}
};

// Doesn't passed by reference
Transform.prototype.getPosition = function(){
	var position = {
		"x": this._position.x,
		"y": this._position.y
	}
	return position;
};

// Update transform and body angle
Transform.prototype.setAngle = function(angle){
	this.setAngleWithoutUpdateBody(angle);
	this.updateBodyAngle();
};

// Update transform and body angle
Transform.prototype.setDeltaAngle = function( deltaAngle ){
	var newAngle = this._angle + deltaAngle;
	this.setAngleWithoutUpdateBody(newAngle);
	this.updateBodyAngle();
};

Transform.prototype.updateBodyAngle = function(){
	var phsicsComponent = this._owner.components.get('physics');
	if( phsicsComponent ){
		var body = phsicsComponent.body;
		body.angle = this._angle;
	}
};

// Update transform angle
Transform.prototype.setAngleWithoutUpdateBody = function(angle){
	if(typeof angle !== 'number')
		console.error('Transform.prototype.setAngleWithoutUpdateBody = function(angle) : invalid argument');

	// Update children angle
	var deltaAngle = angle - this._angle;

	this._angle = angle;
	this.updateLocalAngle()

	// Update children angle
	if( this._owner.childrenManager.hasChildren() && deltaAngle !== 0 ){
		_.each( this._owner.childrenManager.getChildrenArray(), function( e, i, l ){
			// console.error(deltaAngle);
			e.transform.setDeltaAngle(deltaAngle);
		});
	}
};

Transform.prototype.updateLocalAngle = function(){
	if( this._owner.father ){
		var fatherAngle = this._owner.father.transform.getAngle();
		this._localAngle = this._angle - fatherAngle;
	}
};

Transform.prototype.getAngle = function(){
	return this._angle;
};

// Update body velocity
Transform.prototype.setVelocity = function(velocity){ // remove this
	this.setVelocityWithoutUpdateBody(velocity);
	this.updateBodyVelocity();
};

Transform.prototype.updateBodyVelocity = function(){ // remove this
	var phsicsComponent = this._owner.components.get('physics');
	if( phsicsComponent ){
		var body = phsicsComponent.body;
		body.velocity[0] = this._velocity.x;
		body.velocity[1] = this._velocity.y;
	}
};

Transform.prototype.setVelocityWithoutUpdateBody = function(velocity){ // remove this
	if( !velocity || typeof velocity.x !== 'number' || typeof velocity.y !== 'number' )
		console.error('Transform.prototype.setVelocityWithoutUpdateBody = function( velocity ) : invalid argument');

	this._velocity.x = velocity.x;
	this._velocity.y = velocity.y;
};

// Doesn't passed by reference
Transform.prototype.getVelocity = function(){ // remove this
	var velocity = {
		"x": this._velocity.x,
		"y": this._velocity.y
	}
	return velocity;
};

// Doesn't passed by reference
Transform.prototype.getTransform = function(velocity){ // remove this
	var transform = {};
	transform.position = {
		"x": this._position.x, 
		"y": this._position.y
	};
	transform.velocity = {
		"x": this._velocity.x,
		"y": this._velocity.y
	};
	transform.angle = this._angle;
	return transform;
};

Transform.prototype.setTransform = function(transform){ // remove this
	if( transform.position && typeof transform.position.x === 'number' && typeof transform.position.y === 'number' )
		this.setPosition(transform.position);
	if( transform.velocity && typeof transform.velocity.x === 'number' && typeof transform.velocity.y === 'number' )
		this.setVelocity(transform.velocity);
	if( transform.angle )
		this.setAngle(transform.angle);
};

Transform.prototype.setLocalPosition = function(localPosition){
	this._localPosition = localPosition;
	var fatherPosition = this._owner.father.transform.getPosition();
	var newPosition = {
		"x": fatherPosition.x + localPosition.x,
		"y": fatherPosition.y + localPosition.y
	};
	this.setPosition(newPosition);
}

Transform.prototype.setLocalAngle = function(localAngle){
	this._localAngle = localAngle;
	this.setAngle(this._owner.father.transform.getAngle() + localAngle);
}

Transform.prototype.initLocalVariables = function(x0, y0, alpha0){
	// if( this._owner.key === 'test' ){
	// 	console.log("initLocalVariables.begin:");
	// 	console.log("	x = " + this._position.x);
	// 	console.log("	y = " + this._position.y);
	// }

	x0 =  typeof x0 === 'number' ? x0 : 0;
	y0 =  typeof y0 === 'number' ? y0 : 0;
	alpha0 = typeof alpha0 === 'number' ? alpha0 : 0;

	this.setLocalPosition({ "x": x0, "y": y0 });
	this.setLocalAngle(alpha0);

	// if( this._owner.key === 'test' ){
	// 	console.log("initLocalVariables.end:");
	// 	console.log("	x = " + this._position.x);
	// 	console.log("	y = " + this._position.y);
	// }
}

module.exports = Transform;