// TODO: Find images to use -- or just make them with pixel art
let ap_img = "[FILE NAME]"
let li_img = "[FILE NAME]"
let ca_img = "[FILE NAME]"
let k_img = "[FILE NAME]"

let li_path = function(x){
  if (x > 100){return [100,-37.5]}
  else if (x > 50){
    let s = x - 50
    return [200-2*s,-192.5+3.1*s]
  }
  else {return [400-4*x, -192.5]} //TODO: Check if decimals are allowed for positions
}

let ca_path = function(x){
  if (x > 100){return [100,0]}
  else {return [400-3*x, 0]}
}

let k_path = function(x){
  if (x > 100){return [100,37.5]}
  else if (x > 50){
    let s = x - 50
    return [200-2*s,192.5-3.1*s]
  }
  else {return [400-4*x, 192.5]}
}

let action_potential = function(prev, ctx){
  let coor = prev + 1 //TODO: Figure out a good value to increment by
  if (coor > 100){coor = undefined} // A TEMPORARY FIX
  let x = -100 - 3*coor || -400
  ctx.point(x,0,{r:5})
  return coor
}

let lithium_channel = function(prev, ctx, speed){
  let coor = prev + speed
  if (coor < 0){coor = 100}
  else if (coor > 100){coor = 0}
  let [x,y] = li_path(coor)
  ctx.point(x,y,{r:5}) // Replace w/ image
  return coor
}

let calcium_channel = function(prev, ctx, speed){
  let coor = prev + speed
  if (coor < 0){coor = 100}
  let [x,y] = ca_path(coor)
  ctx.point(x,y,{r:5}) // Replace w/ image
  return coor
}

let potassium_channel = function(prev, ctx, speed){
  let coor = prev + speed
  if (coor < 0){coor = 100}
  let [x,y] = k_path(coor)
  ctx.point(x,y,{r:5}) // Replace w/ image
  return coor
}
