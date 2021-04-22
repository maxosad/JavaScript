'use strict';
 
/**
 * Телефонная книга
 */
const phoneBook = new Map();
const PHONE_LEN = 11;
/**
 * Вызывайте эту функцию, если есть синтаксическая ошибка в запросе
 * @param {number} lineNumber – номер строки с ошибкой
 * @param {number} charNumber – номер символа, с которого запрос стал ошибочным
 */
function syntaxError(lineNumber, charNumber) {
    throw new Error(`SyntaxError: Unexpected token at ${lineNumber + 1}:${charNumber + 1}`);
}

/**
 * Выполнение запроса на языке pbQL
 * @param {string} query
 * @returns {string[]} - строки с результатами запроса
 */
function run(query) {
    const qLines = query.split(';');

    const res = [];
    qLines.forEach((qLine, line) => {
		
		
        if (line === qLines.length - 1 && qLine === '') {
            return;
        }
		

        const spaceIndex = qLine.indexOf(' ');
        if (spaceIndex === -1) {
            syntaxError(line, 0);
        }


        const commandString = qLine.substring(0, spaceIndex);
		switch (commandString) {
			case "Создай" : 
				Create(qLine, line); 
				break;
			case "Удали" : 
				Erase(qLine, line); 
				break;
			case "Добавь" : 
				Add(qLine, line); 
				break;
			case "Покажи" : 
				Show(qLine, line, res); 
				break;
			default: 
				syntaxError(line, 0);
		};
		
		
        if (line === qLines.length - 1) {
            syntaxError(line, qLine.length);
        }
		
		
    })

    return res;
}

function Show(qLine, line, res) {

    let indexCurr = 7;
    const cells = [];
	
	
    while (true){
		
        if (qLine.substr(indexCurr,6) ==="почты ") {
			
            cells.push("mails");
            indexCurr+=6;
			
        } else if (qLine.substr(indexCurr, 9) === "телефоны ") {
            cells.push ("phones");
            indexCurr += 9;
			
        } else if (qLine.substr(indexCurr, 4) ==="имя ") {
            cells.push ("name");
            indexCurr += 4;
			
        } else{
            syntaxError(line,indexCurr) ;
			
        }

        if(qLine.substr(indexCurr, 2) === "и ") {
            indexCurr += 2;
        } else if(qLine.substr(indexCurr, 4) === "для ") {
            indexCurr += 4;
            break;
        } else {
            syntaxError(line, indexCurr);
        }
    }

    if (qLine.substr(indexCurr, 11) !== "контактов, ") {
        syntaxError(line, indexCurr);
    }
	
    indexCurr += 11;
	
    if (qLine.substr(indexCurr, 4) !== "где ") {
        syntaxError(line, indexCurr);
    }
	
    indexCurr += 4;
	
    if (qLine.substr(indexCurr, 5) !== "есть ") {
        syntaxError(line, indexCurr);
    }
	
    indexCurr+=5 ;
    const request = qLine.substr(indexCurr);
	
    if (request.length === 0) {
        return;
    }

    phoneBook.forEach((value, key) => {
		
        if (provZap(value, key, request)) {
            let personcells = "";
			
            for (let cell of cells) {
                if (cell === "name") {
                    personcells += key + ';';
					
                } else if (cell === "phones") {
					
                    let phones = "";
					
                    for (let phone of value.phones) {
                       
						phones += "+7 (" + phone.substring(0, 3) + ") " + phone.substr(3, 3) + 
									'-' + phone.substr(6, 2) + '-' + phone.substr(8, 2) + ',';
						
                    }
                    personcells +=`${phones.slice(0, -1)};`
                   
                } else {
					
                    let mails = "";
                    for (let mail of value.mails) {
                        mails += mail + ',';
                    }
					
					personcells += `${mails.slice(0, -1)};`
                  
                }
            }
          
            res.push(personcells.slice(0, -1));
        }
    });
}


function Add(qLine, line) {
    const qLinePhones = [], qLineMails = [];
    let i = parserPhoneMail(qLine, line, 7, qLinePhones, qLineMails);

    const name = qLine.substr(i);
	
    if (phoneBook.has(name)) {
        const person = phoneBook.get(name);
		
        for (let phone of qLinePhones) {
			
            if (!person.phones.includes(phone)) {
				
                person.phones.push(phone);
				
            }
        }
		
        for (let mail of qLineMails) {
            if (!person.mails.includes(mail)) {
                person.mails.push(mail);
            }
			
        }
    }
}


function Erase(qLine, line) {
    if (qLine.substring(6, 14) === "контакт ") {
        const name = qLine.substr(14);
        phoneBook.delete(name);
    } else if (qLine.substring(6, 16) === "контакты, ") {
        if (qLine.substring(16, 20) !== "где ") {
            syntaxError(line, 16);
        } else if (qLine.substring(20, 25) !== "есть ") {
            syntaxError(line, 20);
        }

        const request = qLine.substr(25);
        if (request.length === 0) {
            return;
        }

        phoneBook.forEach((value, key) => {
            if (provZap(value, key, request)) {
                phoneBook.delete(key);
            }
        });
    } else {
        const qLineMails = [], qLinePhones = [];
        let i = parserPhoneMail(qLine, line, 6, qLinePhones, qLineMails);

        const name = qLine.substr(i);
        if (phoneBook.has(name)) {
			
            const person = phoneBook.get(name);
			
            person.phones = person.phones.filter((phone) => !qLinePhones.includes(phone));
            person.mails = person.mails.filter((mail) => !qLineMails.includes(mail));
        }
    }
}


function provZap(value, key, request) {
    if (key.includes(request)) {
        return true;
    }
    for (let mail of value.mails) {
        if (mail.includes(request)) {
            return true;
        }
    }
	 for (let phone of value.phones) {
        if (phone.includes(request)) {
            return true;
        }
    }
}

function parserPhoneMail(qLine, line, start, qLinePhones, qLineMails) {
    let i = start;

    const phoneRegex = /^\d{10} $/, mailRegex = /[\S]+/;
	let mail, phone;
	
    while (true) {
        if (qLine.substr(i, 8) === "телефон ") {
            i += 8;

            phone = qLine.substr(i, PHONE_LEN);
            if (!phoneRegex.test(phone)) {
                syntaxError(line, i);
            }
            qLinePhones.push(phone);
            i += PHONE_LEN;
        } else if (qLine.substr(i, 6) === "почту ") {
            i += 6;

            mail = qLine.substring(i, qLine.indexOf(' ', i));
			if (!mailRegex.test(mail)) {
                syntaxError(line, i);
            }
            qLineMails.push(mail);
            i += mail.length + 1;
        } else {
            syntaxError(line, i);
        }

        if (qLine.substr(i, 2) === "и ") {
            i += 2;
			
        } else if (qLine.substr(i, 4) === "для ") {
            i += 4;
			
            break;
        } else {
			
            syntaxError(line, i);
        }
    }

    if (qLine.substr(i, 9) !== "контакта ") {
        syntaxError(line, i);
    }
	
    i += 9;
    return i;
}

function Create(qLine, line) {
    if (qLine.substring(7, 15) !== "контакт ") {
        syntaxError(line, 7);
    }
    const name = qLine.substr(15);
    if (!phoneBook.has(name)) {
        phoneBook.set(name, {
            phones: [],
            mails: []
        });
    }
}





 
module.exports = { phoneBook, run };