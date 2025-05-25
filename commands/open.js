const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');
const config = require('../config');
const { validateChannel } = require('../utils/channelValidator.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('open')
    .setDescription('Open a specific form or embed')
    .addStringOption(option =>
      option.setName('type')
        .setDescription('The type to open (verify, reports, unban, ticket)')
        .setRequired(true)
        .addChoices(
          { name: 'Verify', value: 'verify' },
          { name: 'Reports', value: 'reports' },
          { name: 'Unban', value: 'unban' },
          { name: 'Ticket', value: 'ticket' }
        )
    ),

  async execute(interaction) {
    console.log(`[COMMAND] /open ${interaction.options.getString('type')} triggered`);
    const type = interaction.options.getString('type');

    if (!validateChannel(interaction.channelId)) {
      return interaction.reply({ content: '❌ You cannot use this command in this channel.', flags: 64 });
    }

    const channelId = config.channels[type];
    const channel = await interaction.guild.channels.fetch(channelId).catch(() => null);
    if (!channel) return interaction.reply({ content: '❌ Target channel not found.', flags: 64 });

    const messages = await channel.messages.fetch({ limit: 10 }).catch(() => null);
    if (messages) messages.forEach(msg => msg.delete().catch(() => {}));

    const embedMap = {
      verify: new EmbedBuilder()
        .setTitle('🔒 Verify Yourself')
        .setDescription('Click the button below and enter your verification code to get verified.')
        .setColor(0x00AE86),

      reports: new EmbedBuilder()
        .setTitle('🚨 Report a Player')
        .setDescription('Click the button to report a player. If the report is valid, you may be rewarded.')
        .setColor(0xff0000),

      unban: new EmbedBuilder()
        .setTitle('🔓 Unban Request')
        .setDescription('Click the button to request unban with your explanation and evidence.')
        .setColor(0x3498db),

      ticket: new EmbedBuilder()
        .setTitle('🎫 Create a Ticket')
        .setDescription('Click the button to create a private support ticket.')
        .setColor(0x9b59b6),
    };

    if (type === 'verify') {
      const bannerUrl = process.env.VERIFY_BANNER_URL;
      if (bannerUrl && bannerUrl.startsWith('http')) {
        embedMap.verify.setImage(bannerUrl);
      }
    }

    const buttonMap = {
      verify: new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId('open_verify_modal')
          .setLabel('Verify Now')
          .setStyle(ButtonStyle.Success)
      ),
      reports: new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId('open_report_modal')
          .setLabel('Report Now')
          .setStyle(ButtonStyle.Danger)
      ),
      unban: new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId('open_unban_modal')
          .setLabel('Request Unban')
          .setStyle(ButtonStyle.Primary)
      ),
      ticket: new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId('create_ticket')
          .setLabel('Create Ticket')
          .setStyle(ButtonStyle.Secondary)
      ),
    };

    await channel.send({ embeds: [embedMap[type]], components: [buttonMap[type]] });
    return interaction.reply({ content: `✅ ${type.charAt(0).toUpperCase() + type.slice(1)} form sent.`, flags: 64 });
  },
};

