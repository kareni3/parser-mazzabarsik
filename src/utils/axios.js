import axios from 'axios'

const api = {
    post: (url, data) => {
        axios.post(url, data)
            .then(() => {})
            .catch(function (error) {
                alert('Ошибка отправки данных!')
            });
    }
}
export default api