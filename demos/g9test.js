demo = g9({x:0,y:0}, function(data,ctx) {
	ctx.point(data.x, data.y, {r:15, fill:'rgb('+Math.abs(data.x)+',0,'+Math.abs(data.y)+')'})
});
