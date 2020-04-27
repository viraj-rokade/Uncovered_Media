//Please add your local project folder directory here
const img_dir_name = "D:/Programming Stuff/UncoveredMedia_Final";


const express = require("express");
const router = express.Router();

const formidable = require('formidable');
const fs = require('fs');
const data = require("../data");
const request = require('request');
const userData = data.user_function;
const postData = data.posts;
const eventData = data.events;
const emgData = data.emergencies;
const petData = data.petitions;
const showData = data.homefunctions;
const adminData = data.adminfunctions;




router.get('/', async (req, res) => {
    try {
        if (req.session.userId) {
            return res.redirect('/home');
        } else {
            return res.render('display/login',{keywords: "UNCOVERED MEDIA: Login"});
        }
    } catch (e) {
        res.status(404).render('display/login', { error: e.message });
    }
})

router.get('/login', async (req, res) => {
    return res.redirect("/"); 
})

router.get('/registration', async (req, res) => {

    if(req.session.userId) {
        return res.redirect("/"); 
     } else {
         res.status(403).redirect('../error');
     }
    
})

router.get('/fastfacts', async (req, res) => {

    if(req.session.userId) {
        res.render('display/fastfacts', {keywords: "UNCOVERED MEDIA: FAQ"});  
     } else {
         res.status(403).redirect('../error');
     }
    
})


router.get('/adminlogin', async (req,res) =>{
        res.render('display/adminlogin', {keywords: "UNCOVERED MEDIA: Admin"});  
})

router.get('/admindashboard', async (req,res) =>{
    try{
            if(req.session.userId) {
                let callData = await adminData.callFlaggedData();
                res.render('display/admindashboard', {callData, keywords: "UNCOVERED MEDIA: Dashboard"});
            } else {
                res.status(403).redirect('../error2');
            } 
    } catch (e) {
        res.status(404).render('display/admindashboard', { error: e.message });
    }
})

router.get('/takeaction/:id', async (req,res) =>{
    
            if(req.session.userId) {
                try{
                let callData = await adminData.callFlaggedData();
                const index = callData.findIndex(function(obj){return obj.post_id == req.params.id});
                let displayData = callData[index];
                res.render('display/takeaction', { displayData, keywords: "UNCOVERED MEDIA: Take Action"});
                } catch (e) {
                    res.status(404).render('display/takeaction', { error: e.message });
                }
            } else {
                res.status(403).redirect('../error2');
            } 
    
})

router.post('/actionprocess', async (req,res) =>{
    
    if(req.session.userId) {
        try{
            let formData = req.body;
            let actionRes = await adminData.takeAction(formData.post_id, formData.user_id, formData.action);
            if(actionRes)
            {
                res.render('display/admindashboard', { actionSuc: "Action Completed", keywords: "UNCOVERED MEDIA: Dashboard"});
            }
            else{
                res.render('display/admindashboard', { error: "Could not take action", keywords: "UNCOVERED MEDIA: Dashboard"});
            }
        } catch (e) {
            res.status(404).render('display/admindashboard', { error: e.message });
        }
    } else {
        res.status(403).redirect('../error2');
    } 

})

router.get('/profile/post/delete/:id', async (req,res) =>{
    
    if(req.session.userId) {
        try{
            let id = req.params.id;
            let actionRes = await userData.deletePost(id);
            if(actionRes)
            {
                res.render('display/profile', { postSucc: "Post Deleted Successfully", keywords: "UNCOVERED MEDIA: Profile"});
            }
            else{
                res.render('display/profile', { error2: "Could not delete!", keywords: "UNCOVERED MEDIA: Profile"});
            }
        } catch (e) {
            res.status(404).render('display/profile', { error: e.message });
        }
    } else {
        res.status(403).redirect('../error2');
    } 

})

router.get('/profile/event/delete/:id', async (req,res) =>{
    
    if(req.session.userId) {
        try{
            let id = req.params.id;
            let actionRes = await userData.deleteEvent(id);
            if(actionRes)
            {
                res.render('display/profile', { postSucc: "Event Deleted Successfully", keywords: "UNCOVERED MEDIA: Profile"});
            }
            else{
                res.render('display/profile', { error2: "Could not delete!", keywords: "UNCOVERED MEDIA: Profile"});
            }
        } catch (e) {
            res.status(404).render('display/profile', { error: e.message });
        }
    } else {
        res.status(403).redirect('../error2');
    } 

})

