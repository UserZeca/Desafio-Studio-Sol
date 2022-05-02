const maxRomanNumber = require('./script.js');

module.exports =  {
    Mutation: {

        search: (_, args) => {

            let buffer = maxRomanNumber(args.text);

            const data = {

                number: buffer.number,
                value: buffer.value

            }

            return data;

        }
    }
};
