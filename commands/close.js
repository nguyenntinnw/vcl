const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const config = require('../config');
const { validateChannel } = require('../utils/channelValidator');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('close')
    .setDescription('Close a specific form and show maintenance message')
    .addStringOption(option =>
      option.setName('type')
        .setDescription('The type to close (verify, reports, unban, ticket)')
        .setRequired(true)
        .addChoices(
          { name: 'Verify', value: 'verify' },
          { name: 'Reports', value: 'reports' },
          { name: 'Unban', value: 'unban' },
          { name: 'Ticket', value: 'ticket' }
        )
    ),

  async execute(interaction) {
    console.log(`[COMMAND] /close ${interaction.options.getString('type')} triggered`);
    const type = interaction.options.getString('type');

    if (!validateChannel(interaction.channelId)) {
      return interaction.reply({ content: '❌ You cannot use this command in this channel.', ephemeral: true });
    }

    const channelId = config.channels[type];
    const channel = await interaction.guild.channels.fetch(channelId).catch(() => null);
    if (!channel) return interaction.reply({ content: '❌ Target channel not found.', ephemeral: true });

    const messages = await channel.messages.fetch({ limit: 10 }).catch(() => null);
    if (messages) messages.forEach(msg => msg.delete().catch(() => {}));

    const embed = new EmbedBuilder()
      .setTitle('🛠️ Maintenance Mode')
      .setDescription(`${type.charAt(0).toUpperCase() + type.slice(1)} is currently under maintenance. Please wait.`)
      .setColor(0x808080);

    await channel.send({ embeds: [embed] });
    return interaction.reply({ content: `✅ ${type} closed with maintenance notice.`, ephemeral: true });
  },
};
