//Simulation

//Functions
//TODO: Find TANH and COSH functions in JS
let M_ss = function(data){return (1/2) * (1 + np.tanh((data.V - data.V_1) / data.V_2))}
let N_ss = function(data){return (1/2) * (1 + np.tanh((data.V - data.V_3) / data.V_4))}
let T_N  = function(data){return 1 / (data.phi * np.cosh((data.V - data.V_3) / (2 * data.V_4)))}

//Define differential equations
let dV = function(data, I){return (I - data.g_L * (data.V - data.V_L) - data.g_Ca * M_ss(data) * (data.V - data.V_Ca) - data.g_K * data.N * (data.V - data.V_K)) / data.C}
let dN = function(data){return (N_ss(data) - data.N) / T_N(data)}

//Update function
let update = function(data,I){
	data.x++
	data.V += dV(data,I) * dt
	data.N += dN(data) * dt
	data.t += t
	data.x++
}

//Sample stimulus functions
let square = function(t, start, stop, intensity){
	if(t >= start && t <= stop){
		return intensity
	}
	return 0
}

//Graphics
const x_i = -400;
const y_i = -400;

var data = {
	x:x_i,
	y:y_i,
	t:0,
	data:0,
	C:0,
	g_L:0,
	g_Ca:0,
	g_K:0,
	V_L:0,
	V_Ca:0,
	V_K:0,
	V_1:0,
	V_2:0,
	V_3:0,
	V_4:0,
	phi:0,
	V:0,
	N:0
}

var demo = g9(data, function(data,ctx) {
	
	lineconf = {'stroke-width':1}

	//Dendrites
	ctx.line(50,60,200,215, lineconf)
	ctx.line(50,-60,200,-215, lineconf)
	ctx.line(50,15,200,170, lineconf)
	ctx.line(50,15,200,15, lineconf)
	ctx.line(50,-15,200,-15, lineconf)
	ctx.line(50,-15,200,-170, lineconf)

	//Axon
	ctx.line(-50,20,-400,20, lineconf)
	ctx.line(-50,-20,-400,-20, lineconf)

	fill = 'rgb('+Math.abs(data.x-x_i)+',0,'+Math.abs(data.y-y_i)+')';
	ctx.point(0, 0, {r:100, fill:fill});
	ctx.point(data.x, data.y, {r:15, fill:fill});

});

setInterval(function(){
	if(!demo.isManipulating){
		var data = demo.getData()
		I = square(data.t,0,200,1)
		console.log(I)
		update(data,I)
		demo.setData(data)
	}
}, 10)
