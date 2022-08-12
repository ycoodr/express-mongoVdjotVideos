if(process.env.NODE_ENV === 'production'){
    module.exports = {mongoURI: 'mongodb+srv://yan:yan@cluster0.zgzwcby.mongodb.net/vdjot-prod'}
} else {
    module.exports = {mongoURI: 'mongodb://localhost/vidjot-dev'}
}