const { Client, GatewayIntentBits } = require('discord.js');
const { joinVoiceChannel, getVoiceConnection } = require('@discordjs/voice');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

const TOKEN = process.env.DISCORD_TOKEN;

client.once('ready', () => {
    console.log(`봇 로그인 성공: ${client.user.tag}`);
});

client.on('messageCreate', async (message) => {
    if (message.author.bot) return;

    if (message.content === '!들어와') {
        const voiceChannel = message.member.voice.channel;
        if (!voiceChannel) return message.reply('먼저 음성 채널에 들어가 주세요!');

        try {
            joinVoiceChannel({
                channelId: voiceChannel.id,
                guildId: voiceChannel.guild.id,
                adapterCreator: voiceChannel.guild.voiceAdapterCreator,
                selfDeaf: true,
            });
            message.reply(`[${voiceChannel.name}] 채널에 입장하여 잠수를 시작합니다.`);
        } catch (error) {
            console.error(error);
            message.reply('입장 중 오류가 발생했습니다.');
        }
    }

    if (message.content === '!나와') {
        const connection = getVoiceConnection(message.guild.id);
        if (!connection) return message.reply('봇이 음성 채널에 들어가 있지 않습니다.');

        connection.destroy();
        message.reply('음성 채널에서 퇴장했습니다.');
    }
});

client.login(TOKEN);
