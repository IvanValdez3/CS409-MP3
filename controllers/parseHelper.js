function parseHelper(request) {
    // This helper function will serve for
    // ": In addition, the API has the following JSON encoded query string parameters for the GET requests to the users and tasks endpoints."

    // While it's possible to simply do it in the controller get calls since we will use it in both tasks and users, we can simply
    // Truncate code and not have to check each param

    //Essentially we're converting strings to actual objects

    // 1. where 2. sort 3. select 4. skip 5. limit 6. count
    //Useful links:
    //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/parse
    //https://www.tutscoder.com/post/nodejs-filtering-sorting-pagination

    // query will define which document to fetch
    let query = {};
    try {
        query = request.query.where ? JSON.parse(request.query.where) : {};
    } catch (e) {
        query = {};
    }
   
    // options will define how to fetch the document
    let sort = {};
    try {
        sort = request.query.sort ? JSON.parse(request.query.sort) : {};
    } catch (e) {
        sort = {};
    }

    let select = '';
    try {
        select = request.query.select ? JSON.parse(request.query.select) : '';
    } catch (e) {
        select = '';
    }

    const query_options = {
        sort,
        select,
        skip: request.query.skip ? parseInt(request.query.skip, 10) : 0,
        limit: request.query.limit ? parseInt(request.query.limit, 10) : 100,
    };

    const count = request.query.count === 'true';

    return { query, query_options, count };
}

module.exports = { parseHelper };
