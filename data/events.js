const collections = require('../db/collections');
const userData = collections.user_reg_data;
const eventData = collections.events;
const createData = collections.creation_data;
const mongodb = require("mongodb");

let exportedMethods = {

    async createEvent(uid, title, desc, link, loc_lat, loc_lang, image_name, ev_date, ev_time, maxlim, man_location) {
        const d = new Date();
        const month = d.getMonth()+1;
        const curr_date = month+"/"+d.getDate()+"/"+d.getFullYear();
        const curr_time = d.getHours()+":"+d.getMinutes()+":"+d.getSeconds();

        const eventCollection = await eventData();
        const userCollection = await userData();
        const createDataCollection = await createData();

        const userInfo = await userCollection.findOne({ _id: mongodb.ObjectID(uid) });

        const newEvent = {
            user_id: uid,
            u_fname: userInfo.f_name,
            u_lname: userInfo.l_name,
            title: title,
            description: desc,
            link: link,
            location_lat: loc_lat,
            location_lang: loc_lang,
            manual_location: man_location,
            event_created_date: curr_date,
            event_created_time: curr_time,
            event_date: ev_date,
            event_time: ev_time,
            max_limit: maxlim,
            image_name:image_name,
            users_attending: [],
            accept_joining: true,
            event_completion: false,
            views: []
        }

        const newInsertInformation = await eventCollection.insertOne(newEvent);
        if (newInsertInformation.insertedCount === 0) return false;
        const newId = newInsertInformation.insertedId;

        const createDataEntry = {
            creation_id: newId,
            type: "EVENT",
            date: curr_date,
            time: curr_time,
            title: title,
            user_id: uid
        }

        const newInsertData = await createDataCollection.insertOne(createDataEntry);
        if (newInsertData.insertedCount === 0) return false;

        return true;

    },

    async getEventByID(id){
        const eventCollection = await eventData();
        const eventInfoData = await eventCollection.findOne({ _id: mongodb.ObjectID(id) });
        if(eventInfoData) return eventInfoData;
    },

    
    async addView(event_id,user_id){
        const eventCollection = await eventData();
        const eventInfoData = await eventCollection.findOne({ _id: mongodb.ObjectID(event_id) });
        let viewsArr = eventInfoData.views;
        const findId = viewsArr.find(element => element === user_id);
        if(!findId){
            const updateInfo = await eventCollection.updateOne(
                {_id: mongodb.ObjectID(event_id)},
                {$addToSet: {views: user_id}}
              );
              return true;
        }
    },

    async addJoin(event_id,user_id){
        const eventCollection = await eventData();
        const eventInfoData = await eventCollection.findOne({ _id: mongodb.ObjectID(event_id) });
        let max_lim = eventInfoData.max_limit;
        if(max_lim>eventInfoData.users_attending.length)
        {
            let joinArr = eventInfoData.users_attending;
            const findId = joinArr.find(element => element === user_id);
            if(!findId){
                const updateInfo = await eventCollection.updateOne(
                    {_id: mongodb.ObjectID(event_id)},
                    {$addToSet: {users_attending: user_id}}
                );
                return true;
            }
        }
        else
        {
            return false;
        }
    },

    async removeJoin(event_id,user_id){
        const eventCollection = await eventData();
        const eventInfoData = await eventCollection.findOne({ _id: mongodb.ObjectID(event_id) });
        
        let joinArr = eventInfoData.users_attending;

            const findId = joinArr.find(element => element === user_id);

        if(findId){

            
                const updateInfo = await eventCollection.updateOne(
                    {_id: mongodb.ObjectID(event_id)},
                    {$pull: {users_attending: user_id}}
                );
              return true;
            
        }
    }
};

module.exports = exportedMethods;