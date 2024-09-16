function ajax(method, url, data, successCallback, errorCallback) {
    const xhr = new XMLHttpRequest();
    xhr.open(method, url, true);
    xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');

    xhr.onreadystatechange = function() {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status >= 200 && xhr.status < 300) {
                if (successCallback) {
                    successCallback(JSON.parse(xhr.responseText), xhr.status);
                }
            } else {
                if (errorCallback) {
                    errorCallback(xhr.statusText, xhr.status);
                }
            }
        }
    };

    xhr.onerror = function() {
        if (errorCallback) {
            errorCallback('Network Error', xhr.status);
        }
    };

    if (data) {
        xhr.send(JSON.stringify(data));
    } else {
        xhr.send();
    }
}
function copy(text) {
    if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(function() {
            console.log('Copied to clipboard successfully!');
        }).catch(function(err) {
            console.error('Could not copy text: ', err);
        });
    } else {
        // Fallback for browsers that do not support navigator.clipboard
        const textArea = document.createElement("textarea");
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        try {
            document.execCommand('copy');
            console.log('Copied to clipboard successfully!');
        } catch (err) {
            console.error('Could not copy text: ', err);
        }
        document.body.removeChild(textArea);
    }
}
function $id(key){
    return document.getElementById(key)
}
function clearTable(table) {
    const rowCount = table.rows.length;
    // 保留表头的清空操作
    for (let i = rowCount - 1; i > 0; i--) {
        table.deleteRow(i);
    }
}
function sleep(milliseconds) {
    const start = new Date().getTime();
    let elapsedTime = 0;
    while (elapsedTime < milliseconds) {
        elapsedTime = new Date().getTime() - start;
    }
}