router.get('/profile/emg/delete/:id', async (req,res) =>{
    
    if(req.session.userId) {
        try{
            let id = req.params.id;
            let actionRes = await userData.deleteEmg(id);
            if(actionRes)
            {
                res.render('display/profile', { postSucc: "Emergency Deleted Successfully", keywords: "UNCOVERED MEDIA: Profile"});
            }
            else{
                res.render('display/profile', { error2: "Could not delete!", keywords: "UNCOVERED MEDIA: Profile"});
            }
        } catch (e) {
            res.status(404).render('display/profile', { error: e.message });
        }
    } else {
        res.status(403).redirect('../error2');
    } 

})

router.get('/profile/pet/delete/:id', async (req,res) =>{
    
    if(req.session.userId) {
        try{
            let id = req.params.id;
            let actionRes = await userData.deletePet(id);
            if(actionRes)
            {
                res.render('display/profile', { postSucc: "Petition Deleted Successfully", keywords: "UNCOVERED MEDIA: Profile"});
            }
            else{
                res.render('display/profile', { error2: "Could not delete!", keywords: "UNCOVERED MEDIA: Profile"});
            }
        } catch (e) {
            res.status(404).render('display/profile', { error: e.message });
        }
    } else {
        res.status(403).redirect('../error2');
    } 

})

router.get('/profile', async (req,res) =>{

    if(req.session.userId) {
        try {
            let session_ID = req.session.userId;
            const userDetails =await userData.getUserByID(session_ID);
            const displayData =await showData.getAllProfileData(session_ID);
            return res.status(200).render("display/profile", {userDetails, displayData, keywords: "UNCOVERED MEDIA: User Profile"});
        } catch (e) {
            res.status(404).render('display/profile', { error: e.message });
        }
        res.render('display/profile',{keywords: "UNCOVERED MEDIA: User Profile"});
     } else {
         res.status(403).redirect('../error');
     } 
})

router.get('/updateprofile', async (req,res) =>{

    if(req.session.userId) {
        try {
            let session_ID = req.session.userId;
            const userDetails =await userData.getUserByID(session_ID);
            return res.status(200).render("display/updateprofile", {userDetails, keywords: "UNCOVERED MEDIA: Update Profile"});
        } catch (e) {
            res.status(404).render('display/updateprofile', { error: e.message });
        }
        res.render('display/updateprofile',{keywords: "UNCOVERED MEDIA: Update Profile"});
     } else {
         res.status(403).redirect('../error');
     } 
})

router.post('/updateprofile', async (req,res) =>{
    let session_ID = req.session.userId;
    
    var form = new formidable.IncomingForm();
    form.uploadDir=img_dir_name + '/public/user_crucial_data/user_images/';
    form.maxFileSize = 4 * 1024 * 1024;
    form.multiples=false;
    var img_name;
    
    
    form.parse(req, function (err, fields, files) {
        
    try 
    {
        
        
    
            if(files.image.name)
            {
                img_name=files.image.name;
                var oldpath = files.image.path;
                var newpath = img_dir_name + '/public/user_crucial_data/user_images/' + files.image.name;
                
                //console.log(oldpath);
                fs.rename(oldpath, newpath, function (err) {
                    if(err) throw err;
                })
            }

            let profileUpdated = userData.updateProfile(session_ID, fields.address, fields.city, fields.state, fields.country, fields.zip, fields.dob, fields.gender, img_name);
            if(profileUpdated)
            {
                res.status(200).render("display/profile", { postSucc: "Profile updated successfully"});
            }
            else
            {
                res.status(401).render('display/profile', { error: "Profile update failed! Try Again" });
            }
        } catch (e) {
            res.status(404).render('display/profile', { error: e.message });
        }
        
    }) 
})

router.get('/createpost',function(req,res){

    if(req.session.userId) {
        res.render('display/createpost',{keywords: "UNCOVERED MEDIA: Create Post"});
     } else {
         res.status(403).redirect('../error');
     }
    
});

router.get('/createevent',function(req,res){

    if(req.session.userId) {
        res.render('display/createevent',{keywords: "UNCOVERED MEDIA: Create Event"});
     } else {
         res.status(403).redirect('../error');
     }
    
});

