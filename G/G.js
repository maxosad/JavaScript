'use strict';

const fetch = require('node-fetch');

const API_KEY = require('./key.json');
const ERROR_MESSAGE = "Не могу построить маршрут!";
/**
 * @typedef {object} TripItem Город, который является частью маршрута.
 * @property {number} geoid Идентификатор города
 * @property {number} day Порядковое число дня маршрута
 */

class TripBuilder {
    constructor(geoids) {
        this.geoids = geoids;
        this.wayPlan = [];
        this.maxPresent = 7;
    }

    /**
     * Метод, добавляющий условие наличия в маршруте
     * указанного количества солнечных дней
     * Согласно API Яндекс.Погоды, к солнечным дням
     * можно приравнять следующие значения `condition`:
     * * `clear`;
     * * `partly-cloudy`.
     * @param {number} daysCount количество дней
     * @returns {object} Объект планировщика маршрута
     */
    sunny(daysCount) {
        for (let i = 0; i < daysCount; i++) {
            this.wayPlan.push('s');
        }
        return this;
    }

    /**
     * Метод, добавляющий условие наличия в маршруте
     * указанного количества пасмурных дней
     * Согласно API Яндекс.Погоды, к солнечным дням
     * можно приравнять следующие значения `condition`:
     * * `cloudy`;
     * * `overcast`.
     * @param {number} daysCount количество дней
     * @returns {object} Объект планировщика маршрута
     */
    cloudy(daysCount) {
        for (let i = 0; i < daysCount; i++) {
            this.wayPlan.push('c');
        }
        return this;
    }

    /**
     * Метод, добавляющий условие максимального количества дней.
     * @param {number} daysCount количество дней
     * @returns {object} Объект планировщика маршрута
     */
    max(daysCount) {
        this.maxPresent = daysCount;
        return this;
    }

    /**
     * Метод, возвращающий Promise с планируемым маршрутом.
     * @returns {Promise<TripItem[]>} Список городов маршрута
     */
    build() {
        this.maxPresent = Math.min(this.wayPlan.length, this.maxPresent);

     return Promise.all(this.geoids.map(geoid => getWeather(geoid)))
        .then(wayItems => {

            const wayPlan = this.wayPlan, 
            allDays = this.wayPlan.length, 
            maxPresent = this.maxPresent,
			geoids = this.geoids;
			
            const answers = findWay(new Array(wayItems.length),[]);
            if (!answers) {
                throw new Error(ERROR_MESSAGE);
            }
			return answers;

            function findWay( used, curWay) {
			


				const curDay = curWay.length;

                if (curDay === allDays) {
                    return curWay;
                }

                const infStore = [];
                for (let i = 0; i < wayItems.length; ++i) {
                    if (used[i]) {
                        infStore.push({
                            days: 0,
                            city: i
                        });
                        continue;
                    }

                    let days = 0;
					let curWay1 = curWay;
                    for (let j = curDay; j < Math.min(curDay + maxPresent, allDays); ++j) {
                        if (wayItems[i][j] !== wayPlan[j]) {
                            break;
                        }
                        days++;
						curWay1 = curWay1.concat({ geoid: geoids[i], day: j + 1 });
						
                    }
				
                    infStore.push({
                        days: days,
                        city: i,
						curWay: curWay1
                    });
                }
		
                infStore.sort((a, b) => b.days - a.days);

                for (let i = 0; i < infStore.length; ++i) {
                    if (infStore[i].days === 0) {
                        continue;
                    }

                    used[infStore[i].city] = true;
                    const answers = findWay(used, infStore[i].curWay);
					
					
                    if (answers) {

                        return answers;
                    }
					
					
                    used[infStore[i].city] = false;
                }

                return null;
            }
        });
    }
}

function getWeather(geoid) {
	return fetch(`https://api.weather.yandex.ru/v2/forecast?limit=7&geoid=${geoid}&hours=false`, {

                method: 'GET',
                headers: {
                    'X-Yandex-API-Key': API_KEY.key
                }
            })
    .then(ans => ans.json())
            .then(json => json.forecasts.map(forecast => forecast.parts.day_short.condition))
            .then(sost =>
                sost.map(condition => {
                    if (condition === "clear" || condition === "partly-cloudy")
                        return 's';
                    else if (condition === "cloudy" || condition === "overcast")
                        return 'c';
                    else
                        return 'n';

                }))

}


/**
 * Фабрика для получения планировщика маршрута.
 * Принимает на вход список идентификаторов городов, а
 * возвращает планировщик маршрута по данным городам.
 *
 * @param {number[]} geoids Список идентификаторов городов
 * @returns {TripBuilder} Объект планировщика маршрута
 * @see https://yandex.ru/dev/xml/doc/dg/reference/regions-docpage/
 */
function planTrip(geoids) {
    return new TripBuilder(geoids);
}

module.exports = {
    planTrip
};
