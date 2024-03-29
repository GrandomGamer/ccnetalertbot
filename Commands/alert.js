  
const request = require("request");
const Discord = require("discord.js");
const Trello = require('trello');
var trello = new Trello(process.env.TKEY_1,process.env.TKEY_2)
var board = 'CcPX6dI1';
module.exports.run = async (bot, message, args) => {
    let lists = await trello.getListsOnBoard(board).then((lists2) =>{
        return lists2;
    })
    let ts = []
    for(var l in lists){
        ts.push(lists[l]['name'])
    }
    let page = 0;
    let alertchan = bot.channels.get('675909769185198098')
    let severity = 'Green'
    let distarr = []
    let peparr = []
    let hbs = []
    let mlts = []
    let p = 0
    for(var x in lists){
        p++;
        let cards = await trello.getCardsOnList(lists[x]['id']).then((cards2) => {
            let coord = cards2[2]['desc']
            hbs.push(coord)
            if(p === lists.length){
                return hbs;
            }
        })
    }
    for(var x in lists){
        p++;
        let cards = await trello.getCardsOnList(lists[x]['id']).then((cards2) => {
            let people = cards2[1]['desc'].split(',')
            for(var p in people){
                mlts.push(people[p])
            }
            if(p === lists.length){
                return mlts;
            }
        })
    }          
    request("https://map.ccnetmc.com/standalone/dynmap_earth.json?", (error, response, body) => {
        var z = 0
        const data = JSON.parse(body);
        let arr = data.players
        for(var i in arr){
            let account = arr[i].account
            let nickname = arr[i].name
            let x1 = arr[i].x
            let z1 = arr[i].z
            for(var z in hbs){
                let colist = hbs[z].split(' ')
                let x2 = parseInt(colist[0])
                let z2 = parseInt(colist[1])
                let dist = Math.sqrt((x1-x2) ** 2 + (z1-z2) ** 2)
                if((dist <= 300) && (!mlts.includes(account))){
                    let w = 0;
                    dist = Math.round(dist)
                    if (dist <=75 && severity === 'Green'){
                        severity = 'Red'
                    }
                    else if (dist <=150 && severity === 'Green'){
                        severity = 'Orange'
                    }
                    else if (dist <=300 && severity === 'Green'){
                        severity = 'Yellow'
                    }
                    distarr.push([account,nickname,dist,z])
                }
            }
        }
        if(distarr.length >= 1){
            if (severity == 'Red'){
                alertchan.send(`-=-=-= Severity: Red =-=-=-\n<@&675909681931354139>`)
                send()
            }
            else if(severity == 'Orange'){
                alertchan.send(`-=-=-= Severity: Orange =-=-=-`)
                send()
            }
            else if(severity == 'Yellow'){
                alertchan.send(`-=-=-= Severity: Yellow =-=-=-`)
                send()
            }
            //Embed and Other
            function send(){
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
                    let emtown = ts[distarr[num-1][3]]
                    var people = new Discord.RichEmbed()
                    .setTitle('List of People')
                    .setFooter('Page '.concat(num, ' of ', distarr.length))
                    .setDescription('-----------------------------------------------------------')
                    .setColor(5301186)
                    .setThumbnail("https://pbs.twimg.com/media/CmOsJDmWEAAHW2b.jpg")
                    .addField('Name:', distarr[num-1][0], true)
                    .addField('Nickname:', distarr[num-1][1], true)
                    .addField('Distance:', distarr[num-1][2], true)
                    .addField('Town:', emtown, true)
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
                        if (page === 1) return;
                        page--;
                        newEmbed(page, r)
                    });
                    
                    msg.delete(59*1000)
                });
            }
        }
    });

}

module.exports.help = {
    name: "alert"
}
