const collections = require('../db/collections');
const userData = collections.user_reg_data;
const emgData = collections.emg;
const createData = collections.creation_data;
const mongodb = require("mongodb");

let exportedMethods = {

    async createEmg(uid, title, desc, link, loc_lat, loc_lang, image_name, man_location) {
        const d = new Date();
        const month = d.getMonth()+1;
        const curr_date = month+"/"+d.getDate()+"/"+d.getFullYear();
        const curr_time = d.getHours()+":"+d.getMinutes()+":"+d.getSeconds();

        const emgCollection = await emgData();
        const userCollection = await userData();
        const createDataCollection = await createData();
        const userInfo = await userCollection.findOne({ _id: mongodb.ObjectID(uid) });

        const newEmg = {
            user_id: uid,
            u_fname: userInfo.f_name,
            u_lname: userInfo.l_name,
            title: title,
            description: desc,
            link: link,
            location_lat: loc_lat,
            location_lang: loc_lang,
            manual_location: man_location,
            emg_created_date: curr_date,
            emg_created_time: curr_time,
            image_name: image_name,
            helpers_attending: [],
            emg_completion: false,
            views: []
        }

        const newInsertInformation = await emgCollection.insertOne(newEmg);
        if (newInsertInformation.insertedCount === 0) return false;
        const newId = newInsertInformation.insertedId;

        const createDataEntry = {
            creation_id: newId,
            type: "EMERGENCY",
            date: curr_date,
            time: curr_time,
            title: title,
            user_id: uid
        }

        const newInsertData = await createDataCollection.insertOne(createDataEntry);
        if (newInsertData.insertedCount === 0) return false;

        return true;

    },

    async getEmgByID(id){
        const emgCollection = await emgData();
        const emgInfoData = await emgCollection.findOne({ _id: mongodb.ObjectID(id) });
        if(emgInfoData) return emgInfoData;
    },

    async addView(emg_id,user_id){
        const emgCollection = await emgData();
        const emgInfoData = await emgCollection.findOne({ _id: mongodb.ObjectID(emg_id) });
        let viewsArr = emgInfoData.views;
        const findId = viewsArr.find(element => element === user_id);
        if(!findId){
            const updateInfo = await emgCollection.updateOne(
                {_id: mongodb.ObjectID(emg_id)},
                {$addToSet: {views: user_id}}
              );
              return true;
        }
    },

    async addHelp(emg_id,user_id){
        const emgCollection = await emgData();
        const emgInfoData = await emgCollection.findOne({ _id: mongodb.ObjectID(emg_id) });
        
            let helpArr = emgInfoData.helpers_attending;
            const findId = helpArr.find(element => element === user_id);
            if(!findId){
                const updateInfo = await emgCollection.updateOne(
                    {_id: mongodb.ObjectID(emg_id)},
                    {$addToSet: {helpers_attending: user_id}}
                );
                return true;
            }
    },

    async removeHelp(emg_id,user_id){
        const emgCollection = await emgData();
        const emgInfoData = await emgCollection.findOne({ _id: mongodb.ObjectID(emg_id) });
        
            let helpArr = emgInfoData.helpers_attending;

            const findId = helpArr.find(element => element === user_id);

        if(findId){

            
                const updateInfo = await emgCollection.updateOne(
                    {_id: mongodb.ObjectID(emg_id)},
                    {$pull: {helpers_attending: user_id}}
                );
              return true;
            
        }
    }
};

module.exports = exportedMethods;