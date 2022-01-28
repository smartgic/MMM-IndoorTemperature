/* 
 * Magic Mirror
 * Module: MMM-IndoorTemperature
 *
 * By Smart'Gic
 * MIT Licensed.
 */
const NodeHelper = require('node_helper');
const fetch = require('node-fetch');

module.exports = NodeHelper.create({

  userAgent: 'MMM-IndoorTemperature',

  start() {
    console.log('MMM-IndoorTemperature helper started');
  },

  getMetrics() {
    let parent = this;
    const bme280Url = this.config.abstractApiUrl + '/v1/environmental/' + this.config.sensor
    fetch(bme280Url, {
      headers: {'Accept': 'application/json',
                'Content-Type': 'application/json',
                'User-Agent': this.userAgent}
    })
      .then(res => res.json())
      .then(json => parent.sendSocketNotification('DATA_BME280', json));
  },

  socketNotificationReceived(notification, payload) {
    if (notification == 'GET_BME280') {
      this.getMetrics();
    } else if (notification == 'INIT_BME280') {
      this.config = payload;
    }
  }
});
