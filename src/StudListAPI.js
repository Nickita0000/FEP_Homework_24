export class StudListAPI {
    static API = 'https://6391adecac688bbe4c4f165a.mockapi.io/api/students/'

    static request(url = '', method = 'GET', body){
        return fetch(StudListAPI.API + url, {
            method: method,
            body: body ? JSON.stringify(body) : undefined,
            headers: {
                'Content-type': 'application/json'
            }
        }).
        then((res) => {
            if(res.ok) {
                return res.json()
            }
            throw new Error('Can not execute server request.')
        })
    }

    static getList() {
        return StudListAPI.request().catch(() => {
            throw new Error('Can not retrieve student list from server.')
        })
    }

    static createStudent(student) {
        return StudListAPI.request('', 'POST', student).catch(() => {
            throw new Error('Can not add student to list.')
        })
    }

    static deleteStudent(id) {
        return StudListAPI.request(id, 'DELETE').catch(() => {
            throw new Error('Can not delete this student.')
        })
    }

    static updateStudent(id, changes) {
        return StudListAPI.request(id, 'PUT', changes).catch(() => {
            throw new Error('Can not update data about this student.')
        })
    }
}