const collections = require('../db/collections');
const createData = collections.creation_data;
const postData = collections.posts;
const petData = collections.petitions;
const eventData = collections.events;
const emgData = collections.emg;
const userData = collections.user_reg_data;
const mongodb = require("mongodb");

let exportedMethods = {
    async getAllData(){
        const createDataCollection = await createData();
        const allData0 = await createDataCollection.find({}).toArray();
        const allData = [];
        let finalData = [];
        
        for(let j=0,k=allData0.length-1;k>=0;k--,j++)
        {
            allData[j]=allData0[k];
        }

        for(let i=0;i<allData.length;i++)
        {
            if(allData[i].type=="POST") 
            {
                const postCollection = await postData();
                const postInfo = await postCollection.findOne({ _id: mongodb.ObjectID(allData[i].creation_id) });
                const userCollection = await userData();
                const userImg = await userCollection.findOne({ _id: mongodb.ObjectID(allData[i].user_id) });
                const dataObj = {
                    creation_id: allData[i].creation_id,
                    type: allData[i].type,
                    title: allData[i].title,
                    views: postInfo.views.length,
                    likes: postInfo.likes,
                    fake: postInfo.report_as_fake,
                    spam: postInfo.report_as_spam,
                    hate: postInfo.report_as_hate_speech,
                    date: allData[i].date,
                    time: allData[i].time,
                    image: userImg.profile_img_name,
                    ano: postInfo.ano
                }
                finalData[i]=dataObj;
            }
            else if(allData[i].type=="EVENT") 
            {
                const eventCollection = await eventData();
                const eventInfo = await eventCollection.findOne({ _id: mongodb.ObjectID(allData[i].creation_id) });
                const userCollection = await userData();
                const userImg = await userCollection.findOne({ _id: mongodb.ObjectID(allData[i].user_id) });
                const people = eventInfo.users_attending.length+" / "+eventInfo.max_limit;
                const dataObj = {
                    creation_id: allData[i].creation_id,
                    type: allData[i].type,
                    title: allData[i].title,
                    views: eventInfo.views.length,
                    people: people,
                    date: allData[i].date,
                    time: allData[i].time,
                    image: userImg.profile_img_name,
                    ano: false
                }
                finalData[i]=dataObj;
            }
            else if(allData[i].type=="PETITION") 
            {
                const petCollection = await petData();
                const petInfo = await petCollection.findOne({ _id: mongodb.ObjectID(allData[i].creation_id) });
                const userCollection = await userData();
                const userImg = await userCollection.findOne({ _id: mongodb.ObjectID(allData[i].user_id) });
                const signs = petInfo.signatures.length+" / "+petInfo.min_signs;
                const dataObj = {
                    creation_id: allData[i].creation_id,
                    type: allData[i].type,
                    title: allData[i].title,
                    views: petInfo.views.length,
                    signs: signs,
                    date: allData[i].date,
                    time: allData[i].time,
                    image: userImg.profile_img_name,
                    ano: false
                    
                }
                finalData[i]=dataObj;
            }
            else if(allData[i].type=="EMERGENCY") 
            {
                const emgCollection = await emgData();
                const emgInfo = await emgCollection.findOne({ _id: mongodb.ObjectID(allData[i].creation_id) });
                const userCollection = await userData();
                const userImg = await userCollection.findOne({ _id: mongodb.ObjectID(allData[i].user_id) });
                const people = emgInfo.helpers_attending.length;
                const dataObj = {
                    creation_id: allData[i].creation_id,
                    type: allData[i].type,
                    title: allData[i].title,
                    views: emgInfo.views.length,
                    people: people,
                    date: allData[i].date,
                    time: allData[i].time,
                    image: userImg.profile_img_name,
                    ano: false
                }
                finalData[i]=dataObj;
            }
        }
        
        return finalData;
    },

    async getAllProfileData(session_id){
        const createDataCollection = await createData();
        const allData0 = await createDataCollection.find({ user_id: mongodb.ObjectID(session_id)}).toArray();
        const allData = [];
        let finalData = [];
        
        for(let j=0,k=allData0.length-1;k>=0;k--,j++)
        {
            allData[j]=allData0[k];
        }

        for(let i=0;i<allData.length;i++)
        {
            if(allData[i].type=="POST") 
            {
                const postCollection = await postData();
                const postInfo = await postCollection.findOne({ _id: mongodb.ObjectID(allData[i].creation_id) });
                const userCollection = await userData();
                const userImg = await userCollection.findOne({ _id: mongodb.ObjectID(allData[i].user_id) });
                const dataObj = {
                    creation_id: allData[i].creation_id,
                    type: allData[i].type,
                    title: allData[i].title,
                    views: postInfo.views.length,
                    likes: postInfo.likes,
                    fake: postInfo.report_as_fake,
                    spam: postInfo.report_as_spam,
                    hate: postInfo.report_as_hate_speech,
                    date: allData[i].date,
                    time: allData[i].time,
                    image: userImg.profile_img_name
                }
                finalData[i]=dataObj;
            }
            else if(allData[i].type=="EVENT") 
            {
                const eventCollection = await eventData();
                const eventInfo = await eventCollection.findOne({ _id: mongodb.ObjectID(allData[i].creation_id) });
                const userCollection = await userData();
                const userImg = await userCollection.findOne({ _id: mongodb.ObjectID(allData[i].user_id) });
                const people = eventInfo.users_attending.length+" / "+eventInfo.max_limit;
                const dataObj = {
                    creation_id: allData[i].creation_id,
                    type: allData[i].type,
                    title: allData[i].title,
                    views: eventInfo.views.length,
                    people: people,
                    date: allData[i].date,
                    time: allData[i].time,
                    image: userImg.profile_img_name
                }
                finalData[i]=dataObj;
            }
            else if(allData[i].type=="PETITION") 
            {
                const petCollection = await petData();
                const petInfo = await petCollection.findOne({ _id: mongodb.ObjectID(allData[i].creation_id) });
                const userCollection = await userData();
                const userImg = await userCollection.findOne({ _id: mongodb.ObjectID(allData[i].user_id) });
                const signs = petInfo.signatures.length+" / "+petInfo.min_signs;
                const dataObj = {
                    creation_id: allData[i].creation_id,
                    type: allData[i].type,
                    title: allData[i].title,
                    views: petInfo.views.length,
                    signs: signs,
                    date: allData[i].date,
                    time: allData[i].time,
                    image: userImg.profile_img_name
                }
                finalData[i]=dataObj;
            }
            else if(allData[i].type=="EMERGENCY") 
            {
                const emgCollection = await emgData();
                const emgInfo = await emgCollection.findOne({ _id: mongodb.ObjectID(allData[i].creation_id) });
                const userCollection = await userData();
                const userImg = await userCollection.findOne({ _id: mongodb.ObjectID(allData[i].user_id) });
                const people = emgInfo.helpers_attending.length;
                const dataObj = {
                    creation_id: allData[i].creation_id,
                    type: allData[i].type,
                    title: allData[i].title,
                    views: emgInfo.views.length,
                    people: people,
                    date: allData[i].date,
                    time: allData[i].time,
                    image: userImg.profile_img_name

                }
                finalData[i]=dataObj;
            }
        }
        
        return finalData;
    }

};
module.exports = exportedMethods;