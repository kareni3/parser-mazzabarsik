/*global chrome*/

export async function getCurrentTab() {
    let tab = null
    try {
        tab = await new Promise((resolve) => {
            chrome.tabs.getSelected(t => {
                resolve(t)
            })
        })
    } catch (error) {
        console.log('Error')
        console.log(error)
    }
    return tab;
}

function getDomContent() {
    return document.body.innerHTML;
}

export async function getTabDOMString(tabID, code = getDomContent.toString()) {
    let DOM = null
    try {
        DOM = await new Promise((resolve) => {
            chrome.tabs.executeScript(tabID, { code: `(${code})()` }, (res) => {
                resolve(res[0])
            });
        })
    } catch (error) {
        console.log('Error')
        console.log(error)
    }
    return DOM;
}