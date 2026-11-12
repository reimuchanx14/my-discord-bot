
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

    if (message.content === '!튀어와') {
        const voiceChannel = message.member.voice.channel;
        if (!voiceChannel) {
            return message.reply('어디를 병신아 ㅋㅋ');
        }

        try {
            joinVoiceChannel({
                channelId: voiceChannel.id,
                guildId: voiceChannel.guild.id,
                adapterCreator: voiceChannel.guild.voiceAdapterCreator,
                selfDeaf: true,
            });

            message.reply(`[${voiceChannel.name}] 예아`);
        } catch (error) {
            console.error('음성 채널 입장 오류:', error);
            message.reply('입장 중 오류가 발생했습니다.');
        }
    }

    if (message.content === '!꺼져') {
        const connection = getVoiceConnection(message.guild.id);

        if (!connection) {
            return message.reply('...?');
        }

        connection.destroy();
        message.reply('알겠습니노');
    }
});

if (!TOKEN) {
    console.error('DISCORD_TOKEN 환경변수가 설정되지 않았습니다.');
    process.exit(1);
}

client.login(TOKEN).catch(error => {
    console.error('봇 로그인 실패:', error);
});
