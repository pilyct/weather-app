# NimbusCast - Weather with a Side of Poetry

NimbusCast is a full-stack app that tracks and forecast global weather data in real time, and delivers a poem at random based on the conditions in the area you search.

<p align="center">
  <img src="./client/public/day-sample2.png?raw=true" width="800" height="450">
  <img src="./client/public/night-sample2.png?raw=true" width="800" height="450">
</p>
<p align="center">
  <img src="./client/public/day-sample3.png?raw=true" width="800" height="450">
  <img src="./client/public/night-sample3.png?raw=true" width="800" height="450">
</p>

Note that background images will change based on the weather in the city you are searching.
The collection of these images was obtained from [Unsplash](https://unsplash.com/).

# 🚀 Getting started

## Project Installation - What you need

Use the guidelines below to work on this project on your local machine:

First, make sure you have **Node.js** and **npm** installed on your local machine. Follow the steps written [here](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm).

After, you finished installing:

- Fork this project and clone it in your machine. Feel free to use any text editor of your preference.
- Once you have it cloned in your machine, run the following command in the console for both folders: `Client` and `Server`.

```js
  // go to each folder
  cd client
  cd server

  // install dependencies
  npm install || npm i
```

To launch the entire application, use two separate console views and run the following commands, starting with the `Server` and moving on to the `Client`:

```js
  // for the server
  npm start

  // for the client
  npm start
```

Don't worry if your `Client` console prompt asks you to run the application in a different port after you've completed the previous commands. Since you are running your `Server` first, this is entirely typical.

## API Connection - How to connect

**IMPORTANT**: As you work through the code, you will notice that you need a `SECRET_KEY_API` in order to access all of the data from the OpenWeatherMap API. For that reason, I will suggest that you get one on your own first, and modify the code to fit it by creating a separate `.env` file in the Back-End and saving it there.

Once you have created it, please be careful and DO NOT publish your `.env` file anywhere.

The instructions to get your own `SECRET_KEY_API` are available [here](https://home.openweathermap.org/users/sign_up).

Luckily, this does not applicable to PoetryDB API.

# 🚀 Tech Stack - Tools used

The tech stack utilised to create this app was as follows:

- **For the Back-End:** _Node.js_ together with _Express_
- **For the Front-End:** _React.js_ together with _TailwindCSS_

Additionally, this application uses two distinct APIs to obtain its data, [WeatherOpenMap](https://openweathermap.org/) to find out the current weather conditions, and [PoetryDB](https://poetrydb.org/index.html) to get a selection of random poems.

# 🚀 Further Optimization

You are welcome to add new features to what has already been developed, as well as make any changes you deem necessary. I also left a couple of cases and recommendations in this [repo's issues section](https://github.com/PilySwatch/weather-app/issues), so feel free to look at them if you're itching to do so.

Additionally, if you find any errors or there is anything you would like to discuss, you can reach me at this email: pilar.cuellarta@gmail.com

Thanks for considering my project, and **Happy Coding!** 💙
