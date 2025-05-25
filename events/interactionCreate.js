const { Events } = require('discord.js');

module.exports = {
  name: Events.InteractionCreate,
  async execute(interaction, client) {
    if (interaction.isChatInputCommand()) {
      console.log(`[COMMAND] ${interaction.commandName} triggered`);
      const command = client.commands.get(interaction.commandName);
      if (!command) return;

      try {
        await command.execute(interaction);
      } catch (error) {
        console.error(`[ERROR] executing ${interaction.commandName}:`, error);
        if (interaction.replied || interaction.deferred) {
          await interaction.followUp({ content: '❌ There was an error executing this command.', ephemeral: true });
        } else {
          await interaction.reply({ content: '❌ There was an error executing this command.', ephemeral: true });
        }
      }
    }

    // Handle button interactions (placeholder)
    if (interaction.isButton()) {
      console.log(`[BUTTON] ${interaction.customId} clicked`);

      if (interaction.customId === 'open_verify_modal') {
        // Open modal to enter verification code (tớ sẽ code sau nếu cậu cần)
        return interaction.reply({ content: '🔧 Modal not implemented yet.', ephemeral: true });
      }

      if (interaction.customId === 'open_report_modal') {
        return interaction.reply({ content: '🔧 Report modal not implemented yet.', ephemeral: true });
      }

      if (interaction.customId === 'open_unban_modal') {
        return interaction.reply({ content: '🔧 Unban modal not implemented yet.', ephemeral: true });
      }

      if (interaction.customId === 'create_ticket') {
        return interaction.reply({ content: '🎫 Ticket system not implemented yet.', ephemeral: true });
      }
    }
  },
};
