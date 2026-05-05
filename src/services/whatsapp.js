const axios = require('axios');
const logger = require('../utils/logger');

class WhatsAppService {
  constructor() {
    this.baseURL = process.env.EVOLUTION_API_URL;
    this.apiKey = process.env.EVOLUTION_API_KEY;
    this.instanceName = process.env.EVOLUTION_INSTANCE_NAME;
  }

  async sendText(to, text) {
    try {
      const response = await axios.post(
        `${this.baseURL}/message/sendText/${this.instanceName}`,
        {
          number: to,
          text: text,
          delay: 1200
        },
        {
          headers: {
            'apikey': this.apiKey,
            'Content-Type': 'application/json'
          }
        }
      );
      
      logger.info(`Message sent to ${to}: ${text.substring(0, 50)}...`);
      return response.data;
    } catch (error) {
      logger.error(`Failed to send message to ${to}:`, error.message);
      throw error;
    }
  }

  async sendButtons(to, text, buttons) {
    try {
      const response = await axios.post(
        `${this.baseURL}/message/sendButtons/${this.instanceName}`,
        {
          number: to,
          text: text,
          buttons: buttons,
          delay: 1200
        },
        {
          headers: {
            'apikey': this.apiKey,
            'Content-Type': 'application/json'
          }
        }
      );
      
      logger.info(`Buttons sent to ${to}`);
      return response.data;
    } catch (error) {
      logger.error(`Failed to send buttons to ${to}:`, error.message);
      throw error;
    }
  }

  async sendList(to, title, text, buttonText, sections) {
    try {
      const response = await axios.post(
        `${this.baseURL}/message/sendList/${this.instanceName}`,
        {
          number: to,
          title: title,
          description: text,
          buttonText: buttonText,
          sections: sections
        },
        {
          headers: {
            'apikey': this.apiKey,
            'Content-Type': 'application/json'
          }
        }
      );
      
      logger.info(`List sent to ${to}`);
      return response.data;
    } catch (error) {
      logger.error(`Failed to send list to ${to}:`, error.message);
      throw error;
    }
  }

  async sendPoll(to, question, options) {
    try {
      // Evolution API might not support native polls, send as list
      const sections = [{
        title: question,
        rows: options.map((opt, idx) => ({
          title: opt,
          rowId: `poll_opt_${idx}`
        }))
      }];

      return await this.sendList(to, '📊 Poll', question, 'Select Option', sections);
    } catch (error) {
      logger.error(`Failed to send poll to ${to}:`, error.message);
      throw error;
    }
  }

  async isConnected() {
    try {
      const response = await axios.get(
        `${this.baseURL}/instance/connectionState/${this.instanceName}`,
        {
          headers: { 'apikey': this.apiKey }
        }
      );
      
      return response.data.instance.state === 'open';
    } catch (error) {
      logger.error('Failed to check connection state:', error.message);
      return false;
    }
  }
}

module.exports = new WhatsAppService();