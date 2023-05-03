import { StudListAPI } from "./StudListAPI";
import './styles.css'

const BTN_DELETE = 'buttonDelete'
const CLASS_MARK = '.mark'
const SELECTOR_MARK = 'mark'
const CLASS_STUDENT = '.student'
const root = document.querySelector('#root')

let initialList = []

init()
const studList = document.querySelector('#container')
const form = document.querySelector('#studentForm')

StudListAPI
    .getList()
    .then((list) => {
        renderServerList(list)
        initialList = list
    })
form.addEventListener('submit', onSubmitForm)
studList.addEventListener('click', onDeleteButtonClick)
studList.addEventListener('focusout', onStudListFocusout)

function init() {
    renderStudForm()
    renderHtml()
}

function onStudListFocusout(e) {
    const studentInitEl = e.target.closest(CLASS_STUDENT)
    const id = studentInitEl.dataset.id
    const studentInit = findStudentById(id)
    const studentInputs = studentInitEl.querySelectorAll(CLASS_MARK)
    const marks = Array.from(studentInputs).map(mark => mark.value)
    const updatedStudent = {
        ...studentInit,
        marks: marks
    }

    if(isInput(e.target)) {
        StudListAPI.updateStudent(id, updatedStudent)
            .then((newStudent) => {
                replaceStudent(id, newStudent)
                initialList.map(studentItem => studentItem.id === id ? newStudent : studentItem)
            })
            .catch(e => showError(e))
    }
}

function replaceStudent(id, student) {
    const initStudent = document.querySelector(`[data-id="${id}"]`)
    const newStudentItem = htmlStudent(student)

    initStudent.outerHTML = newStudentItem
}

function isInput(area) {
    return area.classList.contains(SELECTOR_MARK)
}

function onDeleteButtonClick(e) {
    if(isDeleteBtn(e.target)) {
        const student = e.target.closest(CLASS_STUDENT)
        const id = student.dataset.id

        deleteStudentFromList(id)
        removeCurrentStudent(student)
        StudListAPI.deleteStudent(id).catch(e => showError(e))
    }
}


function onSubmitForm(e) {
    e.preventDefault()

    const student = getStudentName()
    if(!isNameValid(student.name)) {
        alert('Введите имя!')
    } else {StudListAPI
        .createStudent(student)
        .then((newStudent) => {
            renderStudList(newStudent)
            addStudent(newStudent)
            clearForm()
        })}
}

function getStudentName() {
    return { name: form.studentName.value}
}

function isNameValid(name) {
    return name !== ''
}

function renderServerList(list) {
    const htmlServerList = list.map(htmlStudent)

    studList.innerHTML = htmlServerList.join('')
}

function renderStudList(student) {
    studList.insertAdjacentHTML("beforeend", htmlStudent(student))
}

function htmlStudent(student) {
    return `
        <tr class="student" data-id="${student.id}">
            <td>${student.name}</td>
            <td>
                ${fillInputsMarks(student)}
            </td>
            <td>
                <button class="buttonDelete">Delete</button>
            </td>
        </tr>
    `
}

function fillInputsMarks(student) {
    return student.marks.map( x => `<input class="mark" type="number" value="${x}">`).join('')
}

function renderHtml() {
    root.insertAdjacentHTML("beforeend", htmlTable())
}

function htmlTable() {
    return `
        <table>
            <thead>
            <tr>
                <th>Name</th>
                <th>Marks</th>
                <th>Action</th>
            </tr>
            </thead>
            <tbody id="container">
            </tbody>
        </table>
    `
}


function renderStudForm() {
    root.innerHTML = `
        <form id="studentForm">
        <input id="studentName" type="text" placeholder="Student's name">
        <button id="buttonAdd">Add</button>
        </form>
    `
}

function isDeleteBtn(area) {
    return area.classList.contains(BTN_DELETE)
}

function deleteStudentFromList(id) {
    return initialList
        .filter(student => student.id !== id)
}

function removeCurrentStudent(student) {
    student.remove()
}

function addStudent(newStudent) {
    return initialList
        .push(newStudent);
}

function findStudentById(id) {
    return initialList
        .find(student => student.id === id)
}

function clearForm() {
    form.reset()
}

function showError(e) {
    alert(e.message)
}