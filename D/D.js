'use strict';
//
/**
 * Возвращает новый emitter
 * @returns {Object}
 */
function getEmitter() {
	let waitingList = [];
    return {
        /**
         * Подписаться на событие
         * @param {String} event
         * @param {Object} context
         * @param {Function} handler
         */
        on: function (event, context, handler) {
            if (!(event in waitingList)) {
				waitingList[event] = [];
			}
			waitingList[event].push({context, handler});
			return this;
        },
 
        /**
         * Отписаться от события
         * @param {String} event
         * @param {Object} context
         */
        off: function (event, context) {
			Object.keys(waitingList).filter(eve => eve.startsWith(`${event}.`) || eve === event).forEach ( 
				eve => waitingList[eve] = waitingList[eve].filter(ev2 => ev2.context !== context)
			);
			
			return this;
        },
 
        /**
         * Уведомить о событии
         * @param {String} event
         */
        emit: function (event) {
			
			//console.log(event) ;
			let parseEvent = [];
			let index = event.lastIndexOf('.');
			
			parseEvent.push(event);
			
			while (index != -1) {
				event = event.substr(0, index);
				//console.log(event);
				parseEvent.push(event);
				index = event.lastIndexOf('.');
			}

			

			//console.log(parseEvent);
			//console.log(waitingList);

			parseEvent.forEach(eve => {
				if (eve in waitingList) {
					waitingList[eve].forEach(st => {
						st.handler.call(st.context);
					});
				}
			});
			return this;
        },
 
        /**
         * Подписаться на событие с ограничением по количеству полученных уведомлений
         * @star
         * @param {String} event
         * @param {Object} context
         * @param {Function} handler
         * @param {Number} times – сколько раз получить уведомление
         */
        several: function (event, context, handler, times) {
			let newHandler = handler;
			let counter = 0;
			if (times > 0) {
				newHandler = function() {
					if (counter < times) {
						handler.call(context);
						counter++;
					}
				}
			}
			this.on(event, context, newHandler);
			return this;
        },
 
        /**
         * Подписаться на событие с ограничением по частоте получения уведомлений
         * @star
         * @param {String} event
         * @param {Object} context
         * @param {Function} handler
         * @param {Number} frequency – как часто уведомлять
         */
        through: function (event, context, handler, frequency)		{
			let newHandler = handler;
			let counter = 0;
			if (frequency > 0) {
				newHandler = function() {
					if (counter % frequency === 0) {
						handler.call(context);
					}
					counter++;
					
				}
			}
			
			this.on(event, context, newHandler);
			return this;
        }
    };
}
 
module.exports = {
    getEmitter
};