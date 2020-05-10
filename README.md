# INSTALLATION
The application is developed to run in a Node.JS environment. 
After Unzipping the file, install the following dependencies using the npm install command. 
Make sure that the package.json file is in present in the directory. Else, you will have to install each dependency individually. 
The following dependencies have been used:
`brcypt.js, cookie-parser,ember-truth-helpers, express, express-handlebars, express-session, formidable, fs, handlebars, handlebars-helpers, mongodb, request`.

You could simply use the following command to install all dependencies: 
`npm install` 

For seeding the database with some data, use the following command:
`node tasks/seed.js`

To run the application, use the following command:
`npm start`

In order to see the images, you have to define your local project folder path. Please follow the instruction given below,
In `routes/mainroutes.js`, we have defined a variable as shown below. Please enter your project path till your project folder.

For eg:
`const img_dir_name = "C:/Users/Shubham/Desktop/Uncovered_Media";`
Here, Uncovered Media is the main project folder where entire project is located. Please don’t add extra `/` after project folder name. 
Note: Our web application is best suited to run on Google Chrome

# USAGE
We have provided some sample users in the database. You can login using the one provided below
	
	Email: 	r1@gmail.com 

	Password: Rohan123

You could create a new account as well in the sign up page.
One Logged in, You can see the home page where there are variety of options presented to you.
	
	Admin Login credentials:
	
	URL : http://localhost:3000/adminlogin
	
	Email: admin@uncoveredmedia.com
	
	Password: admin123admin
	
For Complete Usage, please refer the video which explains the entire workflow

# SUPPORT
For Support, You can reach out to anyone of the team members:

	Rohan Shah- rshah78@stevens.edu 

	Viraj Rokade- vrokade@stevens.edu

	Shubham Rane- srane3@stevens.edu

	Badal Thosani- bthosani@stevens.edu



# ROADMAP
In future releases, we aim to make the application more location centric where the user will get a personalized feed of events, posts etc. based on the location. Also, we aim to include the option where users can have followers, can follow someone they wish to and stay updated with posts and events from that particular person. 

# PROJECT STATUS
Currently the project is developed with keeping initial requirements in mind and is under review purpose. Development has been currently been halted.

# CONTRIBUTIONS
Currently we are not accepting open source contributions to the project. However, if you have any feedbacks or ideas of improvement, you can reach out to us. Upon review, if we integrate it into out project, we would surely acknowledge your effort.
