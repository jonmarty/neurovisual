//Simulation

//Functions
let M_ss = function(data){return (1/2) * (1 + Math.tanh((data.V - data.V_1) / data.V_2))}
let N_ss = function(data){return (1/2) * (1 + Math.tanh((data.V - data.V_3) / data.V_4))}
let T_N  = function(data){return 1 / (data.phi * Math.cosh((data.V - data.V_3) / (2 * data.V_4)))}

//Define differential equations
let dV = function(data, I){return (I - data.g_L * (data.V - data.V_L) - data.g_Ca * M_ss(data) * (data.V - data.V_Ca) - data.g_K * data.N * (data.V - data.V_K)) / data.C}
let dN = function(data){return (N_ss(data) - data.N) / T_N(data)}

//Equations for the input of each channel
let L = function(data){return -data.g_L * (data.V - data.V_L)}
let Ca = function(data){return -data.g_Ca * M_ss(data) * (data.V - data.V_Ca)}
let K = function(data){return -data.g_K * data.N * (data.V - data.V_K)}

//Update function
let update = function(data,I){
	data.V += dV(data,I) * data.dt
	data.N += dN(data) * data.dt
	data.t += data.dt
	data.x++
}

//Graphics
const x_i = -400;
const y_i = -200;
const M = 200; // Amount to multiply the voltage and recovery variable by for graphics
const N = 1000; // Number of data points to store
const n = 30; // Number of data points to display
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
	AP_coor:0,
	L_coor:0,
	Ca_coor:0,
	K_coor:0,
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
	//Lithium
	ctx.line(50,-60,200,-215, lineconf)
	ctx.line(50,-15,200,-170, lineconf)
	ctx.line(200,-215,400,-215, lineconf)
	ctx.line(200,-170,400,-170, lineconf)
	//Calcium
	ctx.line(50,15,400,15, lineconf)
	ctx.line(50,-15,400,-15, lineconf)
	//Potassium
	ctx.line(50,60,200,215, lineconf)
	ctx.line(50,15,200,170, lineconf)
	ctx.line(200,215,400,215, lineconf)
	ctx.line(200,170,400,170, lineconf)
	//Animations
	data.AP_coor = action_potential(data.AP_coor % 100,ctx)
	data.L_coor = lithium_channel(data.L_coor % 100,ctx,L(data))
	data.Ca_coor = calcium_channel(data.Ca_coor % 100,ctx,Ca(data))
	data.K_coor = potassium_channel(data.K_coor % 100,ctx,K(data))


	//Axon
	ctx.line(-50,20,-400,20, lineconf)
	ctx.line(-50,-20,-400,-20, lineconf)

	//Neuron
	fill = 'rgb('+Math.abs(M*data.N)+',0,'+Math.abs(M*data.V)+')';
	ctx.point(0, 0, {r:100, fill:fill});
	ctx.point(x_i + M*data.N, y_i - M*data.V, {r:15, fill:fill});

	for (i=0;i<=N-Math.floor(N/n);i=i+Math.floor(N/n)){
		ctx.point(plot_x + (i/N) * plot_width, plot_y - plot_height * I_hist[i], {r:plot_width/n/10})
	}

});

demo.align('center', 'center')
		.insertInto('.demo')

setInterval(function(){
	if(!demo.isManipulating){
		var data = demo.getData()
		var t = data.t
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
