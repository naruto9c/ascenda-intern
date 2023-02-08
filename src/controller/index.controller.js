const axios = require('axios');
const {URL} = require('../database/database')
const {
    categoryFilter,
    validDateFilter,
    eachOfferOneMerchantFilter,
    diffCategoryFilter,
    twoSmallestDistanceFilter,
} = require('./getAvailableDate.controller');

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
        const offers = {...datas}["offers"];
        data = offers;

        //store data after each filter        
        var data =[];

        /*  Category:
            Resturant - 1
            Retail - 2
            Hotel - 3
            Activity - 4

            Requirement: Filter out the category 3
        */
        const RESTAURANT_CATEGORY = 1;
        const RETAIL_CATEGORY = 2;
        const HOTEL_CATEGORY = 3;
        const ACTIVITY_CATEGORY = 4;

        data = categoryFilter(offers, HOTEL_CATEGORY);

        //change customre date from string to Date object
        const customerCheckinDate = new Date(customerDate);

        //Requirement: checking date validation
        data = validDateFilter(data, customerCheckinDate);

        //Requirement: one offer can have multiple merchants, choose the closet merchant in each offer.
        data = eachOfferOneMerchantFilter(data);

        //Requirement: data return in different category, if data has the same category, choose the closet one.   
        data = diffCategoryFilter(data);

        //Requirement: choose only 2 closet offers in dataset
        data = twoSmallestDistanceFilter(data);

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


module.exports = {getAvailableDate};