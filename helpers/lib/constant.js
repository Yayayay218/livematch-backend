module.exports = {
//    Define Matches Status
    UNPUBLISHED: 0,
    POSTPONED: 1,
    UPCOMING: 2,
    LIVE: 3,

    DEV_OPTS: {
        cert: "keys/dev/dev_cert.pem",
        key: "keys/dev/dev_key.pem",
        production: false,
    },

    PRD_OPTS: {
        cert: "keys/product/prod_cert.pem",
        key: "keys/product/prod_key.pem",
        production: false,
    },
    SECRET_KEY: 'peWseTYsjSLDzZBFYhJb2ouZUxPMAHbR'
};