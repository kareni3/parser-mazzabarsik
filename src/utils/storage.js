/*global chrome*/

const storage = {
    set: async (key, value) => {
        return new Promise((resolve) => {
            chrome.storage.local.set({ [key]: value }, resolve)
        })
    },
    get: async (key) => {
        return new Promise((resolve) => {
            chrome.storage.local.get([key], (result) => {
                resolve(result ? result[key] : null)
            })
        })
    }
}

export default storage