router.get('/createemg',function(req,res){

    if(req.session.userId) {
        res.render('display/createemg',{keywords: "UNCOVERED MEDIA: Create Emergency"});
     } else {
         res.status(403).redirect('../error');
     }
    
});

router.get('/createpetition',function(req,res){

    if(req.session.userId) {
        res.render('display/createpetition',{keywords: "UNCOVERED MEDIA: Create Petition"});
     } else {
         res.status(403).redirect('../error');
     }
    
});

router.get('/viewpost/:id', async (req,res) => {

    if(req.session.userId) {
        try
        {
            let session_ID = req.session.userId;
            await postData.addView(req.params.id,session_ID);
            let viewPostData = await postData.getPostByID(req.params.id);
            let reactColor = await postData.reactCheck(req.params.id,session_ID);
            if(!reactColor)
            {
                reactColor="";
            }
            let imgArr = viewPostData.image_name;
            let userImg = await userData.getUserImage(viewPostData.user_id)
            res.render('display/viewpost',{viewPostData, imgArr, userImg, reactColor, keywords: "UNCOVERED MEDIA: View Post"});
        } catch (e) {
            res.status(404).render('display/viewpost', { error: e.message });
        }
     } else {
         res.status(403).redirect('../error');
     }
    
})

router.get('/viewevent/:id', async (req,res) => {

    if(req.session.userId) {
        try
        {
            let session_ID = req.session.userId;
            await eventData.addView(req.params.id,session_ID);
            let viewEventData = await eventData.getEventByID(req.params.id);
            let imgArr = viewEventData.image_name;
            let findId = viewEventData.users_attending.find(element => element === session_ID);
            let userImg = await userData.getUserImage(viewEventData.user_id)
            res.render('display/viewevent',{viewEventData, imgArr, findId, userImg,  keywords: "UNCOVERED MEDIA: View Event"});
        } catch (e) {
            res.status(404).render('display/viewevent', { error: e.message });
        }
     } else {
         res.status(403).redirect('../error');
     }
    
})

router.get('/viewpet/:id', async (req,res) => {

    if(req.session.userId) {
        try
        {
            let session_ID = req.session.userId;
            await petData.addView(req.params.id,session_ID);
            let viewPetData = await petData.getPetByID(req.params.id);
            let imgArr = viewPetData.image_name;
            let findId = viewPetData.signatures.find(element => element === session_ID);
            let userImg = await userData.getUserImage(viewPetData.user_id)
            res.render('display/viewpet',{viewPetData, imgArr, findId, userImg, keywords: "UNCOVERED MEDIA: View Petition"});
        } catch (e) {
            res.status(404).render('display/viewpet', { error: e.message });
        }
     } else {
         res.status(403).redirect('../error');
     }
    
})

router.get('/viewemg/:id', async (req,res) => {

    if(req.session.userId) {
        try
        {
            let session_ID = req.session.userId;
            await emgData.addView(req.params.id,session_ID);
            let viewEmgData = await emgData.getEmgByID(req.params.id);
            let imgArr = viewEmgData.image_name;
            let findId = viewEmgData.helpers_attending.find(element => element === session_ID);
            let userImg = await userData.getUserImage(viewEmgData.user_id)
            res.render('display/viewemg',{viewEmgData, imgArr, findId, userImg, keywords: "UNCOVERED MEDIA: View Emergency"});
        } catch (e) {
            res.status(404).render('display/viewemg', { error: e.message });
        }
     } else {
         res.status(403).redirect('../error');
     }
    
})


router.get('/viewpost/like/:id', async (req,res) => {

    if(req.session.userId) {
        try
        {
            let session_ID = req.session.userId;
            let post_id = req.params.id;
            let likeAdded = await postData.addLike(req.params.id,session_ID);
            if(likeAdded)
            {
                res.status(200).redirect("/viewpost/"+post_id);
            }
            else
            {
                let likeRemoved = await postData.removeLike(req.params.id,session_ID);
                if(likeRemoved)
                {
                    res.status(200).redirect("/viewpost/"+post_id);
                }
                else
                {
                res.status(401).render('display/viewpost', { id: post_id, error: "You have already reacted to this post"});
                }
            }
        } catch (e) {
            res.status(404).render('display/viewpost', { error: e.message });
        }
     } else {
         res.status(403).redirect('../error');
     }
    
})

