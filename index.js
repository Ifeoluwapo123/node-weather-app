//import modules
const request = require('request'),
      path = require("path"),
      http = require('http'),
      express =  require('express'),
      socketIo = require('socket.io'),
      bodyparser = require('body-parser'),
      app = express(),
      server = http.createServer(app),
      io = socketIo(server),
      port = process.env.PORT || 3000;
      var url;

//middlewares
app.use(express.static(path.join(__dirname,'public')));
app.set('view engine','ejs');
app.use(bodyparser.urlencoded({extended:false}));
app.use(bodyparser.json());

function loadWeatherData(url, socket){
	request(url, function(err, response,body){
    	if(err) console.log('error');
		else{
			var data = JSON.parse(body);
			socket.emit('weather',{
				desc: data.weather[0].description,
				icon: data.weather[0].icon,
				temp: data.main.temp,
				name: data.name,
				country: data.sys.country
			});
		}
	});
}

app.get('/',(req,res)=>{
	res.render('home');
});

io.on('connection', socket =>{
	socket.on('coordinates', coords =>{
		let lng = coords.substring(coords.indexOf(' ')+1, coords.length),
		    lat = coords.substring(0, coords.indexOf(' '));
		lng = parseFloat(lng);
		lat = parseFloat(lat);
		url = `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&units=metric&APPID=49389e45757da0d1e1310dacd8e44fb0`;
		loadWeatherData(url, socket);
	});

	socket.on('city', city =>{
		url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&APPID=49389e45757da0d1e1310dacd8e44fb0`;
		loadWeatherData(url, socket);
	});
});

server.listen(port, "0.0.0.0", (err, success)=>{
	if(err) console.log('error connection');
	else console.log(`subscriber connected to ${port}`);
});
