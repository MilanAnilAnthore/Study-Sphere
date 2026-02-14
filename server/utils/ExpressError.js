class ExpressError extends Error {
    constructor(message, { status = 500, code = "INTERNAL_ERROR", details = null } = {}) {
        super(message);
        this.name = this.constructor.name;
        this.status = status;
        this.code = code;
        this.details = details;
    }
}

module.exports = ExpressError