router.get('/viewpost/fake/:id', async (req,res) => {

    if(req.session.userId) {
        try
        {
            let session_ID = req.session.userId;
            let post_id = req.params.id;
            let fakeAdded = await postData.addFake(req.params.id,session_ID);
            if(fakeAdded)
            {
                res.status(200).redirect("/viewpost/"+post_id);
            }
            else
            {
                let fakeRemoved = await postData.removeFake(req.params.id,session_ID);
                if(fakeRemoved)
                {
                    res.status(200).redirect("/viewpost/"+post_id);
                }
                else
                {
                res.status(401).render('display/viewpost', { id: post_id, error: "You have already reacted to this post"});
                }
            }
        } catch (e) {
            res.status(404).render('display/viewpost', { error: e.message });
        }
     } else {
         res.status(403).redirect('../error');
     }
    
})

router.get('/viewpost/spam/:id', async (req,res) => {

    if(req.session.userId) {
        try
        {
            let session_ID = req.session.userId;
            let post_id = req.params.id;
            let spamAdded = await postData.addSpam(req.params.id,session_ID);
            if(spamAdded)
            {
                res.status(200).redirect("/viewpost/"+post_id);
            }
            else
            {
                let spamRemoved = await postData.removeSpam(req.params.id,session_ID);
                if(spamRemoved)
                {
                    res.status(200).redirect("/viewpost/"+post_id);
                }
                else
                {
                res.status(401).render('display/viewpost', { id: post_id, error: "You have already reacted to this post"});
                }
            }
        } catch (e) {
            res.status(404).render('display/viewpost', { error: e.message });
        }
     } else {
         res.status(403).redirect('../error');
     }
    
})

router.get('/viewpost/hate/:id', async (req,res) => {

    if(req.session.userId) {
        try
        {
            let session_ID = req.session.userId;
            let post_id = req.params.id;
            let hateAdded = await postData.addHate(req.params.id,session_ID);
            if(hateAdded)
            {
                res.status(200).redirect("/viewpost/"+post_id);
            }
            else
            {
                let hateRemoved = await postData.removeHate(req.params.id,session_ID);
                if(hateRemoved)
                {
                    res.status(200).redirect("/viewpost/"+post_id);
                }
                else
                {
                res.status(401).render('display/viewpost', { id: post_id, error: "You have already reacted to this post"});
                }
            }
        } catch (e) {
            res.status(404).render('display/viewpost', { error: e.message });
        }
     } else {
         res.status(403).redirect('../error');
     }
    
})

router.get('/viewevent/join/:id', async (req,res) => {

    if(req.session.userId) {
        try
        {
            let session_ID = req.session.userId;
            let event_id = req.params.id;
            let joinAdded = await eventData.addJoin(req.params.id,session_ID);
            if(joinAdded)
            {
                res.status(200).redirect("/viewevent/"+event_id);
            }
            else
            {
                let joinRemoved = await eventData.removeJoin(req.params.id,session_ID);
                if(joinRemoved)
                {
                    res.status(200).redirect("/viewevent/"+event_id);
                }
                else
                {
                    res.status(401).render('display/viewevent', { id: event_id, error: "You have already joined or event is full!"});
                }
            }
        } catch (e) {
            res.status(404).render('display/viewevent', { error: e.message });
        }
     } else {
         res.status(403).redirect('../error');
     }
    
})

router.get('/viewpet/sign/:id', async (req,res) => {

    if(req.session.userId) {
        try
        {
            let session_ID = req.session.userId;
            let pet_id = req.params.id;
            let signAdded = await petData.addSign(req.params.id,session_ID);
            if(signAdded)
            {
                res.status(200).redirect("/viewpet/"+pet_id);
            }
            else
            {
                let signRemoved = await petData.removeSign(req.params.id,session_ID);
                if(signRemoved)
                {
                    res.status(200).redirect("/viewpet/"+pet_id);
                }
                else
                {
                    res.status(401).render('display/viewpet', { id: pet_id, error: "You have already signed or petition requirement is satisfied!"});
                }
            }
        } catch (e) {
            res.status(404).render('display/viewpet', { error: e.message });
        }
     } else {
         res.status(403).redirect('../error');
     }
    
})

