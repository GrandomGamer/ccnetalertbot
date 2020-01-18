const request = require("request");
const Discord = require("discord.js");

module.exports.run = async (bot, message, args) => {
    let sender = message.author;
    request("https://map.ccnetmc.com/standalone/dynmap_earth.json?", (error, response, body) => {
        const data = JSON.parse(body);
        let arr = data.players
        for(var i in arr){
            if ((arr[i].account.toUpperCase()) || (arr[i].nickname.toUpperCase()) == args[1]){
                sender.send(`X Coordinate: ${arr[i].x}\nY Coordinate: ${arr[i].y}\nZ Coordinate: ${arr[i].z}`)
            }
            else{
                sender.send(`Player not found! :cry:`)
            }

        }

    })
}
module.exports.help = {
    name: "lookup"
}
