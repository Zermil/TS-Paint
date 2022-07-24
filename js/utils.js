"use strict";
function guid() {
    let result = "";
    for (let i = 0; i < 3; ++i) {
        result += (Math.random().toString(16) + "000000000").substring(2, 10);
    }
    return (result);
}
