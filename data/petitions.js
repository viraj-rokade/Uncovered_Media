const collections = require('../db/collections');
const userData = collections.user_reg_data;
const petData = collections.petitions;
const createData = collections.creation_data;
const mongodb = require("mongodb");

let exportedMethods = {

    async createPet(uid, title, desc, link, image_name, minsig) {
        const d = new Date();
        const month = d.getMonth()+1;
        const curr_date = month+"/"+d.getDate()+"/"+d.getFullYear();
        const curr_time = d.getHours()+":"+d.getMinutes()+":"+d.getSeconds();

        const petCollection = await petData();
        const userCollection = await userData();
        const createDataCollection = await createData();
        const userInfo = await userCollection.findOne({ _id: mongodb.ObjectID(uid) });

        const newPet = {
            user_id: uid,
            u_fname: userInfo.f_name,
            u_lname: userInfo.l_name,
            title: title,
            description: desc,
            link: link,
            pet_created_date: curr_date,
            pet_created_time: curr_time,
            min_signs: minsig,
            // image_name:image_name,
            signatures: [],
            accept_signs: true,
            views: []
        }

        const newInsertInformation = await petCollection.insertOne(newPet);
        if (newInsertInformation.insertedCount === 0) return false;

        const newId = newInsertInformation.insertedId;

        const createDataEntry = {
            creation_id: newId,
            type: "PETITION",
            date: curr_date,
            time: curr_time,
            title: title,
            user_id: uid
        }

        const newInsertData = await createDataCollection.insertOne(createDataEntry);

        return true;

    },

    async getPetByID(id){
        const petCollection = await petData();
        const petInfoData = await petCollection.findOne({ _id: mongodb.ObjectID(id) });
        if(petInfoData) return petInfoData;
    },

    async addView(pet_id,user_id){
        const petCollection = await petData();
        const petInfoData = await petCollection.findOne({ _id: mongodb.ObjectID(pet_id) });
        let viewsArr = petInfoData.views;
        const findId = viewsArr.find(element => element === user_id);
        if(!findId){
            const updateInfo = await petCollection.updateOne(
                {_id: mongodb.ObjectID(pet_id)},
                {$addToSet: {views: user_id}}
              );
              return true;
        }
    },

    async addSign(pet_id,user_id){
        const petCollection = await petData();
        const petInfoData = await petCollection.findOne({ _id: mongodb.ObjectID(pet_id) });
        let max_lim = petInfoData.min_signs;
        if(max_lim>petInfoData.signatures.length)
        {
            let signArr = petInfoData.signatures;
            const findId = signArr.find(element => element === user_id);
            if(!findId){
                const updateInfo = await petCollection.updateOne(
                    {_id: mongodb.ObjectID(pet_id)},
                    {$addToSet: {signatures: user_id}}
                );
                return true;
            }
        }
        else
        {
            return false;
        }
    },

    async removeSign(pet_id,user_id){
        const petCollection = await petData();
        const petInfoData = await petCollection.findOne({ _id: mongodb.ObjectID(pet_id) });
        
        let signArr = petInfoData.signatures;

            const findId = signArr.find(element => element === user_id);

        if(findId){

            
                const updateInfo = await petCollection.updateOne(
                    {_id: mongodb.ObjectID(pet_id)},
                    {$pull: {signatures: user_id}}
                );
              return true;
            
        }
    }
};

module.exports = exportedMethods;