router.get('/viewemg/help/:id', async (req,res) => {

    if(req.session.userId) {
        try
        {
            let session_ID = req.session.userId;
            let emg_id = req.params.id;
            let helpAdded = await emgData.addHelp(req.params.id,session_ID);
            if(helpAdded)
            {
                res.status(200).redirect("/viewemg/"+emg_id);
            }
            else
            {
                let helpRemoved = await emgData.removeHelp(req.params.id,session_ID);
                if(helpRemoved)
                {
                    res.status(200).redirect("/viewemg/"+emg_id);
                }
                else
                {
                    res.status(401).render('display/viewemg', { id: emg_id, error: "You have already shown your interest for this emergency!"});
                }
            }
        } catch (e) {
            res.status(404).render('display/viewemg', { error: e.message });
        }
     } else {
         res.status(403).redirect('../error');
     }
    
})

router.post('/registration', async (req, res) => {
    
    try {  
        if(req.body['g-recaptcha-response'] === undefined || req.body['g-recaptcha-response'] === '' || req.body['g-recaptcha-response'] === null) {
            //console.log("hello");
            return res.status(401).render('display/login', { error: "Please select captcha" });
        }

        let secretKey = "6Lejp8cUAAAAAARLK2LKuoQ5cDUWm7mMbsgQY8XR";

        let verificationUrl = "https://www.google.com/recaptcha/api/siteverify?secret=" + secretKey + "&response=" + req.body['g-recaptcha-response'] + "&remoteip=" + req.connection.remoteAddress;
            // Hitting GET request to the URL, Google will respond with success or error scenario.
            request(verificationUrl, async function(error,response,body) {
                body = JSON.parse(body);
                console.log(body.success);
            // Success will be true or false depending upon captcha validation.
            if(body.success !== undefined && !body.success) {
                return res.status(401).render('display/login', { error: "Failed captcha verification" });
            }

            

            let formData = req.body;

        let emailCheck = await userData.userExistsCheck(formData.email);
        if(emailCheck==true)
        {
            return res.status(401).render('display/login', { error: "User already exist with that email!" });
        }
        else
        {
            let userCreated = await userData.createUser(formData.firstname, formData.lastname, formData.email, formData.password, formData.phoneno);
            if (userCreated) 
            {
                let isValidUser = await userData.loginChecker(formData.email, formData.password);
                req.session.userId = isValidUser;
                req.session.AuthCookie = req.sessionID;
                return res.status(200).redirect('../home');
            } else 
            {
                res.status(401).render('display/login', { error: "New User Creation Failed! Try Again" });
            }
        }
    
        });

    } catch (e) {
        res.status(404).render('display/login', { error: e.message });
    }   
    
})

router.post('/login', async (req, res) => {
    try {
        let formData = req.body;
        let isValidUser = await userData.loginChecker(formData.email, formData.password);
        if (isValidUser!=-1) {
            
            req.session.userId = isValidUser;
            req.session.AuthCookie = req.sessionID;
            return res.status(200).redirect("../home");
        } else {
            res.status(401).render('display/login', { error: "Invalid Credentials!" });   
        }
    } catch (e) {
        res.status(404).render('display/login', { error: e.message });
    }
})

router.post('/adminlogin', async (req, res) => {
    try {
        let formData = req.body;
        let isValidUser = await adminData.loginChecker(formData.email, formData.password);
        if (isValidUser!=-1) {
            req.session.userId = isValidUser;
            req.session.AuthCookie = req.sessionID;
            return res.status(200).redirect("../admindashboard");
        } else {
            res.status(401).render('display/adminlogin', { error: "Invalid Credentials!" });   
        }
    } catch (e) {
        res.status(404).render('display/adminlogin', { error: e.message });
    }
})

router.get('/home', async (req, res) => {
    try {
        let session_ID = req.session.userId;
        const userDetails =await userData.getUserByID(session_ID);
        const displayData =await showData.getAllData();
        return res.status(200).render("display/home", {firstName: userDetails.f_name, lastName: userDetails.l_name, displayData, keywords: "UNCOVERED MEDIA: Home"});
    } catch (e) {
        res.status(404).render('display/home', { error: e.message });
    }
})



