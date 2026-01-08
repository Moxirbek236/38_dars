export class InternalServerError extends Error {
    constructor(message = "Internal Server Error", status = 500) {
        super();
        this.message = message;
        this.name = "InternalServerError";
        this.status = status;
    }
}

export class BadRequestError extends Error {
    constructor(message = "Bad Request", status = 400) {
        super();
        this.message = message;
        this.name = "BadRequestError";
        this.status = status;
    }
}

export class NotFoundError extends Error {
    constructor(message = "Not Found", status = 404) {
        super();
        this.message = message;
        this.name = "NotFoundError";
        this.status = status;
    }
}

export class ForbiddenError extends Error {
    constructor(message = "Forbidden", status = 403) {
        super();
        this.message = message;
        this.name = "ForbiddenError";
        this.status = status;
    }
}