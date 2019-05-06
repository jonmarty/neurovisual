//Simulation

//Functions
//TODO: Find TANH and COSH functions in JS
let M_ss = function(data){return (1/2) * (1 + Math.tanh((data.V - data.V_1) / data.V_2))}
let N_ss = function(data){return (1/2) * (1 + Math.tanh((data.V - data.V_3) / data.V_4))}
let T_N  = function(data){return 1 / (data.phi * Math.cosh((data.V - data.V_3) / (2 * data.V_4)))}

//Define differential equations
let dV = function(data, I){return (I - data.g_L * (data.V - data.V_L) - data.g_Ca * M_ss(data) * (data.V - data.V_Ca) - data.g_K * data.N * (data.V - data.V_K)) / data.C}
let dN = function(data){return (N_ss(data) - data.N) / T_N(data)}

//Update function
let update = function(data,I){
	data.V += dV(data,I) * data.dt
	data.N += dN(data) * data.dt
	data.t += data.dt
	data.x++
}

//Sample stimulus functions
let square = function(t, start, stop, intensity){
	if(t >= start && t <= stop){
		return intensity
	}
	return 0
}

let on_off = function(t, on, off, intensity){
	tn = t % (on+off)
	if(tn <= on){
		return intensity
	}
	return 0
}

//Graphics
const x_i = -400;
const y_i = -200;
const M = 200; // Amount to multiply the voltage and recovery variable by for graphics
const N = 1000; // Number of data points to store
const n = 10; // Number of data points to display
const plot_x = 400 // X value of bottom left of Current Data Plot
const plot_y = -200 // Y value of bottom left of Current Data Plot
const plot_width = 400 // Width of Current Data Plot
const plot_height = 100 // Height of Current Data Plot
var I_hist = new Array(N).fill(0)

var data = {
	x:x_i,
	y:y_i,
	t:0,
	dt:0.01,
	C:1,
	g_L:1,
	g_Ca:1,
	g_K:1,
	V_L:1,
	V_Ca:1,
	V_K:1,
	V_1:1,
	V_2:1,
	V_3:1,
	V_4:1,
	phi:1,
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
	
	//Neuron
	fill = 'rgb('+Math.abs(M*data.N)+',0,'+Math.abs(M*data.V)+')';
	ctx.point(0, 0, {r:100, fill:fill});
	ctx.point(x_i + M*data.N, y_i - M*data.V, {r:15, fill:fill});

	for (i=0;i<=N-N/n;i=i+(N/n)){
		ctx.point(plot_x + (i/N) * plot_width, plot_y - plot_height * I_hist[i], {r:plot_width/n/10})
	}

});

setInterval(function(){
	if(!demo.isManipulating){
		var data = demo.getData()
		var t = data.t
		var sin = Math.sin
		var pi = Math.PI
		stim_expr = document.getElementById("stim_expr").value
		try{
			var I = eval(stim_expr)
			if(I==undefined || typeof I != 'number'){I = 0}
		}
		catch(error){var I = 0}
		update(data,I)
		I_hist.pop()
		I_hist.unshift(I)
		demo.setData(data)
	}
}, 10)
