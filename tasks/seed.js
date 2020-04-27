const dbConnection = require('../db/connection');
const dbcollections = require('../db/collections');
const data = require('../data');
const users = data.user_function;
const posts = data.posts;
const events = data.events;
const petitions = data.petitions;
const emergency = data.emergencies;

const main = async () => {
  const db = await dbConnection();
  await db.dropDatabase();

  //fname, lname, eid, pass, phone
  const shubham = await users.createUser("Shubham", "Rane", "shubham16.ranez@gmail.com", "Shubh123", "8624852144" );
  const rohan = await users.createUser("Rohan", "Shah", "r1@gmail.com", "Rohan123", "8624852144" );
  const viraj = await users.createUser("Viraj", "Rokade", "viraj@gmail.com", "Viraj12@", "8624852144" );
  const sid = await users.createUser("Siddharth", "Shah", "sids@gmail.com", "Sids786@", "8624852144" );
  const badal = await users.createUser("Badal", "Thosani", "badalT@hotmail.com", "pXyz12@45", "8624852144" );
  const pranil = await users.createUser("Pranil", "Bhavsar", "pbhavsar@yahoo.com", "Officeisthebest123", "8624852144" );
  const virat = await users.createUser("Virat", "Kohli", "vk18@gmail.com", "Anushka1112", "8624852144" );
  const rohit = await users.createUser("Rohit", "Sharma", "rohit45@yahoo.com", "Samaira45", "8624852144" );
  const arnab = await users.createUser("Arnab", "Goswami", "alwaysloud@hotmail.com", "Loudestever12", "8624852144" );
  const modi = await users.createUser("Narendra", "Modi", "alwaysout@hotmail.com", "Swachch123", "8624852144" );


  //post
  const rohanPost = await posts.createPost(rohan,"Washington Park Renovation ", " As vacations are about start, Jersey City and Union City council started their work. The biggest park in jersey heights is in process of renovation. Urban park with 4 baseball fields, 9 tennis courts, basketball hoops & a playground is about to expand its boundaries.\r\n From the childhood I have seen this garden transform. From empty landscape to ground, from ground to garden. This ground not only facilitates sports but also got space for adults and children. Being close to Union City police station and its an ideal safe place for every occasion.   \r\n", 
  "Park, Garden, Better Community, Children, Sports.", "", "", ["washington park.jpg"], "78 Congress St, Jersey City, NJ 07307, USA", "no");

  //emergency
  const viratEmg = await emergency.createEmg(virat, "Awareness and Caution", " Shots heard on Martin Luther King Road, jersey heights. I was coming home back after doing laundry and on the same time 2 men with long rifles and woman entering grocery store on the corner.\r\nAs soon as they entered the shop they fired 2 shot. I am posting this for everyone in our locality to not to leave their houses and stay safe on lockdown. \r\n",
"", "", "", ["shoot.jpg"], "78 Congress St, Jersey City, NJ 07307, USA");

//post
  const shubhamPost = await posts.createPost(shubham, "Chef Of India Opens new Branch", " As everyone’s favorite and affordable restaurant on the central avenue is spreading its branches. Yes, you guessed it right I am talking about Chef Of India. Chef Of India opens its new branch on the evergreen Washington Street, Hoboken. Personally being a fan of Chef Of India’s hunger buster offer of 1+1 Biryani is always felt light on their customers' pockets.  ",
  "Restaurant, Food, Indian Food", "", "", ["COC2.jpg","COC1.jpg","COC.jpg"], "Hoboken, New Jersey", "no");

  //petition
  const badalPet = await petitions.createPet(badal, "Psycopath Playing horrible songs on street on Jersey City", " It was a regular afternoon when I was returning from my office. That’s when a guy with average looks came walking from the front. And that’s when it all started, Guy named mayor was playing his horrible playlist and that’s when I realized first time in my life that end is near and Ragnarok was about to begin.\r\nI appeal to everyone reading this petition that pleases sign this petition and shares awareness about this disastrous crime taking place. \r\nSatark Rahe! Surakshit Rahe!\r\n",
  "", "", "100");
  //event
  const sidEvent = await events.createEvent(sid,"Python Boot camp", " Our Remote class teaches the Python programming language and SQL databases for backend development and HTML, CSS, and JavaScript development with the React.js framework for delivering a dynamic web-based frontend. Students master core concepts and learn to build dynamic data-driven applications with industry-standard technologies. Even those brand new to coding may enroll in the course.",
   "www.w3schools.com", "", "", "", "2019-12-15", "12:00", "50", "" );

   

 //post
  const virajPost = await posts.createPost(viraj, "Leaving Lime cycles in between of sidewalk? Not so good Idea.", " This is the third time it’s happening with me. I am student recently arrived to States few months back. One of the best things I experienced after landing is those Lime Scooters as a personal-public transport. But, from last few times I have seen people just leaving those scooters in center or sidewalk after their use, without any support or stand. As winds are rising I have often found these scooters lying on the sidewalk on just beside the road. I seriously think this is a miss use or just a carelessness regarding this public property.",
  "", "", "", "", "Hoboken, JC", "yes");

  

//event
    const rohanEvent = await events.createEvent(rohan, "Live Streaming LaLiga: Barcelona Vs Real Madrid", " At Corks&Screw we are holding a the some of the most awaited football matches i.e LaLiga live streaming starts at evening for all of our customers FREE. Do join us and as you know Good Beer is always a perfect partner for Good match. Time and Location given below.",
    "","", "", ["el.jpeg"], "2019-12-18", "15:00", "30", "Corks and Screw Bar, Congress Street");

//emergency
const rohitEmg = await emergency.createEmg(rohit, "Immediate assistance and evacuation", " This situation is raised due to power outage from last 12 hours is heavy snowfall at the same time. This deadly combination is leading to freezing situations in our locality. Surrounding communities and local authorities have instructed people to gather in public places like Schools and Church. Alfred Zampela Public School is stated as one of those public shelter spots, anyone near this location and still at their home are advised to gather near school immediately.",
"https://www.duluthnewstribune.com/news/weather/4817714-Weather-Service-upgrades-North-Shore-to-Winter-Storm-Warning", "", "", "",""); 



  await posts.addView(virajPost, rohan);
  await posts.addView(virajPost, viraj);
  await posts.addView(virajPost, shubham);
  await posts.addView(virajPost, sid);
  await posts.addView(virajPost, badal);
  await posts.addView(virajPost, pranil);
  await posts.addView(virajPost, virat);
  await posts.addView(virajPost, rohit);
  await posts.addView(virajPost, arnab);
  await posts.addView(virajPost, modi);
  


  await posts.addFake(virajPost, badal);
  await posts.addFake(virajPost, rohan);
  await posts.addFake(virajPost, sid);
  await posts.addFake(virajPost, viraj);
  await posts.addFake(virajPost, virat);
  await posts.addFake(virajPost, rohit);
  await posts.addFake(virajPost, pranil);


  console.log('Done seeding database');

await admin();
  await db.serverConfig.close();
};

async function admin()
{
    const adminDataCollection = await dbcollections.admin_data(); 
    const adminData = {
        email_id:"admin@uncoveredmedia.com",
        hashed_pass:"$2a$10$Xzr6ZwUyfv2TJJjkvOdV8ejARrZGgh4Gi5riugeSabTlNsbDOBMKm"
    };
    await adminDataCollection.insertOne(adminData);
}

main().catch(console.log);
