// Current functions that can be utilized by the user through the expression box
// Each function is defined with a .range subfunction and a .doc attribute

// Useful functions for defining ranges
var intensity_range = function(intensity){ // Defines range for function that returns either 0 or [intensity]
  if (intensity < 0){return [intensity, 0]}
  else {return [0,intensity]}
}
///////////////////////////////////////

var sin = function(theta){return Math.sin(theta)}
sin.range = function(theta){return [-1,1]}
sin.doc = "Standard Math.sin function"

var square = function(t, start, stop, intensity){
	if(t >= start && t <= stop){
		return intensity
	}
	return 0
}
square.range = function(t, start, stop, intensity){intensity_range(intensity)}
square.doc = "Returns a single square wave with value [intensity] from [t] = [start] to [t] = [stop]"

var on_off = function(t, on, off, intensity){
	tn = t % (on+off)
	if(tn <= on){
		return intensity
	}
	return 0
}
on_off.range = function(t, on, off, intensity){intensity_range(intensity)}
on_off.doc = "Outputs periods of 0 current of length [off] broken up by periods of [intensity] current of length [on]"

//Export statement
//export {sin, square, on_off}
