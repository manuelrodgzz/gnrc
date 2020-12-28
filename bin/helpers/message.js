const green = (text) => console.log('\x1b[32m%s\x1b[0m', text)
const yellow = (text) => console.log('\x1b[33m%s\x1b[0m', text)
const red = (text) => console.log('\x1b[31m%s\x1b[0m', text)

module.exports = {
    green,
    yellow,
    red
}