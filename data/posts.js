const collections = require('../db/collections');
const userData = collections.user_reg_data;
const postData = collections.posts;
const createData = collections.creation_data;
const mongodb = require("mongodb");

let exportedMethods = {

    async createPost(uid, title, desc, tags, loc_lat, loc_lang, image_name, man_location, post_type) {
        const d = new Date();
        const month = d.getMonth()+1;
        const curr_date = month+"/"+d.getDate()+"/"+d.getFullYear();
        const curr_time = d.getHours()+":"+d.getMinutes()+":"+d.getSeconds();
        
        let anon = false;
        if(post_type=="yes")
        {
            anon = true;
        }
        

        const postCollection = await postData();
        const userCollection = await userData();
        const createDataCollection = await createData();

        const userInfo = await userCollection.findOne({ _id: mongodb.ObjectID(uid) });

        const newPost = {
            user_id: uid,
            u_fname: userInfo.f_name,
            u_lname: userInfo.l_name,
            title: title,
            description: desc,
            tags: tags,
            location_lat: loc_lat,
            location_lang: loc_lang,
            manual_location: man_location,
            post_created_date: curr_date,
            post_created_time: curr_time,
            image_name:image_name,
            comments : [],
            views: [],
            likes:[],
            report_as_fake:[],
            report_as_hate_speech:[],
            report_as_spam:[],
            ano: anon
        }

        const newInsertInformation = await postCollection.insertOne(newPost);

        if (newInsertInformation.insertedCount === 0) return false;
        const newId = newInsertInformation.insertedId;

        const createDataEntry = {
            creation_id: newId,
            type: "POST",
            date: curr_date,
            time: curr_time,
            title: title,
            user_id: uid
        }

        const newInsertData = await createDataCollection.insertOne(createDataEntry);
        if (newInsertData.insertedCount === 0) return false;
        
        return newId;

    },

    async getPostByID(id){
        const postCollection = await postData();
        const postInfoData = await postCollection.findOne({ _id: mongodb.ObjectID(id) });
        if(postInfoData) return postInfoData;
    },

    async isEmptyOrSpaces(str){
        return str === null || str.match(/^ *$/) !== null;
    },

    async addComment(user_id, post_id, comment){

        if(await this.isEmptyOrSpaces(comment))
        {
            return false;
        }
        else
        {
            const userCollection = await userData();
            const userInfo = await userCollection.findOne({ _id: mongodb.ObjectID(user_id) });
            const username = userInfo.f_name+" "+userInfo.l_name;
            
            const postCollection = await postData();
            const updateInfo = await postCollection.updateOne(
                {_id: mongodb.ObjectID(post_id)},
                {$addToSet: {comments: {user_id: user_id, user_name: username, comment: comment}}}
            );
        
            if (!updateInfo.matchedCount && !updateInfo.modifiedCount) return false;

            return true;
            
        }

    },

    async addView(post_id,user_id){
        const postCollection = await postData();
        const postInfoData = await postCollection.findOne({ _id: mongodb.ObjectID(post_id) });
        let viewsArr = postInfoData.views;
        const findId = viewsArr.find(element => element === user_id);
        if(!findId){
            const updateInfo = await postCollection.updateOne(
                {_id: mongodb.ObjectID(post_id)},
                {$addToSet: {views: user_id}}
              );
              return true;
        }
    },

    async reactCheck(post_id,user_id)
    {
        const postCollection = await postData();
        const postInfoData = await postCollection.findOne({ _id: mongodb.ObjectID(post_id) });
        let likesArr = postInfoData.likes;
        let fakeArr = postInfoData.report_as_fake;
        let spamArr = postInfoData.report_as_spam;
        let hateArr = postInfoData.report_as_hate_speech;

        const findId = likesArr.find(element => element === user_id);
        const fakeArrCheck = fakeArr.find(element => element === user_id);
        const spamArrCheck = spamArr.find(element => element === user_id);
        const hateArrCheck = hateArr.find(element => element === user_id);

        if(findId)
        {
            return "reactButtBlue";
        }
        else if(fakeArrCheck)
        {
            return "reactButtRed";
        }
        else if(spamArrCheck)
        {
            return "reactButtBlack";
        }
        else if(hateArrCheck)
        {
            return "reactButtPurple";
        }
        else
        {
            return false;
        }
    },

    async addLike(post_id,user_id){
        const postCollection = await postData();
        const postInfoData = await postCollection.findOne({ _id: mongodb.ObjectID(post_id) });
        let likesArr = postInfoData.likes;
        let fakeArr = postInfoData.report_as_fake;
        let spamArr = postInfoData.report_as_spam;
        let hateArr = postInfoData.report_as_hate_speech;

        const findId = likesArr.find(element => element === user_id);
        const fakeArrCheck = fakeArr.find(element => element === user_id);
        const spamArrCheck = spamArr.find(element => element === user_id);
        const hateArrCheck = hateArr.find(element => element === user_id);

        if(!findId){

            if(!fakeArrCheck && !spamArrCheck && !hateArrCheck)
            {
                const updateInfo = await postCollection.updateOne(
                    {_id: mongodb.ObjectID(post_id)},
                    {$addToSet: {likes: user_id}}
                );
              return true;
            }
            else if(fakeArrCheck && !spamArrCheck && !hateArrCheck)
            {
                this.removeFake(post_id,user_id);
                const updateInfo = await postCollection.updateOne(
                    {_id: mongodb.ObjectID(post_id)},
                    {$addToSet: {likes: user_id}}
                );
              return true;
            }
            else if(!fakeArrCheck && spamArrCheck && !hateArrCheck)
            {
                this.removeSpam(post_id,user_id);
                const updateInfo = await postCollection.updateOne(
                    {_id: mongodb.ObjectID(post_id)},
                    {$addToSet: {likes: user_id}}
                );
              return true;
            }
            else if(!fakeArrCheck && !spamArrCheck && hateArrCheck)
            {
                this.removeHate(post_id,user_id);
                const updateInfo = await postCollection.updateOne(
                    {_id: mongodb.ObjectID(post_id)},
                    {$addToSet: {likes: user_id}}
                );
              return true;
            }
        }
    },

    async removeLike(post_id,user_id){
        const postCollection = await postData();
        const postInfoData = await postCollection.findOne({ _id: mongodb.ObjectID(post_id) });
        let likesArr = postInfoData.likes;

        const findId = likesArr.find(element => element === user_id);

        if(findId){

            
                const updateInfo = await postCollection.updateOne(
                    {_id: mongodb.ObjectID(post_id)},
                    {$pull: {likes: user_id}}
                );
              return true;
            
        }
    },

    async addFake(post_id,user_id){
        const postCollection = await postData();
        const postInfoData = await postCollection.findOne({ _id: mongodb.ObjectID(post_id) });
        let fakeArr = postInfoData.report_as_fake;
        let likesArr = postInfoData.likes;
        let spamArr = postInfoData.report_as_spam;
        let hateArr = postInfoData.report_as_hate_speech;

        const findId = fakeArr.find(element => element === user_id);
        const likesArrCheck = likesArr.find(element => element === user_id);
        const spamArrCheck = spamArr.find(element => element === user_id);
        const hateArrCheck = hateArr.find(element => element === user_id);

        if(!findId){
            if(!likesArrCheck && !spamArrCheck && !hateArrCheck)
            {
                const updateInfo = await postCollection.updateOne(
                {_id: mongodb.ObjectID(post_id)},
                {$addToSet: {report_as_fake: user_id}}
                );
              return true;
            }
            else if(likesArrCheck && !spamArrCheck && !hateArrCheck)
            {
                this.removeLike(post_id,user_id);
                const updateInfo = await postCollection.updateOne(
                {_id: mongodb.ObjectID(post_id)},
                {$addToSet: {report_as_fake: user_id}}
                );
              return true;
            }
            else if(!likesArrCheck && spamArrCheck && !hateArrCheck)
            {
                this.removeSpam(post_id,user_id);
                const updateInfo = await postCollection.updateOne(
                {_id: mongodb.ObjectID(post_id)},
                {$addToSet: {report_as_fake: user_id}}
                );
              return true;
            }
            else if(!likesArrCheck && !spamArrCheck && hateArrCheck)
            {
                this.removeHate(post_id,user_id);
                const updateInfo = await postCollection.updateOne(
                {_id: mongodb.ObjectID(post_id)},
                {$addToSet: {report_as_fake: user_id}}
                );
              return true;
            }
        }
    },

    async removeFake(post_id,user_id){
        const postCollection = await postData();
        const postInfoData = await postCollection.findOne({ _id: mongodb.ObjectID(post_id) });
        let fakeArr = postInfoData.report_as_fake;

        const findId = fakeArr.find(element => element === user_id);

        if(findId){

            
                const updateInfo = await postCollection.updateOne(
                    {_id: mongodb.ObjectID(post_id)},
                    {$pull: {report_as_fake: user_id}}
                );
              return true;
            
        }
    },

    async addSpam(post_id,user_id){
        const postCollection = await postData();
        const postInfoData = await postCollection.findOne({ _id: mongodb.ObjectID(post_id) });
        let spamArr = postInfoData.report_as_spam;
        let fakeArr = postInfoData.report_as_fake;
        let likesArr = postInfoData.likes;
        let hateArr = postInfoData.report_as_hate_speech;

        const findId = spamArr.find(element => element === user_id);
        const likesArrCheck = likesArr.find(element => element === user_id);
        const fakeArrCheck = fakeArr.find(element => element === user_id);
        const hateArrCheck = hateArr.find(element => element === user_id);

        if(!findId){
            if(!likesArrCheck && !fakeArrCheck && !hateArrCheck)
            {
                const updateInfo = await postCollection.updateOne(
                    {_id: mongodb.ObjectID(post_id)},
                    {$addToSet: {report_as_spam: user_id}}
                );
                return true;
            }
            else if(likesArrCheck && !fakeArrCheck && !hateArrCheck)
            {
                this.removeLike(post_id,user_id);
                const updateInfo = await postCollection.updateOne(
                    {_id: mongodb.ObjectID(post_id)},
                    {$addToSet: {report_as_spam: user_id}}
                );
                return true;
            }
            else if(!likesArrCheck && fakeArrCheck && !hateArrCheck)
            {
                this.removeFake(post_id,user_id);
                const updateInfo = await postCollection.updateOne(
                    {_id: mongodb.ObjectID(post_id)},
                    {$addToSet: {report_as_spam: user_id}}
                );
                return true;
            }
            else if(!likesArrCheck && !fakeArrCheck && hateArrCheck)
            {
                this.removeHate(post_id,user_id);
                const updateInfo = await postCollection.updateOne(
                    {_id: mongodb.ObjectID(post_id)},
                    {$addToSet: {report_as_spam: user_id}}
                );
                return true;
            }
        }
    },

    async removeSpam(post_id,user_id){
        const postCollection = await postData();
        const postInfoData = await postCollection.findOne({ _id: mongodb.ObjectID(post_id) });
        let spamArr = postInfoData.report_as_spam;

        const findId = spamArr.find(element => element === user_id);

        if(findId){

            
                const updateInfo = await postCollection.updateOne(
                    {_id: mongodb.ObjectID(post_id)},
                    {$pull: {report_as_spam: user_id}}
                );
              return true;
            
        }
    },

    async addHate(post_id,user_id){
        const postCollection = await postData();
        const postInfoData = await postCollection.findOne({ _id: mongodb.ObjectID(post_id) });
        let hateArr = postInfoData.report_as_hate_speech;
        let spamArr = postInfoData.report_as_spam;
        let fakeArr = postInfoData.report_as_fake;
        let likesArr = postInfoData.likes;

        const findId = hateArr.find(element => element === user_id);
        const likesArrCheck = likesArr.find(element => element === user_id);
        const fakeArrCheck = fakeArr.find(element => element === user_id);
        const spamArrCheck = spamArr.find(element => element === user_id);

        if(!findId){
            if(!likesArrCheck && !fakeArrCheck && !spamArrCheck)
            {
                const updateInfo = await postCollection.updateOne(
                    {_id: mongodb.ObjectID(post_id)},
                    {$addToSet: {report_as_hate_speech: user_id}}
                );
                return true;
            }
            else if(likesArrCheck && !fakeArrCheck && !spamArrCheck)
            {
                this.removeLike(post_id,user_id);
                const updateInfo = await postCollection.updateOne(
                    {_id: mongodb.ObjectID(post_id)},
                    {$addToSet: {report_as_hate_speech: user_id}}
                );
                return true;
            }
            else if(!likesArrCheck && fakeArrCheck && !spamArrCheck)
            {
                this.removeFake(post_id,user_id);
                const updateInfo = await postCollection.updateOne(
                    {_id: mongodb.ObjectID(post_id)},
                    {$addToSet: {report_as_hate_speech: user_id}}
                );
                return true;
            }
            else if(!likesArrCheck && !fakeArrCheck && spamArrCheck)
            {
                this.removeSpam(post_id,user_id);
                const updateInfo = await postCollection.updateOne(
                    {_id: mongodb.ObjectID(post_id)},
                    {$addToSet: {report_as_hate_speech: user_id}}
                );
                return true;
            }
        }
    },

    async removeHate(post_id,user_id){
        const postCollection = await postData();
        const postInfoData = await postCollection.findOne({ _id: mongodb.ObjectID(post_id) });
        let hateArr = postInfoData.report_as_hate_speech;

        const findId = hateArr.find(element => element === user_id);

        if(findId){

            
                const updateInfo = await postCollection.updateOne(
                    {_id: mongodb.ObjectID(post_id)},
                    {$pull: {report_as_hate_speech: user_id}}
                );
              return true;
            
        }
    }
};

module.exports = exportedMethods;