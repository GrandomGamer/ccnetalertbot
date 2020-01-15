const request = require("request");
const Discord = require("discord.js");

module.exports.run = async (bot, message, args) => {
    let page = 0;
    let alertchan = bot.channels.get('666838078350163978')
    let hbs = [
        [-12872,-3767],
        [-13448,-3479]
    ];
    let distarr = []
    let severity = 'Green'
    request("https://map.ccnetmc.com/standalone/dynmap_earth.json?", (error, response, body) => {
        const data = JSON.parse(body);
        let arr = data.players
        for(var i in arr){
            let x1 = arr[i].x
            let z1 = arr[i].z
            for(var z in hbs){
                let dist = Math.sqrt((x1-hbs[z][0]) ** 2 + (z1-hbs[z][1]) ** 2)
                if (dist <=50){
                    severity = 'Red'
                    arraypush()
                }
                else if (dist <=150){
                    severity = 'Orange'
                    arraypush()
                }
                else if (dist <=300){
                    severity = 'Yellow'
                    arraypush()
                }
                function arraypush() {
                    if (dist <= 300 && z == 0){
                        arrpush = [Math.round(dist),'Torreon',arr[i].account,arr[i].name]
                        distarr.push(arrpush)
                    }
                    else if(dist <= 300 && z == 1){
                        arrpush = [Math.round(dist),'Nuevo',arr[i].account,arr[i].name]
                        distarr.push(arrpush)
                    }
                }
            }
        }
        for(var m in distarr){
            console.log(distarr)
        }
        if(distarr.length >= 1){
            if (severity == 'Red'){
                alertchan.send(`-=-=-= Severity: Red =-=-=-\n@everyone`)
            }
            else if(severity == 'Orange'){
                alertchan.send(`-=-=-= Severity: Orange =-=-=-\n @Grandom @Denfish`)
            }
            else if(severity == 'Yellow'){
                alertchan.send(`-=-=-= Severity: Yellow =-=-=-`)
            }
            //Embed and Other
            const peoples = new Discord.RichEmbed({
                "title": "Report of Players",
                "description": "-----------------------------------------------------------",
                "url": "",
                "color": 5301186,
                "footer": {
                    "icon_url": "https://pbs.twimg.com/media/CmOsJDmWEAAHW2b.jpg",
                    "text": "Click the right arrow to view players!"
                  },
                "thumbnail": {
                  "url": "https://pbs.twimg.com/media/CmOsJDmWEAAHW2b.jpg"
                },
        
              });
        
        
            function newEmbed(num, msg) {
                var people = new Discord.RichEmbed()
                .setTitle('List of People')
                .setFooter('Page '.concat(num, ' of ', distarr.length))
                .setDescription('-----------------------------------------------------------')
                .setColor(5301186)
                .setThumbnail("https://pbs.twimg.com/media/CmOsJDmWEAAHW2b.jpg")
                .addField('Name:', distarr[num-1][2], true)
                .addField('Nickname:', distarr[num-1][3], true)
                .addField('Distance:', distarr[num-1][0], true)
                .addField('Town:', distarr[num-1][1], true)
                msg.message.edit({embed: people})
            }
            alertchan.send({embed: peoples}).then(async msg => {
                
                await msg.react("⬅");
                await msg.react("➡");
        
                const pageupFilter = (reaction, user) => reaction.emoji.name === "➡" && !user.bot;
                const pagedownFilter = (reaction, user) => reaction.emoji.name === "⬅" && !user.bot;
        
                const pageup = msg.createReactionCollector(pageupFilter, {time : 59*1000});
                const pagedown = msg.createReactionCollector(pagedownFilter, {time : 59*1000});
                pageup.on('collect', r => {
                    if (page === distarr.length) return;
                    page++;
                    newEmbed(page, r)
                    
                });
        
                pagedown.on('collect', r => {
                    if (page === 2 || page === 1) return;
                    page--;
                    newEmbed(page, r)
                });
        
                msg.delete(59*1000)
            });
        }
        else{
            alertchan.send(`Severity: Green :partying_face:`).then(msg.delete(59*1000))
        }
    });

}

module.exports.help = {
    name: "alert"
}