router.post('/createpost', async (req, res) => {
     
    let session_ID = req.session.userId;
    
    var form = new formidable.IncomingForm();
    form.uploadDir=img_dir_name + '/public/user_crucial_data/user_images/';
    form.maxFileSize = 4 * 1024 * 1024;
    form.multiples = true;
    var fields = [];
    var files = [];
    var img_name = [];
    

    form.parse(req, function (err, fields, files) {
        
    try 
    {
        
        if(err) throw err;
    
            if(files.image.name)
            {
                img_name[0]=files.image.name;
                var oldpath = files.image.path;
                var newpath = img_dir_name + '/public/user_crucial_data/posts_images/' + files.image.name;
                
                fs.rename(oldpath, newpath, function (err) {
                    //console.log(img_name[0]);
                })
            }
            else
            {
            
                for(let i=0;i<files.image.length;i++)
                {
                    img_name[i] = files.image[i].name;
                    
                    var oldpath = files.image[i].path;
                    var newpath = img_dir_name + '/public/user_crucial_data/posts_images/' + files.image[i].name;
                    
                    fs.rename(oldpath, newpath, function (err) {
                        //console.log(img_name[i]);
                    })

                }
            }

            let postCreated = postData.createPost(session_ID, fields.postTitle, fields.description, fields.tags, fields.loc_lat, fields.loc_lang, img_name, fields.address, fields.postType);
            if(postCreated)
            {
                res.status(200).render("display/createpost", { postSucc: "Post created successfully"});
            }
            else
            {
                res.status(401).render('display/createpost', { error: "Post Creation Failed! Try Again" });
            }
        } catch (e) {
            res.status(404).render('display/createpost', { error: e.message });
        }
        
    }) 
})


router.post('/createevent', async (req, res) => {
     
    let session_ID = req.session.userId;
    
    var form = new formidable.IncomingForm();
    form.uploadDir=img_dir_name + '/public/user_crucial_data/user_images/';

    form.maxFileSize = 4 * 1024 * 1024;
    form.multiples = true;
    var fields = [];
    var files = [];
    var img_name = [];
    

    form.parse(req, function (err, fields, files) {
        
    try 
    {
        
        if(err) throw err;
    
            if(files.image.name)
            {
                img_name[0]=files.image.name;
                var oldpath = files.image.path;
                var newpath = img_dir_name + '/public/user_crucial_data/event_images/' + files.image.name;
                
                fs.rename(oldpath, newpath, function (err) {
                    //console.log(img_name[0]);
                })
            }
            else
            {
            
                for(let i=0;i<files.image.length;i++)
                {
                    img_name[i] = files.image[i].name;
                    
                    var oldpath = files.image[i].path;
                    var newpath = img_dir_name + '/public/user_crucial_data/event_images/' + files.image[i].name;
                    
                    fs.rename(oldpath, newpath, function (err) {
                        //console.log(img_name[i]);
                    })

                }
            }

            let eventCreated = eventData.createEvent(session_ID, fields.eventTitle, fields.description, fields.event_link, fields.loc_lat, fields.loc_lang, img_name, fields.date, fields.time, fields.maxlim, fields.address);
            if(eventCreated)
            {
                res.status(200).render("display/createevent", { eveSucc: "Event created successfully"});
            }
            else
            {
                res.status(401).render('display/createevent', { error: "Event Creation Failed! Try Again" });
            }
        } catch (e) {
            res.status(404).render('display/createevent', { error: e.message });
        }
        
    }) 
})

