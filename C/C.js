'use strict';
const isExtraTaskSolved = true;

const MIN_IN_HOUR = 60;
const HOUR_IN_DAY = 24;
const MIN_IN_DAY = HOUR_IN_DAY * MIN_IN_HOUR;
const THREE_DAYS = 3 * MIN_IN_DAY;
const DAYS = { ПН: 0, ВТ: 1, СР: 2, ЧТ: 3, ПТ: 4, СБ: 5, ВС: 6 };
const WEEK = ['ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ', 'ВС'];

/**
	* @param {Object} schedule Расписание Банды
	* @param {number} duration Время на ограбление в минутах
	* @param {Object} workingHours Время работы банка
	* @param {string} workingHours.from Время открытия, например, "10:00+5"
	* @param {string} workingHours.to Время закрытия, например, "18:00+5"
	* @returns {Object}
*/
function getAppropriateMoment(schedule, duration, workingHours) {
	let time = []; 
	const spaces = [];
	let currSpace = 0;
	
	let tmp = workingHours.from.split('+');
	let bankTZ = tmp[1];
	bankTZ = bankTZ - 1 + 1;
	
	
	let workingHours3 = ['ПН','ВТ','СР'].map(addTime);

	function addTime(el) {
		return {from: el +  ' ' + workingHours.from, to: el + ' ' + workingHours.to};
	}


	for (let wh3 of Object.values(workingHours3)) {
		let [from, to] = Object.values(wh3).map(parseDate);
		for (let minute = from; minute < to; minute++) {	
			time[minute] = true;
		}	
	}	


	for (const spaces of Object.values(schedule)) {
		for (const space of spaces) {
			let	[from, to] = Object.values(space).map(parseDate);
			for (let minute = from; minute < to; minute++) {
				time[minute] = false;
			}
		}
	}

	let curMin = 0;

	while (curMin < THREE_DAYS) {
		let currSpace = 0;
		while (time[currSpace + curMin]) {
			currSpace++;
			if (currSpace + curMin > THREE_DAYS) {
				break;
			}
			if (currSpace === duration) {
				spaces.push(curMin);
				curMin += 29;
				break;
			}
		}
		curMin++;
	}

	function parseDate(date) {
		const day = date.substr(0, 2);
		const minuts = toMinuts(date.substr(3));
		return minuts + DAYS[day] * HOUR_IN_DAY * MIN_IN_HOUR;
	}


	function toMinuts(date) {
		const timeZone = Number.parseInt(date.substr(6));
		const minuts = Number.parseInt(date.substr(3, 2));
		const hours = Number.parseInt(date.substr(0, 2));
		return (hours - timeZone + bankTZ) * MIN_IN_HOUR + minuts;
	}

	return {
		/**
		* Найдено ли время
		* @returns {boolean}
		*/
		exists() {
			return spaces.length !== 0;
		},

		/**
		* Возвращает отформатированную строку с часами
		* для ограбления во временной зоне банка
		*
		* @param {string} template
		* @returns {string}
		*
		* @example
		* ```js
		* getAppropriateMoment(...).format('Начинаем в %HH:%MM (%DD)') // => Начинаем в 14:59 (СР)
		* ```
		*/
		format(template) {
			if (spaces.length === 0) {
				return '';
			}

			const beg = spaces[currSpace];
			const minuts = beg % MIN_IN_HOUR;
			const hours = Math.floor(beg / MIN_IN_HOUR) % HOUR_IN_DAY;
			const numberOfDay = Math.floor(beg / MIN_IN_DAY);

			return template
				.replace(/%DD/, WEEK[numberOfDay])
				.replace(/%HH/, String(hours).padStart(2, '0'))
				.replace(/%MM/, String(minuts).padStart(2, '0'));
		},

		/**
		* Попробовать найти часы для ограбления позже [*]
		* @note Не забудь при реализации выставить флаг `isExtraTaskSolved`
		* @returns {boolean}
		*/
		tryLater() {
			if (currSpace + 1 < spaces.length) {
				currSpace++;
				return true;
			}
			return false;
		}
	};
}

module.exports = {
	getAppropriateMoment,
	isExtraTaskSolved
};
