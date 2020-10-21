#!/usr/bin/env node

'use strict'

const req_api = require('request');
const chalk = require('chalk');
const geoip = require('geoip-lite');
const extIP = require('external-ip');
const boxen = require('boxen');
const Cfonts = require('cfonts');
const { resolveInclude } = require('ejs');
const inquirer = require('inquirer');
const Choices = require('inquirer/lib/objects/choices');
const e = require('express');


const log = console.log;
const k = 273.15;

const red = chalk.red;
const red_b = chalk.redBright;
const blue = chalk.blue;
const blue_b = chalk.blueBright;
const cyan = chalk.cyan;
const star = chalk.whiteBright('*');


const setting_text = {
    font: 'tiny', // define the font face
    align: 'left', // define text alignment
    colors: ['system'], // define all colors
    background: 'transparent', // define the background color, you can also use `backgroundColor` here as key
    letterSpacing: .5, // define letter spacing
    lineHeight: 0, // define the line height
    space: true, // define if the output text should have empty lines on top and on the bottom
    maxLength: '0', // define how many character can be on one line
    gradient: "cyan,blue", // define your two gradient colors
    independentGradient: false, // define if you want to recalculate the gradient for each new line
    transitionGradient: true, // define if this is a transition between colors directly
    env: 'node' // define the environment CFonts is being executed in
};

const setting_text2 = {
    font: 'chrome', // define the font face
    align: 'left', // define text alignment
    colors: ['system'], // define all colors
    background: 'transparent', // define the background color, you can also use `backgroundColor` here as key
    letterSpacing: 1, // define letter spacing
    lineHeight: 0, // define the line height
    space: true, // define if the output text should have empty lines on top and on the bottom
    maxLength: '0', // define how many character can be on one line
    gradient: "cyan,blue", // define your two gradient colors
    independentGradient: false, // define if you want to recalculate the gradient for each new line
    transitionGradient: false, // define if this is a transition between colors directly
    env: 'node' // define the environment CFonts is being executed in
};


const style_clout = {
    padding: 1,
    margain: 2,
    borderStyle: "round",
    borderColor: "green",
    align: "left"
}


const style_main = {
    padding: 1,
    margain: 2,
    borderStyle: "bold",
    borderColor: "#1805db",
    backgroundColor: "#03012d",
    align: "center"
}



const style1 = {
    padding: 0,
    margain: 0,
    borderStyle: "round",
    borderColor: "cyan",
    align: "center"
};


const style_set = { // custom style for the nighttime
    padding: 0,
    margain: 2,
    borderStyle: "round",
    borderColor: "#747474",
    backgroundColour: '#22394E',
    align: "center"
}


const style_rise = { // custom style for the day time
    padding: 0,
    margain: 2,
    borderStyle: "round",
    borderColor: "#e68a00",
    backgroundColour: "#22394E",
    align: "center"
};


main()


