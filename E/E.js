'use strict';

const MALE = 'male';
const FEMALE ='female';

function isFilter(object) {
	return object instanceof Filter;
}


function comparator(fs, sn) {
	/*
	console.log('comparator');
	console.log(fs);
	console.log(sn);
	*/
    if (fs.stage !== sn.stage) {
        return fs.stage > sn.stage ? 1 : -1;
    } else
		 return fs.friend.name > sn.friend.name ? 1 : -1;
}


function avaFriends(friends) {
	let used = [];
	let queue = [];
	let frs = new Map();
	let l = 0;
	friends.forEach(friend => {
		frs[friend.name] = friend;
		if (friend.best) {
			queue.push({
				friend: friend,
				stage: 1
			});
			
			used[friend.name] = true;
			l++;
		} 
	});
	//console.log(queue);
	let k = 0 ;
	while(k < l) {
		
		/*
		console.log(queue[k]);
		console.log(queue[k].name);
		console.log(frs[queue[k].name].friends);
		*/
		queue[k].friend.friends.forEach( friendOfFriend => {
			
			//console.log(friendOfFriend);
			if (!used[friendOfFriend]) {
				used[friendOfFriend] = true;
				l++;				
				queue.push({
					friend: frs[friendOfFriend],
					stage: queue[k].stage + 1
				});
			}
		});
		k++;
	}
	//console.log(queue);
	return queue;
	
}

/**
 * Итератор по друзьям
 * @constructor
 * @param {Object[]} friends
 * @param {Filter} filter
 */
function Iterator(friends, filter) {
	if (!isFilter(filter)) {
		throw new TypeError('Parameter filter have to be Filter\'s type');
	}
	
	this._ans = avaFriends(friends)
        .filter(avaFriend => avaFriend.stage > 0 && filter.apply(avaFriend.friend)).sort(comparator); 
    this._curI = 0;
}
 
Iterator.prototype.done = function () {
	return this._curI === this._ans.length;
};

Iterator.prototype.next = function () {
	return this.done() ? null : this._ans[this._curI++].friend;
};
 
/**
 * Итератор по друзям с ограничением по кругу
 * @extends Iterator
 * @constructor
 * @param {Object[]} friends
 * @param {Filter} filter
 * @param {Number} maxLevel – максимальный круг друзей
 */
function LimitedIterator(friends, filter, maxLevel) {
	Iterator.call(this, friends, filter);

    this._ans = this._ans.filter(avaFriend => avaFriend.stage <= maxLevel);
}

LimitedIterator.prototype = Object.create(Iterator.prototype);
 
/**
 * Фильтр друзей
 * @constructor
 */
 
function Filter() {}

Filter.prototype.apply = friend => Boolean(friend);


/**
 * Фильтр друзей
 * @extends Filter
 * @constructor
 */
function MaleFilter() {}

MaleFilter.prototype = Object.create(Filter.prototype, {
  constructor: { value: MaleFilter },
  apply: { value: person => person.gender === MALE }
});

 
/**
 * Фильтр друзей-девушек
 * @extends Filter
 * @constructor
 */
 
 function FemaleFilter() {}

FemaleFilter.prototype = Object.create(Filter.prototype, {
  constructor: { value: FemaleFilter },
  apply: { value: person => person.gender === FEMALE }
});



exports.Iterator = Iterator;
exports.LimitedIterator = LimitedIterator;
 
exports.Filter = Filter;
exports.MaleFilter = MaleFilter;
exports.FemaleFilter = FemaleFilter;