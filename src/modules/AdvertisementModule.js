const advertisementDb = require("../models/advertisementModels");

class AdvertisementModule {
    static find = async params => {
        const {id} = params;
        if (id) {
            const foundById = await advertisementDb.findById(id);

            if (foundById) {
                return foundById;
            } else {
                return [];
            }
        }

        const {shortText, description, userId} = params;
        
        let {tags} = params;
        if (tags) {
            tags = tags.split(',');
        }
               
        let filter = {
            userId: (userId)? userId : undefined,
            shortText: (shortText)? new RegExp(`${shortText}`): undefined, 
            description: (description)? new RegExp(`${description}`) : undefined,
            tags: (tags)? {$all: tags} : undefined,             
        };

        for (let key in filter) {
            if (!filter[key]) {
                delete filter[key];
            }
        } 
        
        if (Object.keys(filter).length > 0) {
            const findBy = await advertisementDb.find(filter);
            return findBy;
        } else {
            const findBy = await advertisementDb.find();
            return findBy;
        }
    };

    static create = async data => {
        const {shortText, userId, createdAt, updatedAt, tags, description, images, isDeleted = false } = data;

        if(userId && shortText && createdAt && updatedAt && !isDeleted) {
            const newAdvertisement = new advertisementDb({
                shortText, 
                userId,
                createdAt,
                updatedAt,
                description,
                images,
                tags,
                isDeleted
            });

            try {
                await newAdvertisement.save();            
                return newAdvertisement;
            } catch(e) {
                return (e);
            };
        } else {
            console.log('Недостаточно данных');
            throw new Error('Недостаточно данных');
        }
    };
};

module.exports = AdvertisementModule;