/////////////////////////////////////////////////////////////////////////////////////////////////////
function main() {
    let getIP = extIP({
        replace: true,
        services: ['https://ipinfo.io/ip', 'http://ifconfig.co/x-real-ip', 'http://ifconfig.io/ip'],
        timeout: 600,
        getIP: 'parallel',
        userAgent: 'Chrome 15.0.874 / Mac OS X 10.8.1'
    });


    getIP(function(err, ip) {
        if (err) {
            throw err;
        }
        var geo = geoip.lookup(ip);
        //geo = '84.255.159.72';
        show_geo(geo);
    });


    function show_geo(geo) {
        //console.log(geo);
        const city = geo["city"];
        //const city = 'Australia';
        const apiKey = 'bb1391ccb025231d996d9ec383b262bb';
        const url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`

        req_api(url, function(err, response, body) {
            if (err) {
                console.log('error:', error);
            } else {
                const weather = JSON.parse(body);
                if (weather == NaN) {
                    message = 'No valid response for ' + `${city}`;
                    console.log(message);
                }
                //console.log(weather);
                parser(weather);
            }
        })
    }

}
/////////////////////////////////////////////////////////////////////////////////////////////////////

function show_question(box_clout, thanks) {
    inquirer
        .prompt([{
                type: 'list',
                name: 'details',
                message: 'Do you want to know more about me?',
                choices: ['Yes', 'Exit', new inquirer.Separator()]
            },
            // {
            //     type: 'list',
            //     name: 'Details2',
            //     //message: 'Do you want to know more about me?',
            //     choices: ['No']

            // }

        ])
        .then(answers => {
            if (answers.details == 'Yes') {
                log(box_clout);
                inquirer
                    .prompt([{
                        type: 'list',
                        name: 'go_back',
                        message: 'Return to home page?',
                        choices: ['Yes', 'No', new inquirer.Separator()]
                    }])
                    .then(answers => {
                        if (answers.go_back == 'Yes') {
                            console.clear();
                            main();
                        }
                    })
            } else {
                console.clear();
                console.log(thanks.string);
            }
        })
}

/////////////////////////////////////////////////////////////////////////////////////////////////////

function parser(weather) {

    ///////////////////////////////////////     temporary vars to format float to 2 decimal places
    var t_temp = weather.main.temp - k;
    t_temp = t_temp.toFixed(2);

    var t_feels = weather.main.feels_like - k;
    t_feels = t_feels.toFixed(2);

    var t_min = weather.main.temp_min - k;
    t_min = t_min.toFixed(2);

    var t_max = weather.main.temp_max - k;
    t_max = t_max.toFixed(2);
    /////////////////////////////////////////   ~end

    /////////////////////////////////////////       Format Epoch timestamps to datetime
    var t_sunset = weather.sys.sunset;
    var t_sunset = new Date(t_sunset).toTimeString();

    var t_sunrise = weather.sys.sunrise;
    var t_sunrise = new Date(t_sunrise).toTimeString();
    /////////////////////////////////////////   ~end


    const content = {
        title: 'OptiWeather',
        coords_lat: chalk.bold.whiteBright('Latitude: ') + chalk.redBright(`${weather.coord.lat}`),
        coords_lon: chalk.bold.whiteBright('Longitude: ') + chalk.redBright(`${weather.coord.lon}`),
        city: chalk.bold.italic.bgHsv(141, 25, 60)(`${weather.name}`),
        temp: chalk.bold.whiteBright('Temperature: ') + chalk.blue(t_temp),
        temp_feels: chalk.bold.whiteBright('Feels Like: ') + chalk.blue(t_feels),
        temp_max: chalk.bold.whiteBright('Max Temp: ') + chalk.blueBright(t_max),
        temp_min: chalk.bold.whiteBright('Min Temp: ') + chalk.cyan(t_min),
        sunset: chalk.bold.blackBright('Sunset: ') + chalk.bgHsv(18, 1, 60)(t_sunset),
        sunrise: chalk.bold.blackBright('Sunrise: ') + chalk.bgHsv(36, 89, 99)(t_sunrise),
        wind_speed: chalk.whiteBright('Wind speed: ') + chalk.rgb(143, 104, 177)(weather.wind.speed),
        wind_angle: chalk.whiteBright('Wind angle: ') + chalk.rgb(143, 104, 177)(weather.wind.deg),


        ///////// ~~~ CLOUT ~~~~ ////////
        email: chalk.red('Email: ') + chalk.blueBright('aayushrj22@gmail.com'),
        github: chalk.whiteBright('GitHub: ') + chalk.grey('indianbollulz'),
        linkedin: chalk.blueBright('LinkedIn: ') + chalk.blackBright('https://linkedin.com/in/') + chalk.cyan('aayush-rajesh')
            /////////////////////////////////
    }

    const line = '\n'
    const tab = '\t'


    const title = `${content.title}`;
    const pretty = Cfonts.render(title, setting_text);
    const cf_title = pretty.string;


    const heading = `${content.city}` +
        line + line +
        `${content.temp}   ` + `${content.coords_lat}` +
        line +
        `${content.temp_feels}   ` + `${content.coords_lon}` +
        line +
        `${content.wind_speed}` + line +
        `${content.wind_angle}`


    const box_heading = boxen(heading, style1) + line;



    var currdate = new Date();
    var get_hour = currdate.getHours();


    const extra = line +
        `${content.temp_min}  ` + ` ${content.sunset}` + line +
        `${content.temp_max}  ` + `${content.sunrise}` + line



    let box_extra = "0";

    if (get_hour < 18 && get_hour > 4) {
        box_extra = line + boxen(extra, style_rise);
    } else {
        box_extra = line + boxen(extra, style_set);
    }


    const body = star + star + star + cf_title + star + star + star + line + box_heading + box_extra;
    const box_body = boxen(body, style_main);

    log('\n')
    log(box_body);
    //log('\n')



    const clout = `${content.email}` + line +
        `${content.linkedin}` + line +
        `${content.github}`;


    const thanks = Cfonts.render('THANKYOU HAVE A NICE DAY', setting_text2)

    const box_clout = boxen(clout, style_clout);
    show_question(box_clout, thanks);




}