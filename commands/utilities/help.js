const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const { readdirSync } = require("fs");
const { stripIndents } = require("common-tags");
const logger = require('../../plugins/logger')
const GPrefix = require('../../plugins/guildConfig.js');

module.exports = {
    config: {
        name: "help",
        aliases: ["h", "halp", "commands"],
        usage: "(command)",
        category: "utilities",
        description: "Displays all commands that the bot has.",
        accessableby: "Members"
    },
    run: async (client, message, args) => {
        const PREFIX = client.prefix;
        let PREFIX1 = client.prefix;
        const GuildPrefix = await GPrefix.findOne({ guild: message.guild.id });
    	if(GuildPrefix && GuildPrefix.prefix) PREFIX1 = GuildPrefix.prefix;
        
        const embed = new MessageEmbed()
            .setColor(client.color)
            .setAuthor({ name: `${message.guild.me.displayName} Help Command!`, iconURL: message.guild.iconURL({ dynamic: true })})
            .setThumbnail(client.user.displayAvatarURL({ dynamic: true, size: 2048 }));

        if(!args[0]) {
            const categories = readdirSync("./commands/")

            embed.setDescription(`The bot prefix is: **${PREFIX}** \n ${message.guild.name} prefix is: **${PREFIX1}**`)
            embed.setFooter({ text: `© ${message.guild.me.displayName} | Total Commands: ${client.commands.size}`, iconURL: client.user.displayAvatarURL({ dynamic: true })});

            categories.forEach(category => {
                const dir = client.commands.filter(c => c.config.category === category)
                const capitalise = category.slice(0, 1).toUpperCase() + category.slice(1)
                try {
                    embed.addField(`❯ ${capitalise} [${dir.size}]:`, dir.map(c => `\`${c.config.name}\``).join(" "))
                } catch(e) {
                    console.log(e)
                }
            })
            const row1 = new MessageActionRow()
                .addComponents(
                    new MessageButton()
                        .setLabel("Support Server")
                        .setStyle("LINK")
                        .setURL("https://discord.com/invite/xHvsCMjnhU")
                )

            return message.channel.send({ embeds: [embed], components: [row1] })
        } else {
            let command = client.commands.get(client.aliases.get(args[0].toLowerCase()) || args[0].toLowerCase())
            if(!command) return message.channel.send({ embeds: [embed.setTitle("Invalid Command.").setDescription(`Do \`${PREFIX}help\` for the list of the commands.`)] })
            command = command.config

            embed.setDescription(stripIndents`The client's prefix is: \`${PREFIX}\`
			${message.guild.name} prefix is: \`${PREFIX1}\`
            **Command:** ${command.name.slice(0, 1).toUpperCase() + command.name.slice(1)}
            **Description:** ${command.description || "No Description provided."}
            **Usage:** ${command.usage ? `\`${PREFIX}${command.name} ${command.usage}\`` : "No Usage"}
            **Accessible by:** ${command.accessableby || "Members"}
            **Aliases:** ${command.aliases ? command.aliases.join(", ") : "None."}`)
            
            const row2 = new MessageActionRow()
                .addComponents(
                    new MessageButton()
                        .setLabel("Support Server")
                        .setStyle("LINK")
                        .setURL("https://discord.com/invite/xHvsCMjnhU")
                )

            return message.channel.send({ embeds: [embed], components: [row2] })
        }
    }
}