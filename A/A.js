'use strict';
 
/**
 * Складывает два целых числа
 * @param {Number} a Первое целое
 * @param {Number} b Второе целое
 * @throws {TypeError} Когда в аргументы переданы не числа
 * @returns {Number} Сумма аргументов
 */
function abProblem(a, b) {
    if (typeof a !== 'number') {
        throw new TypeError(`abProblem a is not number ${a}`);
    }
      
    if (typeof b !== 'number') {
        throw new TypeError(`abProblem b is not number ${b}`);
    }

    return a + b;

}
 
/**
 * Определяет век по году
 * @param {Number} year Год, целое положительное число
 * @throws {TypeError} Когда в качестве года передано не число
 * @throws {RangeError} Когда год – отрицательное значение
 * @returns {Number} Век, полученный из года
 */
function centuryByYearProblem(year) {
    // Ваше решение
    if (typeof year !== 'number') {
        throw new TypeError(`centuryByYearProblem year is not number ${year}`);
    }
    if (year < 0) {
        throw new RangeError(`centuryByYearProblem year must be more than or equal than a zero`);
    }
    return Math.ceil(year / 100);
}
 
/**
 * Переводит цвет из формата HEX в формат RGB
 * @param {String} hexColor Цвет в формате HEX, например, '#FFFFFF'
 * @throws {TypeError} Когда цвет передан не строкой
 * @throws {RangeError} Когда значения цвета выходят за пределы допустимых
 * @returns {String} Цвет в формате RGB, например, '(255, 255, 255)'
 */
function colorsProblem(hexColor) {
    // Ваше решение
    if (typeof hexColor !== 'string') {
        throw new TypeError(`hexColot must be a String`);
    }
    let r,g,b;
    if (hexColor.match(/^#[a-fA-F\d]{6}$/)) {
        r = parseInt(hexColor.substr(1, 2), 16);
        g = parseInt(hexColor.substr(3, 2), 16);
        b = parseInt(hexColor.substr(5, 2), 16);
      } else if (hexColor.match(/^#[a-fA-F\d]{3}$/))  {
        r = parseInt(hexColor.substr(1, 1).repeat(2), 16);
        g = parseInt(hexColor.substr(2, 1).repeat(2), 16);
        b = parseInt(hexColor.substr(3, 1).repeat(2), 16);
      } else {throw new RangeError('hexColor must fit it range from #000000 to #FFFFFF')}


    return `(${r}, ${g}, ${b})`;
}
 
/**
 * Находит n-ое число Фибоначчи
 * @param {Number} n Положение числа в ряде Фибоначчи
 * @throws {TypeError} Когда в качестве положения в ряде передано не число
 * @throws {RangeError} Когда положение в ряде не является целым положительным числом
 * @returns {Number} Число Фибоначчи, находящееся на n-ой позиции
 */
function fibonacciProblem(n) {
    // Ваше решение
    if (typeof n !== 'number') {
        throw new TypeError(`fibonacciProblem: n is not a Number`);
    }
    if (n <= 0 || n !== Math.floor(n)) {
        throw new RangeError('fibonacciProblem: n must be positive not float number');
    }

    
    if (n === 1) {return 1;}
    if (n === 2) {return 1;}
    let a1 = 1;
    let a2 = 1;
    let end = n - 2; 
    let a;
    for (let i = 1; i <= end; i++) {
        a = a1 + a2 ;
        a2 = a1;
        a1 = a;
    }
    return a;
}

 
/**
 * Транспонирует матрицу
 * @param {(Any[])[]} matrix Матрица размерности MxN
 * @throws {TypeError} Когда в функцию передаётся не двумерный массив
 * @returns {(Any[])[]} Транспонированная матрица размера NxM
 */
function matrixProblem(matrix) {
    // Ваше решение
    
    if (!Array.isArray(matrix) || !matrix.every(Array.isArray) ) {
        throw new TypeError(`matrixProblem : matrix must be Array tipe`);
    }
    
    let m = matrix.length, n = matrix[0].length, matrixNew = [];
    for (let i = 0; i < n; i++) { 
        matrixNew[i] = [];
        for (let j = 0; j < m; j++) 
            matrixNew[i][j] = matrix[j][i];
    }
    return matrixNew;
    
}
 
/**
 * Переводит число в другую систему счисления
 * @param {Number} n Число для перевода в другую систему счисления
 * @param {Number} targetNs Система счисления, в которую нужно перевести (Число от 2 до 36)
 * @throws {TypeError} Когда переданы аргументы некорректного типа
 * @throws {RangeError} Когда система счисления выходит за пределы значений [2, 36]
 * @returns {String} Число n в системе счисления targetNs
 */
function numberSystemProblem(n, targetNs) {
    // Ваше решение
    if (typeof n !== 'number' || typeof targetNs !== 'number') {
        throw new TypeError(`numberSystemProblem: n and targetNs must have Numer type`);
    }

    if ( targetNs !== Math.floor(targetNs) || targetNs < 2 || targetNs > 36) {
        throw new RangeError('numberSystemProblem: targetNs must be integer form 2 to 36');
    }
    
    let arr = [];
    
    return n.toString(targetNs);
}
 
/**
 * Проверяет соответствие телефонного номера формату
 * @param {String} phoneNumber Номер телефона в формате '8–800–xxx–xx–xx'
 * @throws {TypeError} Когда в качестве аргумента передаётся не строка
 * @returns {Boolean} Если соответствует формату, то true, а иначе false
 */
function phoneProblem(phoneNumber) {
    // Ваше решение
    if (typeof phoneNumber !== 'string') {
        throw new TypeError('phoneProblem: phoneNumber must be a String')
    }
    
    let reg = /^8-800-\d{3}-\d{2}-\d{2}$/;
    return reg.test(phoneNumber);
}
 
/**
 * Определяет количество улыбающихся смайликов в строке
 * @param {String} text Строка в которой производится поиск
 * @throws {TypeError} Когда в качестве аргумента передаётся не строка
 * @returns {Number} Количество улыбающихся смайликов в строке
 */
function smilesProblem(text) {
    // Ваше решение
    if (typeof text !== 'string') {
        throw new TypeError('smilesProblem: text must be a String')
    }

    let reg = /:-\)|\(-:/g;
    return (text.match(reg) || []).length;
}
 
/**
 * Определяет победителя в игре "Крестики-нолики"
 * Тестами гарантируются корректные аргументы.
 * @param {(('x' | 'o')[])[]} field Игровое поле 3x3 завершённой игры
 * @returns {'x' | 'o' | 'draw'} Результат игры
 */
function ticTacToeProblem(field) {
    // Ваше решение
    function checkLine(line) {
        if (line[0] === line[1] && line[1] === line[2])
            return true;
        else 
            return false;
    }

    for (let i = 0; i < 3; i++) {
        if (checkLine(field[i])) {
           return field[i][0];
        }
    }
    if (field[0][0] === field[1][1] && field[1][1] === field[2][2])
        return field[1][1];
    
    if (field[2][0] === field[1][1] && field[1][1] === field[0][2])
        return field[1][1];

    let matrixNew = matrixProblem(field);

    for (let i = 0; i < 3; i++) {
        if (checkLine(matrixNew[i])) {
           return matrixNew[i][0];
        }
    }
    return 'draw';

}
 
module.exports = {
    abProblem,
    centuryByYearProblem,
    colorsProblem,
    fibonacciProblem,
    matrixProblem,
    numberSystemProblem,
    phoneProblem,
    smilesProblem,
    ticTacToeProblem
};