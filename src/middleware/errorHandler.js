class ErrorWithStatusCode extends Error {
    statusCode

    constructor(message, statusCode) {
        super(message);
        this.name = this.constructor.name;
        this.statusCode = statusCode;
        Object.setPrototypeOf(this, new.target.prototype);
    }
}

module.exports = { ErrorWithStatusCode };