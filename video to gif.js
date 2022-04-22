const { MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');
const fs = require('fs')
const axios = require("axios")
const { exec } = require('child_process');

module.exports = async function(msg, args) {
  const criacanal = new MessageActionRow()
  .addComponents(
     new MessageButton()
       .setCustomId('canalzinho')
       .setLabel('🤒')
       .setStyle('SUCCESS')
 );
  const ajudame = new MessageEmbed()
  .setDescription('Seja bem vindo ao nosso sistema de edição de GIFs.\nCaso ocorra alguma falha durante a utilização, procure um dono.')
  .addFields(
        { name: 'Funcionamento do Compressor:', value: `
    ・Deixe o seu arquivo de um tamanho ideal para usar no Discord;
    ・Inicie a compressão através do botão Iniciar compressão;
    ・Logo em seguida, siga todos os passos para não ter problemas.` 
     }
    )
  let m = await msg.guild.channels.cache.get('877321318326997103').send({ embeds: [ajudame], components: [criacanal] })
  const collector = m.createMessageComponentCollector({ componentType: 'BUTTON'});

    collector.on('collect', async i => {
      if(i.customId === "canalzinho"){
        var categoria = '877325625592000543'
        const ch = await msg.guild.channels.create(i.user.username, { parent: `${categoria}`, permissionOverwrites: [ { id: msg.guild.id, deny: ['VIEW_CHANNEL'], }, { id: msg.author.id, allow: ['VIEW_CHANNEL', 'SEND_MESSAGES'], }, ] })
        let reacaoc = await ch.send(`<@!${i.user.id}>` + '\nManda link ou o arquivo .MP4')

        const filter = m => m.author.id == i.user.id;
       const collector = ch.createMessageCollector({ filter });
       collector.on('collect', async m => {
        const attachment = m.attachments.first().attachment
        const nome = m.attachments.first().name
            if (!m.attachments.first().attachment.includes(".mp4")) return msg.reply("sua puta isso n e um video desculpa pela grosseria");

            await exec(`del video0.gif`, () => console.log(`Deletado.`));

            const stream = fs.createWriteStream(`./${nome}`)
            const res = await axios({
                method: "get",
                url: attachment,
                responseType: 'stream'
            })
            reacaoc.edit('Baixado.')
            await res.data.pipe(stream)
            reacaoc.edit('Convertendo.')
            await exec(`ffmpeg -i ${nome} -filter_complex "[0:v] fps=15,scale=w=720:h=-1,split [a][b];[a] palettegen=stats_mode=single [p];[b][p] paletteuse=new=1" video0.gif`, async (error) => {
                if(error) {
                  console.log('erro' + error.message);
                  return;
                }
                reacaoc.edit('Enviando.')
                try {
                    await ch.send(`Aqui está ${msg.author}`)
                    await ch.send({
                      files: [`./video0.gif`]
                    });
                    await exec(`del /f /a ${nome}`, () => console.log(`Deletado.`));
                    setTimeout(function(){ 
                      ch.delete()
                     }, 50000);
                } catch (e) {
                    setTimeout(function(){ 
                      ch.delete()
                     }, 50000);
                   await exec(`del /f /a ${nome}`, () => console.log(`Deletado.`));
                }
           });
      })
        
      }
      
    })
  }