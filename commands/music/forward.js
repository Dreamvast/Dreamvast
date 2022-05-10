const { MessageEmbed } = require('discord.js');
const formatDuration = require('../../structures/formatduration.js')
const logger = require('../../plugins/logger')

const fastForwardNum = 10;

module.exports = { 
    config: {
        name: "forward",
        aliases: [],
        description: "Forward timestamp in the song!",
        accessableby: "Member",
        category: "music",
        usage: "<seconds>"
    },

    run: async (client, message, args) => {
        const PREFIX = client.prefix;
        const msg = await message.channel.send(`**Loading please wait...**`);
           
        const player = client.manager.get(message.guild.id);
        if (!player) return msg.edit("No song/s currently playing within this guild.");
        const { channel } = message.member.voice;
        if (!channel || message.member.voice.channel !== message.guild.me.voice.channel) return msg.edit("You need to be in a same/voice channel.")

        const song = player.queue.current;
        const CurrentDuration = formatDuration(player.position);

        if (args[0] && !isNaN(args[0])) {
            if((player.position + args[0] * 1000) < song.duration) {
                player.seek(player.position + args[0] * 1000);
                
                const forward1 = new MessageEmbed()
                .setDescription("\`⏭\` | **Forward to:** "+ `\`${CurrentDuration}\``)
                .setColor('#000001');

                msg.edit({ content: " ", embeds: [forward1] });
                    logger.info(`[Command/Logger] Forward used by ${message.author.tag} from ${message.guild.name}`);

            } else { 
                return msg.edit('Cannot forward beyond the song\'s duration.'); 
            }
        }
        else if (args[0] && isNaN(args[0])) { 
            return message.reply(`Invalid argument, must be a number.\nCorrect Usage: \`${PREFIX}forward <seconds>\``); 
        }

        if (!args[0]) {
            if((player.position + fastForwardNum * 1000) < song.duration) {
                player.seek(player.position + fastForwardNum * 1000);
                
                const forward2 = new MessageEmbed()
                .setDescription("\`⏭\` | **Forward to:** "+ `\`${CurrentDuration}\``)
                .setColor('#000001');

                msg.edit({ content: " ", embeds: [forward2] });
                    logger.info(`[Command/Logger] Forward used by ${message.author.tag} from ${message.guild.name}`);

            } else {
                return msg.edit('Cannot forward beyond the song\'s duration.');
            }
        }
    }
};