/**
 * HUD Class
 * displaying values of the player
 * as HTML Overlays
 *
 */

function HUD ()
{
	this._container	= document.createElement( 'div' );
	this._container.className = "container";
	this.domElement = this._container;

	this._messageContainer = document.createElement( 'div' );
	this._messageContainer.className = "messageContainer";
	this._container.appendChild( this._messageContainer );

}

HUD.prototype.debugMessage = function( value, property ) {

	var messageBox = document.createElement( 'div' );
	messageBox.className = "messageBox";
	
	this._messageContainer.appendChild( messageBox );
	
	return {
		update: function() { 
			messageBox.innerHTML = value[property]; 
		}
	};

};

HUD.prototype.print = function( message ) {

	var messageBox = document.createElement( 'div' );
	messageBox.className = "messageBox";
	messageBox.innerHTML = message;

	this._messageContainer.appendChild( messageBox );
	
	return {
		update: function( message ) { 
			messageBox.innerHTML = message; 
		}
	};

};

HUD.prototype.update = function() 
{

	// refresh only 10times per second
	// if( lastTime + 1/10 > clock.getElapsedTime() ) return;
	// lastTime	= clock.getElapsedTime();

	
};


var fuehrendeNull = function ( wert )
{
	if ( wert<10 ) return "0" + parseInt( wert );
	else return parseInt( wert );
}

var sekundenUmwandeln = function ( Sekundenzahl )
{
	Sekundenzahl = Math.abs( Sekundenzahl )
	// return parseInt(Sekundenzahl/60/60/24)+ " Tage " + fuehrendeNull((Sekundenzahl/60/60)%24) + ":" +
	return fuehrendeNull( (Sekundenzahl/60)%60 ) + ":" + fuehrendeNull(Sekundenzahl%60);
}