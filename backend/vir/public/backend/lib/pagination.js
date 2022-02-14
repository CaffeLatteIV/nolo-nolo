class Paginator {
    constructor ({docs, limit, page}){
        if(page < 0)
            throw new Error('page must be a positive integer')

        if(limit < 0)
            throw new Error('limit must be a positive integer')
        else if(limit == 0)
            this.docs = docs;
        else
            this.docs = docs.slice((page - 1) * limit, page * limit);

        this.totalDocs = docs.length;
        this.limit = limit;
        this.totalPages = this.limit > 0 ? Math.ceil(this.totalDocs / this.limit) || 1 : null;

        if(page > this.totalPages)
            this.page = (page % this.totalPages) + 1;
        else
            this.page = page;
       
        this.pagingCounter = (this.page - 1) * this.limit + 1;
        
        this.hasPrevPage = false;
        this.hasNextPage = false;
        this.prevPage = null;
        this.nextPage = null;

        

        if(this.page > 1){
            this.hasPrevPage = true;
            this.prevPage = this.page - 1;
        }

        if(this.page < this.totalPages){
            this.hasNextPage = true;
            this.nextPage = this.page + 1;
        }

        if(this.limit == 0){
            this.totalPages = 1;
            this.page = 1;
            this.pagingCounter = 1;
            this.prevPage = null;
            this.nextPage = null;
            this.hasPrevPage = false;
            this.hasNextPage = false;
        }
    }
}

function parsePaginatorQuery(query, len){
    let limit;
    let page;
    if(!query.limit){
        limit = len;
        page = 1;
    } else{
        limit = parseInt(query.limit);
        page = query.page ? parseInt(query.page) : 1;
    }

    return {limit, page};
}

function paginate(docs, query){
    const {limit, page} = parsePaginatorQuery(query, docs.length)
    return new Paginator({docs: docs, limit: limit, page: page})
}

module.exports.paginate = paginate;