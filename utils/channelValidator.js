const config = require('../config');

function validateChannel(channelId) {
  return channelId === config.runChannel;
}

module.exports = {
  validateChannel,
};
