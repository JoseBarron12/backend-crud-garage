class CustomFoundError extends Error {
    constructor(message) {
        super(message);
        this.statusCode = 400;
        this.name = "FoundError"
    }
}

module.exports = {
    CustomFoundError
}