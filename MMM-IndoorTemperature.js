/* 
 * Magic Mirror
 * Module: MMM-IndoorTemperature
 *
 * By Smart'Gic
 * MIT Licensed.
 */
Module.register('MMM-IndoorTemperature', {

  result: {
    metrics: 'loading metrics...'
  },

  defaults: {
    abstractApiUrl: 'http://192.168.1.66:8123',
    humiditySymbol: 'fa fa-tint',
    temperatureSymbol: 'fa fa-thermometer-half',
    pressureSymbol: 'far fa-arrow-alt-circle-up',
    altitudeSymbol: 'fas fa-water',
    interval: 60000,
    fadeSpeed: 4*1000,
    sensor: 'bme280',
    units: config.units,
  },

  start() {
    this.sendSocketNotification('INIT_BME280', this.config)
    this.getMetrics();
    this.scheduleUpdate();
  },

  scheduleUpdate() {
    setInterval(() => {
      this.getMetrics();
    }, this.config.interval);
  },

  getDom() {
		var degreeLabel = '';
    var altitudeField = '';
    var altitudeLabel = '';
    var tempfield = '';
		if (this.config.units === 'metric' || this.config.units === 'imperial') {
			degreeLabel += '&deg;';
		}
    switch (this.config.units) {
      case 'metric':
        altitudeField = 'altitude_meter';
        altitudeLabel = 'm';
        tempfield = 'temperature_c';
        degreeLabel += 'C';
        break;
      case 'imperial':
        altitudeField = 'altitude_feet';
        altitudeLabel = 'ft';
        tempfield = 'temperature_f';
        degreeLabel += 'F';
        break;
    }

    const wrapper = document.createElement('div');
    const metrics = document.createElement('div');

    if (this.result[tempfield]) {
      const altitudeSymbol = document.createElement('span');
      altitudeSymbol.classList = 'symbol symbol-altitude ' + this.config.altitudeSymbol;
      const altitude = document.createElement('span');
      altitude.classList = 'text';
      altitude.innerHTML = this.result[altitudeField].toFixed(0) + altitudeLabel;
      metrics.appendChild(altitudeSymbol);
      metrics.appendChild(altitude);

      const pressureSymbol = document.createElement('span');
      pressureSymbol.classList = 'symbol symbol-pressure ' + this.config.pressureSymbol;
      const pressure = document.createElement('span');
      pressure.classList = 'text';
      pressure.innerHTML = this.result['pressure'].toFixed(0) / 10 + 'kPa';
      metrics.appendChild(pressureSymbol);
      metrics.appendChild(pressure);

      const temperatureSymbol = document.createElement('span');
      temperatureSymbol.classList = 'symbol symbol-temperature ' + this.config.temperatureSymbol;
      const temperature = document.createElement('span');
      temperature.classList = 'text';
      temperature.innerHTML = this.result[tempfield].toFixed(1) + degreeLabel;
      metrics.appendChild(temperatureSymbol);
      metrics.appendChild(temperature);

      const humiditySymbol = document.createElement('span');
      humiditySymbol.classList = 'symbol symbol-humidity ' + this.config.humiditySymbol;
      const humidity = document.createElement('span');
      humidity.classList = 'text';
      humidity.innerHTML = this.result['humidity'].toFixed(1) + '%';
      metrics.appendChild(humiditySymbol);
      metrics.appendChild(humidity);

    }

    wrapper.appendChild(metrics);
    return wrapper;
  },

  getMetrics() {
    this.sendSocketNotification('GET_BME280');
  },

  socketNotificationReceived(notification, payload) {
    if (notification == 'DATA_BME280') {
      if (this.result != payload) {
         this.result = payload;
        this.updateDom(this.config.fadeSpeed);
      }
    }
  },

  getStyles () {
    return ['MMM-IndoorTemperature.css'];
  },

});
