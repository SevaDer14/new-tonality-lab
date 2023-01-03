# About

This app is an additive synthesizer that utilizes Web Audio API oscillators and that allows to generate and download WAV samples to use in xenharmonic / microtonal music. The distinguishing feature is ability to control frequency of each individual partial to generate inhrmonic timbres and plot roughness profile (dissonance curve) to determine related tuning for that timbre. The work is based on xentonality approach described by William Sethares in the book "Tuning, Timbre, Spectrum, Scale". Production version is deployed at https://newtonality.net. 

# Running Local Development Server

This is a web app that is built using SvelteKit JavaScript framework, rendering of UI and synthesizer functionality is done by the browser. So if you want to run it offline you will have to download source code, start local development server and access that server from your browser.

## 1) Install node.js

First you need latest version of node.js installed. Go to officiall website (https://nodejs.org/en/download/) and download latest stable node for your operating system. To check if installation went well you can run following commands in the terminal:
- `node -v` should return `v18.12.1` or higher
- `npm -v` sould return `8.19.2` or higher

## 2) Download Source Code

Download source code by either using `git clone` or by downloading and unpacking .zip archive from Github to a folder on your machine. It is recommended to download from the production branch as development branch can have bugs and unreleases features. To do it select production branch here
![image](https://user-images.githubusercontent.com/79849155/210402767-9b509706-df53-4d13-80cc-9006eafcbd51.png)

And download zip here
![image](https://user-images.githubusercontent.com/79849155/210402921-e61b864a-d710-4598-88fe-24c4aca1ce5a.png)

## 3) Run Development Server

Open folder with the application, it should look something like that

![image](https://user-images.githubusercontent.com/79849155/210400659-6410f1e4-ef70-49a4-a35d-00f1c116cc71.png)

Now you need to open this folder in the terminal. On Windows use Shift + right click on the window and select `Open PowerShell Window here`. Once the folder is opened in terminal you can install all the dependencies, you have to have access to the internet to do it. In the terminal type `npm i` and press Enter. Process shoud finish without any errors. Now you should be able to run dev server. To do it type 'npm run dev' and press Enter. If server is started, you will see the following message

![image](https://user-images.githubusercontent.com/79849155/210402009-7547849d-9109-47e9-b32a-c7f9336126da.png)

Now open your browser and type http://localhost:5173/ in address bar, you should see and be able to use the app. Don't close terminal window, that will shut server down and app wont be availible.
