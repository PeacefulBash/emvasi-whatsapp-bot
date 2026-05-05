const { google } = require('googleapis');
const logger = require('../utils/logger');

class GoogleSheetsService {
  constructor() {
    this.auth = null;
    this.sheets = null;
    this.spreadsheetId = process.env.GOOGLE_SHEETS_ID;
    this.initialize();
  }

  initialize() {
    try {
      const privateKey = process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n');
      
      this.auth = new google.auth.GoogleAuth({
        credentials: {
          client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
          private_key: privateKey
        },
        scopes: ['https://www.googleapis.com/auth/spreadsheets']
      });

      this.sheets = google.sheets({ version: 'v4', auth: this.auth });
      logger.info('✅ Google Sheets service initialized');
    } catch (error) {
      logger.error('Failed to initialize Google Sheets:', error);
    }
  }

  async findUser(phoneNumber) {
    try {
      const response = await this.sheets.spreadsheets.values.get({
        spreadsheetId: this.spreadsheetId,
        range: 'Users!A:K'
      });

      const rows = response.data.values || [];
      const userRow = rows.find(row => row[0] === phoneNumber);
      
      if (!userRow) return null;

      return {
        phone: userRow[0],
        firstName: userRow[1],
        fullName: userRow[2],
        email: userRow[3],
        registered: userRow[4] === 'TRUE',
        subscriptionPlan: userRow[5],
        billingCycle: userRow[6],
        subscriptionStatus: userRow[7],
        visitCount: parseInt(userRow[8]) || 0,
        lastVisit: userRow[9],
        reminderOptIn: userRow[10] === 'TRUE'
      };
    } catch (error) {
      logger.error('Error finding user:', error);
      return null;
    }
  }

  async createOrUpdateUser(userData) {
    try {
      const existingUser = await this.findUser(userData.phone);
      
      if (existingUser) {
        // Update existing user
        const updateData = [
          userData.phone,
          userData.firstName || existingUser.firstName,
          userData.fullName || existingUser.fullName,
          userData.email || existingUser.email,
          userData.registered !== undefined ? userData.registered.toString().toUpperCase() : existingUser.registered.toString().toUpperCase(),
          userData.subscriptionPlan || existingUser.subscriptionPlan || '',
          userData.billingCycle || existingUser.billingCycle || '',
          userData.subscriptionStatus || existingUser.subscriptionStatus || '',
          (existingUser.visitCount + 1).toString(),
          new Date().toISOString(),
          (userData.reminderOptIn !== undefined ? userData.reminderOptIn : existingUser.reminderOptIn).toString().toUpperCase()
        ];

        const response = await this.sheets.spreadsheets.values.get({
          spreadsheetId: this.spreadsheetId,
          range: 'Users!A:A'
        });

        const rows = response.data.values || [];
        const rowIndex = rows.findIndex(row => row[0] === userData.phone);

        if (rowIndex >= 0) {
          await this.sheets.spreadsheets.values.update({
            spreadsheetId: this.spreadsheetId,
            range: `Users!A${rowIndex + 1}:K${rowIndex + 1}`,
            valueInputOption: 'RAW',
            resource: { values: [updateData] }
          });
        }
      } else {
        // Create new user
        const newUserData = [
          userData.phone,
          userData.firstName || '',
          userData.fullName || '',
          userData.email || '',
          (userData.registered || false).toString().toUpperCase(),
          userData.subscriptionPlan || '',
          userData.billingCycle || '',
          userData.subscriptionStatus || '',
          '1',
          new Date().toISOString(),
          (userData.reminderOptIn || false).toString().toUpperCase()
        ];

        await this.sheets.spreadsheets.values.append({
          spreadsheetId: this.spreadsheetId,
          range: 'Users!A:K',
          valueInputOption: 'RAW',
          resource: { values: [newUserData] }
        });
      }

      logger.info(`User ${userData.phone} saved/updated successfully`);
      return true;
    } catch (error) {
      logger.error('Error saving user:', error);
      return false;
    }
  }

  async getUpcomingEvents() {
    try {
      const response = await this.sheets.spreadsheets.values.get({
        spreadsheetId: this.spreadsheetId,
        range: 'Events!A:E'
      });

      const rows = response.data.values || [];
      const today = new Date();
      
      return rows.slice(1) // Skip header
        .map(row => ({
          id: row[0],
          title: row[1],
          date: new Date(row[2]),
          description: row[3],
          reminderSent: row[4] === 'TRUE'
        }))
        .filter(event => event.date >= today)
        .sort((a, b) => a.date - b.date);
    } catch (error) {
      logger.error('Error fetching events:', error);
      return [];
    }
  }

  async savePollResponse(phoneNumber, pollId, response) {
    try {
      await this.sheets.spreadsheets.values.append({
        spreadsheetId: this.spreadsheetId,
        range: 'Polls!D:D',
        valueInputOption: 'RAW',
        resource: {
          values: [[`${phoneNumber}:${response}`]]
        }
      });
      
      logger.info(`Poll response saved for user ${phoneNumber}`);
      return true;
    } catch (error) {
      logger.error('Error saving poll response:', error);
      return false;
    }
  }

  async getAllSubscribedUsers() {
    try {
      const response = await this.sheets.spreadsheets.values.get({
        spreadsheetId: this.spreadsheetId,
        range: 'Users!A:K'
      });

      const rows = response.data.values || [];
      return rows.slice(1)
        .filter(row => row[7] === 'active')
        .map(row => row[0]); // Return phone numbers only
    } catch (error) {
      logger.error('Error fetching subscribed users:', error);
      return [];
    }
  }

  async logBroadcast(message, recipientCount) {
    try {
      await this.sheets.spreadsheets.values.append({
        spreadsheetId: this.spreadsheetId,
        range: 'Broadcasts!A:D',
        valueInputOption: 'RAW',
        resource: {
          values: [[
            Date.now().toString(),
            message,
            new Date().toISOString(),
            recipientCount.toString()
          ]]
        }
      });
      
      return true;
    } catch (error) {
      logger.error('Error logging broadcast:', error);
      return false;
    }
  }
}

module.exports = new GoogleSheetsService();