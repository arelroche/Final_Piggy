#PlanningPal

###Gift The Code

PlanningPal is an open-source project in conjunction with [Prosper Canada](http://prospercanada.org/), a national charity dedicated to expanding economic opportunity for Canadians living in poverty through program and policy innovation. Please feel free to contribute to this project and help develop an app that can change the people look at managing their finances. 

##Description

PlanningPal is a financial app that uses gamification to help users reach their financial goals. Through the concept of taking care of a virtual "pal", it will advise the users on how to manage short-term and long-term finances.

The objective of the game is to level up and unlock more "pals" through the use of points. Based on how closely users follow their financial goals points will be rewarded or deducted, which in turn affects the health of their pal. Utilizing data pulled from the user's bank account or manual entry, the app calculates and tracks the progress of their goals.

Targeting any age bracket, the incentive of the game is that users should care about their finances as they would for their pet. The app is designed to help users realize how easy and rewarding financial planning can be in the long run. Having a personal and portable tool will give users confidence and an understanding of how to financially prosper

![Demo](Gift_The_Code/www/img/planningpal_demo_video.gif?raw=true "Planning Pal Demo")

##Technology

1. Apache Cordova 

  [Cordova](https://cordova.apache.org/) is mobile application development framework that enables software programmers to build applications for mobile devices using CSS3, HTML5, and JavaScript instead of relying on platform-specific APIs like those in Android, iOS, or Windows Phone. 
  
  Cordova was our main platform and was used to build our cross-platform hybrid application, capable of running on both Android and iOS with no changes to the source code. This application was designed to be entirely __client-side__.

  This was a new platform for most of the group, so developing for it was part of the learning curve, but installing and getting started with Cordova was relatively painless.

2. WebSQL 

  The user's financial information and app data is stored in a __Local__ SQL Database created using WebSQL.

3. JQuery Injection 

  Lack of a easily accessible Financial Aggregation API that is capable of running purely from the client-side (or our inabaility to find one), required the use of JQuery Injection to grab financial information from the user's Banking Information front-end and copy it to the device's Local Storage for further use. This process would depend on successfuly authentication with the user's online banking service.

4. HTML / CSS / JS 

  The applications views were created using the front-end trio of HTML / CSS / JS. Mockups for all of the views and icons were created in Adode Photoshop, and stock icons and fonts were grabbed from Font Awesome. Framework 7, from Cordova, was used to the create a lot of the application's basic styling options.

5. Debugging Tools
  - X-Code (Mac) / Simulator
  - Android Virtual Device
  - Chrome / Safari Remote Inspect
  
## Install Instructions
1. Clone repo
2. Install Cordova (npm install cordova), if you would like to make changes to the application
3. For iOS - run Gift_The_Code/platforms/ios/PlanningPal.xcodeproj
4. For Android - run cordova platform add android and then cordova build android
 
## TODO: 
[ ] Encrypt transaction information locally
[ ] Integrate a secure financial aggregation API
[ ] View for manual transaction entry
[ ] Machine learning algorithm for categorizing transacitons based on description 
[ ] Machine learning algorithm for automated financial goal setting 
Future Work: Abstract financial data for cloud storage in order to run demographics based financial analysis

