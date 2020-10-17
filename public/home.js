const socket = io('/');
var input = document.getElementById('input');
var page = document.getElementById('contact');
var loading = document.getElementById('loading');
var body = document.getElementById('page-top');
var button = document.getElementById('getlocate');

loading.style.display = 'none';

//set the default image background
function backgroundImage(image){
    page.style.backgroundImage = `url("images/${image}")`;
    page.style.backgroundPosition = "center";
    page.style.backgroundRepeat = "repeat-x";
    page.style.backgroundSize = "cover";
    page.style.backgroundRepeat = "repeat-x";
}

//when no description matches the one in the switch cases 
function noDesc(data){
	if(data.indexOf("clouds")!= -1) 
		backgroundImage('fewcloud.gif');
	else if(data.indexOf("rain")!= -1) 
		backgroundImage('showerrain.gif');
	else if(data.indexOf("thunderstorm")!= -1) 
		backgroundImage('thunderstorm.gif');
	else if(data.indexOf("mist")!= -1) 
		backgroundImage('mist.gif');
	else if(data.indexOf("snow")!= -1) 
		backgroundImage('snow.gif');
	else if(data.indexOf("heavy")!= -1 && data.indexOf("rain")!= -1) 
		backgroundImage('rainwind.gif');
	else 
		backgroundImage('cloud.jpeg');
}

//set initial background image
backgroundImage('map-image.png');

var c = function(pos){
	let lat = pos.coords.latitude,
		lng = pos.coords.longitude,
		coords = lat +' '+ lng;
	socket.emit('coordinates', coords);
}

//loading via spinner
function spinner(condition){
	if(condition === true){
		button.disabled = true;
		input.disabled = true;
		loading.style.display = '';
		body.style.opacity = '0.6';
	}else{
		button.disabled = false;
		input.disabled = false;
		loading.style.display = 'none';
		body.style.opacity = '';
	}
}

button.onclick = function(){
	navigator.geolocation.getCurrentPosition(c);
	spinner(true);
	return false;
}

input.addEventListener('keypress', event =>{
	if(event.keyCode == 13){
		spinner(true);
		let city = event.target.value;
		socket.emit('city',city);
		event.target.value = '';
	}
});

function wallpaper(description){
	switch(description){
		case "scattered clouds":
			backgroundImage('scatteredclouds.gif'); 
			break;
		case "clear sky":
			backgroundImage('clearsky.gif');
			break;
		case "few clouds":
			backgroundImage('fewcloud.gif');
			break;
		case "broken clouds":
			backgroundImage('brokencloud.gif');
			break;
		case "shower rain":
			backgroundImage('showerrain.gif');
			break;
		case "light rain":
			backgroundImage('showerrain.gif');
			break;
		case "rain":
			backgroundImage('rain.gif');
			break;
		case "thunderstorm":
			backgroundImage('thunderstorm2.gif');
			break;
		case "snow":
			backgroundImage('snow.gif');
			break;
		case "mist":
			backgroundImage('mist.gif');
			break;
		default:
			noDesc(description);	
	}
	
}

socket.on('weather', data =>{
	page.style.backgroundImage = '';
	spinner(false);
	wallpaper(data.desc);
	let div  =  document.createElement('div');
	let div0 = document.createElement('div');
	let div1 = document.createElement('div');
	let div2 = document.createElement('div');
	let h5 = document.createElement('h5');
	let img = document.createElement('img');
	let h1 = document.createElement('h1');
	let span1 = document.createElement('span');
	let h4 = document.createElement('h3');
	let em = document.createElement('em');
	let em1 = document.createElement('em');

	page.innerHTML = '';
	h5.className = "desc";
	em1.innerText = data.desc;
	h5.appendChild(em1);
	img.src = `http://openweathermap.org/img/wn/${data.icon}@2x.png`;
	div0.className = "div0";
	div0.appendChild(img);
	div0.appendChild(h5);

	h1.innerText = data.temp;
	span1.innerText = "o";
	h1.appendChild(span1);
	div1.className = "div1";
	div1.appendChild(h1);

	em.innerText = "LOCATION:"+data.name+','+data.country;
	h4.appendChild(em);
	div2.className = "div2";
	div2.appendChild(h4);

	div.appendChild(div0);
	div.appendChild(div1);
	div.appendChild(div2);

	page.appendChild(div);
});

                        

                        
