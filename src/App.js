import './assets/css/index.css'
import {useCallback, useEffect, useState} from "react"
import {getCurrentTab, getTabDOMString} from './utils/chrome'
import {downloadObjectAsJson} from './utils/download'
import Parser from './utils/parser'
import storage from './utils/storage'
import axios from './utils/axios'
const parser = new Parser()

function App() {
  const [inputValue, setInputValue] = useState('')
  const [toDownload, setToDownload] = useState(false)
  const [toSendOnServer, setToSendOnServer] = useState(false)
  const [url, setURL] = useState('')

  const setToStorage = useCallback(async (key, value) => {
    await storage.set(key, value)
  }, [])

  const getFromStorage = useCallback(async (key) => {
    return await storage.get(key)
  }, [])

  useEffect( () => {
    getFromStorage('toDownload').then( res => {
      if (res) {
        setToDownload(res)
      }
    })
    getFromStorage('toSendOnServer').then( res => {
      if (res) {
        setToSendOnServer(res)
      }
    })
    getFromStorage('url').then( res => {
      if (res) {
        setURL(res)
      }
    })
    getFromStorage('regex').then( res => {
      if (res) {
        setInputValue(res)
      }
    })
  }, [getFromStorage])

  const handleDownloadCheckboxEvent = useCallback((e) => {
    setToDownload(e.target.checked)
    setToStorage('toDownload', e.target.checked)
  }, [setToStorage])

  const handleSendOnServerCheckboxEvent = useCallback((e) => {
    setToSendOnServer(e.target.checked)
    setToStorage('toSendOnServer', e.target.checked)
  }, [setToStorage])

  const handleURLInput = useCallback((e) => {
    setURL(e.target.value)
    setToStorage('url', e.target.value)
  }, [setToStorage])

  const handleRegexInput = useCallback((e) => {
    setInputValue(e.target.value)
    setToStorage('regex', e.target.value)
  }, [setToStorage])

  const parse = useCallback(async () => {
    const tab = await getCurrentTab()
    if (!tab) {
      return
    }
    const DOMString = await getTabDOMString(tab.id)
    if (!DOMString) {
      return
    }

    const parserResult = parser.parse(DOMString, inputValue)
    console.log(parserResult)

    if (!parserResult || parserResult.length === 0) {
      alert('По такому шаблону ничего не найдено.')
      return
    }

    if (toDownload) {
      downloadObjectAsJson(parserResult, `Parse Data ${new Date()}`)
    }

    if (toSendOnServer) {
      axios.post(url, {
        data: parserResult
      })
    }

  }, [inputValue, toDownload, toSendOnServer, url])

  return (
    <main className="App">
      <section className="Section Section-main">
        <p className="Text">
          Введите регулярку
        </p>
        <input
            type="text"
            value={inputValue}
            onChange={handleRegexInput}
            placeholder="/Magic Phrase/gi"
            className="Input"
        />
        <button
          className="Button"
          onClick={parse}
        >
          Гоу
        </button>
        <div className="Checkbox">
          <input
              type="checkbox"
              checked={toDownload}
              onChange={handleDownloadCheckboxEvent}
              className="Checkbox-input"
          />
          <span className="Checkbox-text">
            Скачивать данные
          </span>
        </div>
        <div className="Checkbox">
          <input
              type="checkbox"
              checked={toSendOnServer}
              onChange={handleSendOnServerCheckboxEvent}
              className="Checkbox-input"
          />
          <span className="Checkbox-text">
            Отправлять по URL
          </span>
        </div>
        { !!toSendOnServer && (
            <input
                type="text"
                value={url}
                onChange={handleURLInput}
                placeholder="https://example.com/path"
                className="Input"
            />
        )}
      </section>
    </main>
  );
}

export default App;
