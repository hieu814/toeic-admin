import Papa from 'papaparse';
import * as XLSX from 'xlsx';

function buidQuery(options) {
    options = removeUndefined(options)
    var query = {
        query: {},
        options: {
            lean: false,
            leanWithId: true,
            offset: 0,
            page: options?.page || 1,
            limit: options?.rowsPerPage || 10,
            pagination: true,
            // populate: 'exam',
            useEstimatedCount: false,
            useCustomCountFn: false,
            forceCountFn: false,
        },
        isCountOnly: false
    }
    if (options.searchField && Array.isArray(options.searchField) && options.search) {
        query.query =
        {
            $or: Array.from(options.searchField, (field) => {
                return JSON.parse(`{ "${field}": { "$regex": "${options.search}", "$options": "i" } }`)
            })
        }

    }
    // if (options.ids && Array.isArray(options.ids)) {
    //     query.query = { ...query, _id: { $in: options.ids } }
    // }
    if (options.populate) {
        query.options.populate = options.populate
    }
    if (options.queryField) {
        var tmp = Object.fromEntries(Object.entries(options.queryField).filter(([_, v]) => v))
        Object.assign(query.query, tmp);
    }
    console.log(query);
    return query;

}
function convertKeysToLowercase(obj) {
    const newObj = {};

    for (let key in obj) {
        newObj[key.toLowerCase()] = obj[key];
    }

    return newObj;
}
function getPaginator(res) {

    if (res?.status === "SUCCESS" && res?.data?.paginator) {
        return res.data.paginator
    }
    return {
        itemCount: 1,
        offset: 0,
        perPage: 10,
        pageCount: 0,
        currentPage: 1,
        slNo: 1,
        hasPrevPage: false,
        hasNextPage: false,
        prev: null,
        next: null
    }

}
function removeUndefined(params) {
    return Object.fromEntries(
        Object.entries(params).filter(([key, value]) => value != null)
    );
}
function getUrlfromUploadRespond(response) {
    const data = response?.data?.uploadSuccess;
    return data || []
}
function getErrorMessage(err) {
    if (err?.data?.message)
        return err.data.message
    return "Some thing wrong"
}
function isImageUrl(url) {
    return /\.(jpeg|jpg|gif|png)$/.test(url);
}

function isAudioUrl(url) {
    return /\.(mp3|wav)$/.test(url);
}
function getQuestionName(str) {
    if (!str) return ""
    var extension = str.split(".")
    const regex = new RegExp(`(\\d+)(?:\\.${extension[extension.length - 1]}$|-(\\d+)\\.${extension[extension.length - 1]}$)`);

    console.log({ regex });
    const match = str.match(regex);

    if (match[2]) {
        var _q2 = parseInt(match[2])
        return _q2 <= 31 ? `${_q2}` : match[1] + '-' + match[2];
    } else {
        return `${parseInt(match[1])}`
    }
}

function toCSV(data) {
    const headers = ['id', 'addedBy', 'type', 'group', 'label', 'transcript', 'image', 'audio', 'createdAt', 'updatedAt', 'isDeleted', 'isActive', 'updatedBy', 'question_number', 'question', 'option_A', 'option_B', 'option_C', 'option_D', 'correct_answer'];
    const rows = data.flatMap(({ id, addedBy, type, group, label, transcript, image, audio, createdAt, updatedAt, isDeleted, isActive, updatedBy, questions }) => {
        return questions.map(({ number, question, A, B, C, D, correct_answer }) => {
            return [
                id, addedBy, type, group, label, transcript, image, audio, createdAt, updatedAt, isDeleted, isActive, updatedBy, number, question, A, B, C, D, correct_answer
            ];
        });
    });
    const csvContent = [headers, ...rows].map(row => row.join(',')).join('\n');
    return csvContent;
}
const downloadCSV = (data) => {
    const csvContent = toCSV(data);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'data.csv');
    link.click();
};
function extractSubstring(inputString) {
    const regex = /([\d\-]+)(?:_p(\d+))?/;
    const matches = inputString.match(regex);
    if (matches) {
        return { group: matches[1] || matches[3], passage: parseInt(matches[2] || matches[4]), name: inputString };
    }
    return { group: null, passage: null, name: "" };
}
function convertToJson(lines) {
    var result = [];
    var headers = lines[0]
    for (var i = 1; i < lines.length; i++) {
        var obj = {};
        var currentline = lines[i];
        for (var j = 0; j < headers.length; j++) {
            obj[headers[j]] = currentline[j];
        }
        result.push(obj);
    }
    return result;

}
function parseQuestion(data) {
    const lines = data.questions.split('\n');
    const answers = data.answers.split('\n');
    var questions = [];
    var group = ""
    let currentQuestion = null;

    for (const line of lines) {
        if (/^\d+\.\s/.test(line)) {
            // This line starts a new question
            const number = parseInt(line.match(/^\d+/)[0]);
            const question = line.replace(/^\d+\.\s/, '').trim();
            currentQuestion = { number, question };
            questions.push(currentQuestion);
        } else if (currentQuestion) {
            // This line contains an answer option
            var [letter, text] = line.split(/\)\s+/);
            letter = letter.replace(/[^a-z0-9]/gi, '');
            if (["A", "B", "C", "D"].includes(letter))
                currentQuestion[letter] = (text ?? "").trim();
        }
    }
    questions = questions.sort(function (a, b) { return a.number - b.number })
    for (let i = 0; i < questions.length; i++) {

        if (i < answers.length && answers[i]) {
            var answer = answers[i].replace(/[^ABCD]/g, '');
            questions[i].correct_answer = answer
        }
    }

    if (questions.length == 0) {
        group = ""
    } else {
        group = questions.length < 2 ? `${questions[0].number}` : `${questions[0].number}-${questions[questions.length - 1].number}`
    }
    console.log({ type: data?.type || 0, group, questions, transcript: data.transcript || "" });
    return { type: data?.type || 0, group, questions, transcript: data.transcript || "" };
}
function parseExcelFile(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (event) => {
            const data = new Uint8Array(event.target.result);

            const workbook = XLSX.read(data, { type: 'array' });
            const worksheet = workbook.Sheets[workbook.SheetNames[0]];
            const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
            resolve(convertToJson(jsonData));
        };
        reader.onerror = (error) => {
            reject(error);
        };
        reader.readAsArrayBuffer(file);
    });
}
function checkUrl(url = "") {
    if (!url) return ""
    return url.includes("http") ? url : `${process.env.REACT_APP_BACKEND_URL}${url}`
}
export {
    buidQuery, getPaginator,
    removeUndefined, getUrlfromUploadRespond,
    getErrorMessage,
    isImageUrl,
    isAudioUrl,
    getQuestionName,
    parseQuestion,
    convertToJson,
    extractSubstring,
    toCSV,
    parseExcelFile,
    downloadCSV,
    convertKeysToLowercase,
    checkUrl
}