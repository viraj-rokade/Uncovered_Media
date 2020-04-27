const collections = require('../db/collections');
const userData = collections.user_reg_data;
const postData = collections.posts;
const createData = collections.creation_data;
const adminData = collections.admin_data;
const mongodb = require("mongodb");
const bcrypt = require('bcryptjs');

let exportedMethods = {
    async loginChecker(email, password){   
       
        const adminCollection = await adminData();
        const adminDataPresent = await adminCollection.findOne({ email_id: email });
        
        if(!adminDataPresent)
        {
            return -1;
        }
        else
        {
            if(adminDataPresent.email_id===email)
            {
                
                let passCheck = await bcrypt.compareSync(password, adminDataPresent.hashed_pass);
                if(passCheck)
                {
                    return adminDataPresent._id;
                }
                else
                {
                    return -1;
                }
            }
            else
            {
                return -1;
            }
        }
        
    },

    async callFlaggedData(){
        const postCollection = await postData();
        const postDataInfo = await postCollection.find({}).toArray();

        let finalArr = [];

        for(let i=0, j=0;i<postDataInfo.length;i++)
        {
            const userCollection = await userData();
            const userDataInfo = await userCollection.findOne({ _id: mongodb.ObjectID(postDataInfo[i].user_id) });

            if(postDataInfo[i].views.length>=10)
            {
                let reported = postDataInfo[i].report_as_fake.length + postDataInfo[i].report_as_spam.length + postDataInfo[i].report_as_hate_speech.length;
                let threshold = (reported / postDataInfo[i].views.length ) * 100;
                if(threshold>=55)
                {
                    finalArr[j] = {
                        post_id: postDataInfo[i]._id,
                        user_id: postDataInfo[i].user_id,
                        name: postDataInfo[i].u_fname+" "+postDataInfo[i].u_lname,
                        title: postDataInfo[i].title,
                        description: postDataInfo[i].description,
                        tags: postDataInfo[i].tags,
                        images: postDataInfo[i].image_name,
                        warnings: userDataInfo.warnings,
                        threshold: threshold,
                        reported: reported,
                        views: postDataInfo[i].views.length
                    };
                    j++;
                }
            }
        }
        return finalArr;
    },
    
    async takeAction(post_id, user_id, action){
        if(action==2)
        {
            const userCollection = await userData();
            const userDataInfo = await userCollection.findOne({ _id: mongodb.ObjectID(user_id)});
            let warningUpd = userDataInfo.warnings+1;
            const updateInfo = await userCollection.updateOne(
                {_id: mongodb.ObjectID(user_id)},
                {$set: {warnings: warningUpd}}
            );

            const createDataCollection = await createData();
            const deletionInfo2 = await createDataCollection.remove( { "creation_id" : mongodb.ObjectID(post_id) } );
            if (deletionInfo2.deletedCount === 0) {
                return false;
            }


            const postCollection = await postData();
            const deletionInfo = await postCollection.remove( { "_id" : mongodb.ObjectID(post_id) } );
            console.log(post_id);
            if (deletionInfo.deletedCount === 0) {
                return false;
            }
            

            return true;
        }
        else if(action==3)
        {
            const userCollection = await userData();
            const updateInfo = await userCollection.updateOne(
                {_id: mongodb.ObjectID(user_id)},
                {$set: {ban_status: true}}
            );

            const postCollection = await postData();
            const deletionInfo = await postCollection.removeOne({_id: mongodb.ObjectID(post_id)});
            if (deletionInfo.deletedCount === 0) {
            return false;
            }

            const createDataCollection = await createData();
            const deletionInfo2 = await createDataCollection.removeOne({creation_id: mongodb.ObjectID(post_id)});
            if (deletionInfo2.deletedCount === 0) {
            return false;
            }
        
            return true;
        }
        else if(action==4)
        {
            const postCollection = await postData();
            const updateInfo = await postCollection.updateOne(
                {_id: mongodb.ObjectID(post_id)},
                {$addToSet: {report_as_fake: [], report_as_spam: [], report_as_hate_speech: []}}
            );
            return true;
        }
        else if(action==1)
        {
            return true;
        }
    }
     
};

module.exports = exportedMethods;
