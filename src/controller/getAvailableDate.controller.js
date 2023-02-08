
//helper function for getAvailableDate API in index.controller

function categoryFilter(data, category)
{
    //filter out the category
    return data.filter(eachOffer => eachOffer["category"] != category);
}

function validDateFilter(data, customerCheckinDate)
{
    //the validation date must be 5 days after comapre to customer checkin date
    var requireDate = customerCheckinDate;
    requireDate.setDate(customerCheckinDate.getDate() + 5);

    const validDate = []
    for(eachOffer of data)
    {
        const date = new Date(eachOffer["valid_to"]);
        if( date.getTime() >= requireDate.getTime())
        {
            validDate.push(eachOffer);
        }
    }

    return validDate;
}

function eachOfferOneMerchantFilter(data)
{
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

    return MerchantFilter;
}

function diffCategoryFilter(data)
{
        /*  
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

    var diffCategoryFinal = [];
    diffCategory.forEach( (value, key) =>{
        for(eachOffer of data)
        {
            if(eachOffer["id"] == value["id"])
                diffCategoryFinal.push(eachOffer);
        }
    });

    return diffCategoryFinal;
}

function twoSmallestDistanceFilter(data)
{

    /*
    Make the array with array[0] is key and array[1] is value.
    Sort the array with distance then return the first two values of an array

    !!: the IDs are unique so the keys in the array are also unique
    Since the diffCategory Map has the unique category with the distance in value, copy that to the sortDistance array
    */
    const sortDistance = [];

    //copy the previous map to the map with key is id and value is distance

    for(eachOffer of data)
    {
        //take the id
        const id = eachOffer["id"];

        //take the distance 
        const merchantArray = eachOffer["merchants"];
        const merchant = merchantArray[0];
        const distance = merchant["distance"];

        sortDistance.push([id, distance]);
    }

    //sort the array with distance
    sortDistance.sort( (a, b) => {
        a[1] - b[1]
    });

    //take only first two value (sort Distance is already sort -> 2 smallest distance)
    const twoSmallestDist = sortDistance.slice(0, 2)
    
    //find the suitable Offer in data
    const twoSmallestDistance = [];
    twoSmallestDist.forEach(element => {
        for(eachOffer of data)
        {
            if(eachOffer["id"] == element[0])
            {   
                twoSmallestDistance.push(eachOffer);
            }
        }
    });

    return twoSmallestDistance;
    
}

module.exports = {
    categoryFilter,
    validDateFilter,
    eachOfferOneMerchantFilter,
    diffCategoryFilter,
    twoSmallestDistanceFilter,
};