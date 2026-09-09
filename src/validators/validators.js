function valid(data, lang){
    // console.log(data);

    if (data == undefined) {
        throw new Error("MISSING_TEXT_FIELD");
    } else if (data.length == 0) {
        throw new Error("EMPTY_TEXT");
    } else if (typeof(data) != "string") {
        throw new Error("NOT_STRING_TEXT");
    } else if (data.length > 10000) {
        throw new Error("TOO_LONG_TEXT")
    } else if (lang == undefined || lang.length == 0) {
        throw new Error("MISSING_LANGUAGE");
    }else if (lang != "en"){
        throw new Error ("UNSUPPORTED_LANGUAGE");
    }
    // while (1 != 0) {

    // }
}


module.exports = {valid}