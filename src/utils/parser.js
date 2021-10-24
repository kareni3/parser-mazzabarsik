export default class Parser {
    parse(src, regex) {
        if (
            regex[0] !== '/' ||
            (regex.match(/\//g) || []).length < 2
        ) {
            alert("Regex string Error")
        }
        let res = null
        const i = regex.lastIndexOf('/')
        try{
            res = src.match(new RegExp(regex.slice(1, i), regex.slice(i + 1)))
        } catch (error) {
            alert('Regex string Error')
        }
        return res
    }
}