module.exports = {
    JWT_SECRET: 'this is super secret',
    oauth:{
        google:{
            clientID: "510465647938-dv862rsa4r8rmaarteqp6rpakq4t0eqo.apps.googleusercontent.com",
            clientSecret:"vA6cSFbARbn6vq02FsdQdxcq"
        },
        facebook:{
            clientID: "292243491522685",
            clientSecret: 'b99d8f3aa0cd6ac7008c307d3339ea57'
        }
    }
}

//On credentials and client secret, use process.env.FB_CLIENT_SECRET