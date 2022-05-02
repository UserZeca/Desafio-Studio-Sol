const {gql} = require('apollo-server');

module.exports = gql`
    
    type Query{
        search: Datas
    }
    type Datas{
        number: String,
        value: Int 

    }
    type Mutation {

        search(text: String):Datas,

    }

`;