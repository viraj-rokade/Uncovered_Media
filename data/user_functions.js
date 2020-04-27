const collections = require('../db/collections');
const userData = collections.user_reg_data;
const createData = collections.creation_data;
const postData = collections.posts;
const petData = collections.petitions;
const eventData = collections.events;
const emgData = collections.emg;
const mongodb = require("mongodb");
const bcrypt = require('bcryptjs');

let exportedMethods = {

    async createUser(fname, lname, eid, pass, phone) {
        const hashP = bcrypt.hashSync(pass, 10);
        const d = new Date();
        const month = d.getMonth()+1;
        const curr_date = month+"/"+d.getDate()+"/"+d.getFullYear();
        const userCollection = await userData();
        eid = eid.toLowerCase();

        const newUser = {
            f_name: fname,
            l_name: lname,
            email_id: eid,
            hashed_pass: hashP,
            phone_no: phone,
            address: null,
            city: null,
            state: null,
            country: null,
            zip: null,
            dob: null,
            gender: null,
            profile_img_name: null,
            profile_img_format: null,
            warnings: 0,
            ban_status: false,
            reg_date: curr_date
        };

        const newInsertInformation = await userCollection.insertOne(newUser);
        if (newInsertInformation.insertedCount === 0) return false;
        return newInsertInformation.insertedId;
    },

    async userExistsCheck(email){
        email= email.toLowerCase();
        const userCollection = await userData();
        const userPresentInfo = await userCollection.findOne({ email_id: email });

        if (!userPresentInfo)
        {
           return false;
        }
        else 
        {
            return true;
        }   
    },

    async getUserByID(id){   
        const userCollection = await userData();
        const userPresentInfo = await userCollection.findOne({ _id: mongodb.ObjectID(id) });
        return userPresentInfo;
    },

    async loginChecker(email, password){   
       email = email.toLowerCase();
        const userCollection = await userData();
        const userDataPresent = await userCollection.findOne({ email_id: email });
        if(!userDataPresent)
        {
            return -1;
        }
        else
        {
            if(userDataPresent.email_id===email)
            {
                if(userDataPresent.ban_status==true)
                {
                    return -1;
                }
                else
                {
                    let passCheck = await bcrypt.compareSync(password, userDataPresent.hashed_pass);
                    if(passCheck)
                    {
                        return userDataPresent._id;
                    }
                    else
                    {
                        return -1;
                    }
                }
                
            }
            else
            {
                return -1;
            }
        }
        
    },

    async updateProfile(id, address, city, state, country, zip, dob, gender, image_name){   
        const userCollection = await userData();
        const updateInfo = await userCollection.updateOne(
            {_id: mongodb.ObjectID(id)},
            {$set: {address: address, city: city, state: state, country: country, zip: zip, dob: dob, gender: gender, profile_img_name: image_name}}
          );
      
          if (!updateInfo.matchedCount && !updateInfo.modifiedCount) return false;

          return true;
    },

    async getUserImage(user_id){
        const userCollection = await userData();
        const userImg = await userCollection.findOne({ _id: mongodb.ObjectID(user_id) });
       // console.log(userImg)
        return userImg.profile_img_name;
    },

    async deletePost(post_id){

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
            

    },

    async deleteEvent(event_id){

        const createDataCollection = await createData();
        const deletionInfo2 = await createDataCollection.remove( { "creation_id" : mongodb.ObjectID(event_id) } );
        if (deletionInfo2.deletedCount === 0) {
            return false;
        }


        const postCollection = await eventData();
        const deletionInfo = await postCollection.remove( { "_id" : mongodb.ObjectID(event_id) } );
        console.log(event_id);
        if (deletionInfo.deletedCount === 0) {
            return false;
        }


        return true;

    },

    async deleteEmg(emg_id){

        const createDataCollection = await createData();
        const deletionInfo2 = await createDataCollection.remove( { "creation_id" : mongodb.ObjectID(emg_id) } );
        if (deletionInfo2.deletedCount === 0) {
            return false;
        }


        const postCollection = await emgData();
        const deletionInfo = await postCollection.remove( { "_id" : mongodb.ObjectID(emg_id) } );
        console.log(emg_id);
        if (deletionInfo.deletedCount === 0) {
            return false;
        }

        return true;

    },

    async deletePet(pet_id){

        const createDataCollection = await createData();
        const deletionInfo2 = await createDataCollection.remove( { "creation_id" : mongodb.ObjectID(pet_id) } );
        if (deletionInfo2.deletedCount === 0) {
            return false;
        }


        const postCollection = await petData();
        const deletionInfo = await postCollection.remove( { "_id" : mongodb.ObjectID(pet_id) } );
        console.log(pet_id);
        if (deletionInfo.deletedCount === 0) {
            return false;
        }

        return true;

    },

};
module.exports = exportedMethods;