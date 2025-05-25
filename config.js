require("dotenv").config();

module.exports = {
  runChannel: process.env.RUN_COMMAND_CHANNEL,
  channels: {
    verify: process.env.VERIFY_CHANNEL,
    reports: process.env.REPORTS_CHANNEL,
    unban: process.env.UNBAN_CHANNEL,
    ticket: process.env.TICKET_CHANNEL,
  },
  adminChannels: {
    reports: process.env.REPORTS_ADMIN_CHANNEL,
    unban: process.env.UNBAN_ADMIN_CHANNEL,
    ticket: process.env.TICKET_ADMIN_CHANNEL,
  },
  roles: {
    verify: process.env.VERIFY_ROLE_ID,
  },
};
