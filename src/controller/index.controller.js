const axios = require('axios');

const {URL} = require('../database/database')

const getAvailableDate = async(req, res, next) => {
    try{

        //take Data from databse (URL)
        const response = await axios.get(URL);
        const datas = response.data;

        //take customer checkin Date from request.param
        const customerDate = req.params['date'];

        //check the format of customer check-in date (YYYY-MM-DD)
        const year = customerDate.slice(0, 4);  //YYYY
        const month = customerDate.slice(5, 7); //MM
        const day = customerDate.slice(8);      //DD

        if(!isNaN(year) && !isNaN(month) && !isNaN(day));
        else{
            res.send("wrong customer date format!")
            console.log("wrong customer date format!");
            return;
        } 

        //store data after each filter        
        var data =[];

        /*  Category:
            Resturant - 1
            Retail - 2
            Hotel - 3
            Activity - 4

            Filter out the category 3
        */
        const offers = {...datas}["offers"];
        const noHotelFilter = offers.filter(eachOffer => eachOffer["category"] != 3)

        //change customre date from string to Date object
        const customerCheckinDate = new Date(customerDate);

        //checking date validation
        //the validation date must be after 5 days comapre to customer checkin date
        var requireDate = customerCheckinDate;
        requireDate.setDate(customerCheckinDate.getDate() + 5);

        const validDateFilter = []
        for(eachOffer of noHotelFilter)
        {
            const date = new Date(eachOffer["valid_to"]);
            if( date.getTime() >= requireDate.getTime())
            {
                validDateFilter.push(eachOffer);
            }
        }

        data = validDateFilter;
        //one offer can have multiple merchants, choose the closet merchant in each offer.
        //this is a merchan filter, so supposedly the number of offers should be unchanged.
        const MerchantFilter = [];
        for(eachOffer of data)
        {
            //check if the offer has only 1 merchant, keep the offer and continue with another offer
            const merchants = eachOffer["merchants"]
            if(merchants.length == 1)
            {
                MerchantFilter.push(eachOffer);
                continue;
            }
            
            //offer with 2 or more merchants

            //push every merchants' distance into array then find the minimum
            const distance = [];
            merchants.forEach(eachMerchant => {
                distance.push(eachMerchant["distance"])
            });
            const minDistance = Math.min(...distance)
 
            //find the merchant with the minimum distance then store the merchant in each offer
            for(eachMerchant of merchants)
            {
                if(eachMerchant["distance"] == minDistance)
                {
                    eachOffer["merchants"] = [eachMerchant];
                    break;
                }
            }
            MerchantFilter.push(eachOffer);
        }

        data = MerchantFilter;

        /*  
            Requirement: data return in different category, if data has the same category, choose the closet one.
            Make a map with key: category
                            value: { id, distance}.
            everytime loop through the Offer, check if the key (category) existed.
                If yes, then take the minimum and change the offer
                If no, push the key and value into map
        */

        const diffCategory = new Map();

        //loop thorugh every Offer
        for(eachOffer of data)
        {
            //take the category
            const category = eachOffer["category"];

            //take the id
            const id = eachOffer["id"];

            //take the distance 
            const merchantArray = eachOffer["merchants"];
            const merchant = merchantArray[0];
            const distance = merchant["distance"];


            //initallize the key ( id and distance)
            const value = {"id": id,
                    "d": distance};

            //check if the map already had category
            if(diffCategory.get(category))
            {
                //if yes, take the minimum distance
                if(diffCategory.get(category)["d"] > distance)
                {
                    diffCategory.set(category, value);
                }
            }
            //if the map does not have the category
            else
            {
                diffCategory.set(category, value);
            }
        }
        //now we have the map with unique categories and closet distance with id
        //send data in the map

        var diffCategoryFilter = [];
        diffCategory.forEach( (value, key) =>{
            for(eachOffer of data)
            {
                if(eachOffer["id"] == value["id"])
                    diffCategoryFilter.push(eachOffer);
            }
        })
            
        data = diffCategoryFilter;
        /*
            Requirement: choose only 2 closet offers in dataset
            Make the array with array[0] is key and array[1] is value.
            Sort the array with distance then return the first two values of an array

            !!: the IDs are unique so the keys in the array are also unique
            Since the diffCategory Map has the unique category with the distance in value, copy that to the sortDistance array
        */
        const sortDistance = [];
        
        //copy the previous map to the map with key is id and value is distance
        diffCategory.forEach( (value) => {
            sortDistance.push([value["id"], value["d"]])
        });

        //sort the array with distance
        sortDistance.sort( (a, b) => {
            a[1] - b[1]
        });

        //take only first two value (sort Distance is already sort -> 2 smallest distance)
        const twoSmallestDist = sortDistance.slice(0, 2)
        
        //find the suitable Offer in data
        const twoSmallestDistanceFilter = [];
        twoSmallestDist.forEach(element => {
            for(eachOffer of data)
            {
                if(eachOffer["id"] == element[0])
                {   
                    twoSmallestDistanceFilter.push(eachOffer);
                }
            }
        })

        data = twoSmallestDistanceFilter;

        //reform the data
        var finalData = {...datas};
        finalData["offers"] = data;
  
        //response for the website
        console.log(finalData);
        res.send(finalData);
    }
    catch (error){
        console.log(error);
        throw error;
    }
}


/*
    We can also make function for each filter => code easy to maintainable and clear.
*/

module.exports = {getAvailableDate};