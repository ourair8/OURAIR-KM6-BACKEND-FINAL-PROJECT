class ErrorWithStatusCode extends Error {
    constructor(message, statusCode) {
        super(message);
        this.name = this.constructor.name;
        this.statusCode = statusCode;
        Object.setPrototypeOf(this, new.target.prototype);
    }
}


const handleError = (err, res) => {
    if (err instanceof ErrorWithStatusCode) {
        return res.status(err.statusCode).json({ message: err.message });
    } else {
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

module.exports = { ErrorWithStatusCode, handleError };