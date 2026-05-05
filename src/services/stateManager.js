const logger = require('../utils/logger');

class StateManager {
  constructor() {
    this.userStates = new Map(); // In-memory storage
    this.tempData = new Map();   // Temporary data during flows
    
    // Cleanup old states every hour
    setInterval(() => this.cleanup(), 60 * 60 * 1000);
  }

  setState(phoneNumber, state) {
    this.userStates.set(phoneNumber, {
      state,
      timestamp: Date.now()
    });
    logger.debug(`State set for ${phoneNumber}: ${state}`);
  }

  getState(phoneNumber) {
    const userState = this.userStates.get(phoneNumber);
    return userState ? userState.state : 'idle';
  }

  clearState(phoneNumber) {
    this.userStates.delete(phoneNumber);
    this.tempData.delete(phoneNumber);
    logger.debug(`State cleared for ${phoneNumber}`);
  }

  setTempData(phoneNumber, key, value) {
    if (!this.tempData.has(phoneNumber)) {
      this.tempData.set(phoneNumber, {});
    }
    this.tempData.get(phoneNumber)[key] = value;
  }

  getTempData(phoneNumber, key) {
    const data = this.tempData.get(phoneNumber);
    return data ? data[key] : null;
  }

  getAllTempData(phoneNumber) {
    return this.tempData.get(phoneNumber) || {};
  }

  cleanup() {
    const now = Date.now();
    const timeout = 30 * 60 * 1000; // 30 minutes
    
    for (const [phone, data] of this.userStates.entries()) {
      if (now - data.timestamp > timeout) {
        this.userStates.delete(phone);
        this.tempData.delete(phone);
      }
    }
    
    logger.debug('State cleanup completed');
  }
}

module.exports = new StateManager();