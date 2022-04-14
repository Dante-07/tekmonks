const request = require("request-promise");
const cheerio = require("cheerio");

const url = "https://time.com/";

var express = require('express');

var app = express();
var PORT = process.env.PORT || 4000;

let data = [];
async function heavyComputation() {
    const response = await request({
        uri: url,
        headers: {
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
            "Accept-Encoding": "gzip, deflate, br",
            "Accept-Language": "en-US,en;q=0.9",
        },
        gzip: true,

    });
    let $ = cheerio.load(response);
    data = $(".latest-stories__item").text().trim().split("\n");
    let arr=   $(".latest-stories__item a").text().replace(/\s\s+/g,'\n').split("\n");
    let obj=[];
    for(let i=0;i<6;i++){

        obj.push({title:arr[i+1],url:url+$(".latest-stories__item a")[''+i].attribs.href});
        
    }
    console.log(obj)
    console.log("data updated successfully");
    return obj;

};

app.get("/getTimeStories", async (req, res) => {
    data =await heavyComputation();
    res.json((data));
    res.end();
});

app.listen(PORT, function (err) {
    console.log("Server listening on Port", PORT);
})
