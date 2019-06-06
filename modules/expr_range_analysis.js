const target = ["+","-","*","/"]
var segment_expr = function(expr){
	var in_par = false
	var segs = []i // Segments
	var opps = [] // Operators
	var curr_seg = ""
	for(i=0;i<expr.length;i=i+1){
		if(!target.includes(expr[i])){curr_seg = curr_seg + expr[i]}
		if(!in_par){
			if (expr[i] == '('){in_par = true}
			else if (target.includes(expr[i])){
				segs.push(curr_seg)
				opps.push(expr[i])
				curr_seg = ""
			}
			if(i == expr.length - 1){segs.push(curr_seg)}

		}
		else if (expr[i] == ')') {in_par = false}
	}
	return [segs, opps]
}

//Some functions of the form func.range(args...) that give the range of functions of the form func(args...)

/*var sin = function(theta){return Math.sin(theta)}
sin.range = function(theta){return [-1,1]}
sin.doc = "Standard Math.sin function"
var t = 0
*/

var range_helper = function(segs, opps){

	// Get ranges for each individual segment
	var ranges = []
	for(i=0;i<segs.length;i=i+1){
		if(segs[i].includes('(')){ranges.push(eval(segs[i].replace('(','.range(')))}
		else{ranges.push([eval(segs[i]), eval(segs[i])])}
	}

	// Combine ranges (a complex way of reducing all the ranges together b.c. there are two arrays with different lengths, ranges and opps)
	// Find the indices of multiplicative (*,/) and additive (+,-) operators
	var multind = []
	var addind = []
	for(i=0;i<opps.length;i=i+1){
		if(opps[i] == "*" || opps[i] == "/"){multind.push(i)}
		else {addind.push(i)}
	}

	// First, do multiplication and division
	for(i=0;i<multind.length;i=i+1){
		var ind = multind[i]
		if(opps[ind] == "*"){
			var poss = [ranges[ind+1][0] * ranges[ind][0], ranges[ind+1][0] * ranges[ind][1], ranges[ind+1][1] * ranges[ind][0], ranges[ind+1][1] * ranges[ind][1]]
			ranges[ind+1] = [Math.min(...poss), Math.max(...poss)]
		}
		else if(opps[ind] == "/"){
			var poss = [ranges[ind][0] / ranges[ind+1][0], ranges[ind][0] / ranges[ind+1][1], ranges[ind][1] / ranges[ind+1][0], ranges[ind][1] / ranges[ind+1][1]]
			ranges[ind+1] = [Math.min(...poss), Math.max(...poss)]
		}
	}

	// Second, do addition and subtraction
	for(i=0;i<addind.length;i=i+1){
		var ind = addind[i]
		var nextind = addind[i+1] || ranges.length - 1
		if(opps[ind] == "+"){ranges[nextind] = [ranges[nextind][0] + ranges[ind][0], ranges[nextind][1] + ranges[ind][1]]}
		else if(opps[ind] == "-"){ranges[nextind] = [ranges[nextind][0] - ranges[ind][0], ranges[nextind][1] - ranges[ind][1]]}
	}


	return ranges[ranges.length - 1]
}

var determine_range = function(expr){
	let [segs, opps] = segment_expr(expr)
	return range_helper(segs, opps)
}

//Export statement
//export {determine_range}

// TEST
/*var expr = "5*sin(t)+1/2"
console.log(expr)
var [segs, opps] = segment_expr(expr)
console.log(segs)
console.log(opps)
console.log(sin.range(1))
var range = range_helper(segs, opps)
console.log(range)
*/