router.post('/createemg', async (req, res) => {
     
    let session_ID = req.session.userId;
    
    var form = new formidable.IncomingForm();
    form.uploadDir=img_dir_name + '/public/user_crucial_data/user_images/';

    form.maxFileSize = 4 * 1024 * 1024;
    form.multiples = true;
    var fields = [];
    var files = [];
    var img_name = [];
    

    form.parse(req, function (err, fields, files) {
        
    try 
    {
        
        if(err) throw err;
    
            if(files.image.name)
            {
                img_name[0] = files.image.name;
                var oldpath = files.image.path;
                var newpath = img_dir_name + '/public/user_crucial_data/emergency_images/' + files.image.name;
                
                fs.rename(oldpath, newpath, function (err) {
                    //console.log(img_name[0]);
                })
            }
            else
            {
            
                for(let i=0;i<files.image.length;i++)
                {
                    img_name[i] = files.image[i].name;
                    
                    var oldpath = files.image[i].path;
                    var newpath = img_dir_name + '/public/user_crucial_data/emergency_images/' + files.image[i].name;
                    
                    fs.rename(oldpath, newpath, function (err) {
                        //console.log(img_name[i]);
                    })

                }
            }

            let emgCreated = emgData.createEmg(session_ID, fields.emgTitle, fields.description, fields.d_link, fields.loc_lat, fields.loc_lang, img_name, fields.address);
            if(emgCreated)
            {
                res.status(200).render("display/createemg", { emgSucc: "Emergency created successfully"});
            }
            else
            {
                res.status(401).render('display/createemg', { error: "Emergency Creation Failed! Try Again" });
            }
        } catch (e) {
            res.status(404).render('display/createemg', { error: e.message });
        }
        
    }) 
})

router.post('/createpetition', async (req, res) => {
     
    let session_ID = req.session.userId;
    
    var form = new formidable.IncomingForm();
    form.uploadDir=img_dir_name + '/public/user_crucial_data/user_images/';

    form.maxFileSize = 4 * 1024 * 1024;
    form.multiples = true;
    var fields = [];
    var files = [];
    var img_name = [];
    

    form.parse(req, function (err, fields, files) {
        
    try 
    {
        
            let petCreated = petData.createPet(session_ID, fields.petTitle, fields.description, fields.link, img_name, fields.minSig);
            if(petCreated)
            {
                res.status(200).render("display/createpetition", { petSucc: "Petition created successfully"});
            }
            else
            {
                res.status(401).render('display/createpetition', { error: "Petition Creation Failed! Try Again" });
            }
        } catch (e) {
            res.status(404).render('display/createpetition', { error: e.message });
        }
        
    }) 
})

router.post('/addcomment', async (req, res) => {
    
    try 
    {
    let session_ID = req.session.userId;
    let formData = req.body;
        const commentAdded =await postData.addComment(session_ID, formData.post_id, formData.user_comment);
        if(commentAdded)
        {   
            return res.redirect("http://localhost:3000/viewpost/"+formData.post_id);
        }
        else
        {   
            return res.status(401).render('display/viewpost', {id: formData.post_id, error: "Could not add the comment"});
        }
            
    } catch (e) {
        return res.status(404).render('display/viewpost', { error: e.message });
    }

})

router.get('/error',async (req, res) => {
    return res.render("display/error", {keywords:"error page!"})
})

router.get('/error2',async (req, res) => {
    return res.render("display/error2", {keywords:"error page!"})
})

router.get('/errorback', async (req, res) => {
    return res.redirect("/"); 
})

router.get('/errorback2', async (req, res) => {
    return res.redirect("/adminlogin"); 
})

router.get('/regsucc', async (req, res) => {
    return res.redirect("/"); 
})

router.post('/okmodal', async (req, res) => {
    try 
    {
    let formData = req.body;
    const selectVal = formData.postTypeSelect;
        if(selectVal=="post")
        {
            res.redirect("http://localhost:3000/createpost");
        }
        else if(selectVal=="event")
        {
            res.redirect("http://localhost:3000/createevent");
        }
        else if(selectVal=="emg")
        {
            res.redirect("http://localhost:3000/createemg");
        }
        else if(selectVal=="pet")
        {
            res.redirect("http://localhost:3000/createpetition");
        }
            
    } catch (e) {
        res.status(404).render('display/home', { error: e.message });
    }

})


//For Glimpse

router.get('/glimpse', async (req, res) => {
    return res.render("display/glimpse", {keywords: "UNCONVERED MEDIA: GLIMPSE"});
})

router.get('/viewglimpse', async (req, res) => {
    return res.render("display/viewglimpse", {keywords: "UNCONVERED MEDIA: VIEW GLIMPSE"});
})

router.get('/logout', async (req, res) => {
   
    req.session.destroy(function() {
        res.clearCookie('AuthCookie');
        return res.redirect("/");
      });
})

router.get('/logoutadmin', async (req, res) => {
   
    req.session.destroy(function() {
        res.clearCookie('AuthCookie');
        return res.redirect("/adminlogin");
      });
})
module.exports = router;