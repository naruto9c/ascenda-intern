/*
    This test file contains the customer check-in date and the answers for the tests.
    All of the test store in the dates and answers array.
*/

const dates = [];
const answers = [];

let date1 = "2019-12-25"
let answer1 = {
    "offers": [
        {
            "id": 1,
            "title": "Offer 1",
            "description": "Offer 1 description",
            "category": 1,
            "merchants": [
                {
                    "id": 1,
                    "name": "Offer1 Merchant1",
                    "distance": 0.5
                }
            ],
            "valid_to": "2020-02-01"
        },
        {
            "id": 3,
            "title": "Offer 3",
            "description": "Offer 3 description",
            "category": 2,
            "merchants": [
                {
                    "id": 3,
                    "name": "Offer3 Merchant1",
                    "distance": 0.8
                }
            ],
            "valid_to": "2020-01-01"
        }
    ]
}

answers.push(answer1);
dates.push(date1);

let date2 =  "2019-12-30"
let answer2 = {
    "offers": [
        {
            "id": 1,
            "title": "Offer 1",
            "description": "Offer 1 description",
            "category": 1,
            "merchants": [
                {
                    "id": 1,
                    "name": "Offer1 Merchant1",
                    "distance": 0.5
                }
            ],
            "valid_to": "2020-02-01"
        },
        {
            "id": 5,
            "title": "Offer 5",
            "description": "Offer 5 description",
            "category": 4,
            "merchants": [
                {
                    "id": 6,
                    "name": "Offer5 Merchant1",
                    "distance": 1.2
                }
            ],
            "valid_to": "2020-05-01"
        }
    ]
};

dates.push(date2);
answers.push(answer2);

let date3 = "2020-06-01";
let answer3 = {
    offers: []
};

dates.push(date3);
answers.push(answer3);

let date4 = "1000-1-1" //wrong format
let answer4 = "wrong customer date format!";

dates.push(date4);
answers.push(answer4);

module.exports = {dates, answers}