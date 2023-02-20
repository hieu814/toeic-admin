const { array } = require("prop-types");

function buidQuery(options) {
    var query = {
        query: {},
        options: {
            lean: false,
            leanWithId: true,
            offset: 0,
            page: options?.page || 1,
            limit: options?.rowsPerPage || 10,
            pagination: true,
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
    console.log(JSON.stringify(query));
    return query;

}
function getPaginator(res) {
    console.log(res?.data?.data);
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
export { buidQuery, getPaginator }