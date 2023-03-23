
const audioFileRegex = /(\d+)(?:\.mp3$|-(\d+)\.mp3$)/;
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
    const match = str.match(audioFileRegex);
    if (match[2]) {
        var _q2 = parseInt(match[2])
        return _q2 <= 31 ? `${_q2}` : match[1] + '-' + match[2];
    } else {
        return `${parseInt(match[1])}`
    }
}
export {
    buidQuery, getPaginator,
    removeUndefined, getUrlfromUploadRespond,
    getErrorMessage,
    isImageUrl,
    isAudioUrl,
    getQuestionName
}