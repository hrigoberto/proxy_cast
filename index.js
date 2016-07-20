var express = require('express');
var cors = require('cors');
var bodyParser = require('body-parser');
var server = express();
var $http = require('axios');
var logger = require('./logger');

var port = process.env.PORT || 8080;
var apiKey = require('./config').apiKey;
var baseUrl = 'https://api.forecast.io/forecast/'


server.use(bodyParser.json());
server.use(bodyParser.urlencoded({extended: true}));
server.use(cors());
server.use(logger);

server.get('/forecast/hourly/:lat,:lon', function(req, res){
  $http.get(baseUrl + apiKey + '/' + req.params.lat+','+req.params.lon)
       .then(function(response){
        var resObj = {
          latitude: response.data.latitude,
          longitude: response.data.longitude,
          hourly: response.data.hourly
        }
        res.status(200).json(resObj);
       })
       .catch(function(err){
         console.log(err);
         res.status(500).send({msg: error});
       })
});

server.get('/forecast/minutely/:lat,:lon', function(req, res){
  $http.get(baseUrl + apiKey + '/' + req.params.lat+','+req.params.lon)
       .then(function(response){
        var resObj = {
          latitude: response.data.latitude,
          longitude: response.data.longitude,
          minutely: response.data.minutely
        }
        res.status(200).json(resObj);
       })
       .catch(function(err){
         console.log(err);
         res.status(500).send({msg: error});
       })
});

server.get('/forecast/daily/:lat,:lon', function(req, res){
  $http.get(baseUrl + apiKey + '/' + req.params.lat+','+req.params.lon)
       .then(function(response){
        var dailyData = response.data.daily.data;
        var overIcon = response.data.daily.icon;
        var overSummary = response.data.daily.summary;
        var dailyObj = [];
        var len = dailyData.length;
        for (i = 0; i < len; i += 1){
          var o = {
            summary: dailyData[i].summary,
            icon: dailyData[i].icon,
            precipProb: dailyData[i].precipProbability,
            humidity: dailyData[i].humidity,
            tempMin: dailyData[i].temperatureMin,
            tempMax: dailyData[i].temperatureMax
          };
          dailyObj.push(o);
        }
        var resObj = {
          latitude: response.data.latitude,
          longitude: response.data.longitude,
          dailySummary: overSummary,
          dailyIcon: overIcon,
          daily: dailyObj
        }
        res.status(200).json(resObj);
       })
       .catch(function(err){
         console.log(err);
         res.status(500).send({msg: err});
       });

});

server.listen(port, function(){
  console.log('Now listening on port...', port);
});
