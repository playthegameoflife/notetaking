document.addEventListener('DOMContentLoaded', function () {
    displayStoredNotes();
});

function saveNote() {
    const noteContent = document.getElementById('note-content').value.trim();

    if (noteContent !== '') {
        const noteId = generateUniqueId();
        const note = { id: noteId, content: noteContent };
        saveToLocalStorage(note);
        displayNoteWithEditOption(note);
        clearForm();
    } else {
        alert('Please enter some content for your note.');
    }
}

function displayStoredNotes() {
    const storedNotes = getFromLocalStorage();
    if (storedNotes) {
        storedNotes.forEach(note => displayNoteWithEditOption(note));
    }
}

function displayNoteWithEditOption(note) {
    const noteList = document.getElementById('note-list');
    const noteItem = document.createElement('div');
    noteItem.classList.add('note-item');
    noteItem.setAttribute('data-id', note.id);
    noteItem.innerHTML = `
        <p ondblclick="startEditing('${note.id}')">${note.content}</p>
        <div class="button-container">
            <button type="button" onclick="deleteNote('${note.id}')">Delete</button>
        </div>
    `;
    noteList.appendChild(noteItem);
}

function startEditing(noteId) {
    const noteList = document.getElementById('note-list');
    const noteItem = document.querySelector(`.note-item[data-id="${noteId}"] p`);

    // Create an input element for editing
    const inputElement = document.createElement('textarea');
    inputElement.value = noteItem.textContent;

    // Handle editing completion on Enter key press
    inputElement.addEventListener('keyup', function (event) {
        if (event.key === 'Enter') {
            finishEditing(noteId, inputElement.value);
        }
    });

    // Replace the paragraph with the input element
    noteList.replaceChild(inputElement, noteItem);

    // Focus on the input element
    inputElement.focus();
}

function finishEditing(noteId, editedContent) {
    const noteList = document.getElementById('note-list');
    const inputElement = document.querySelector(`.note-item[data-id="${noteId}"] textarea`);

    // Replace the input element with a new paragraph
    const newParagraph = document.createElement('p');
    newParagraph.textContent = editedContent;
    noteList.replaceChild(newParagraph, inputElement);

    // Update the content in local storage
    updateLocalStorageWithoutDeletedNote(noteId, editedContent);
}

function clearForm() {
    document.getElementById('note-content').value = '';
}

function generateUniqueId() {
    return '_' + Math.random().toString(36).substr(2, 9);
}

function saveToLocalStorage(note) {
    const storedNotes = getFromLocalStorage() || [];
    storedNotes.push(note);
    localStorage.setItem('notes', JSON.stringify(storedNotes));
}

function getFromLocalStorage() {
    return JSON.parse(localStorage.getItem('notes'));
}

function deleteNoteFromList(noteId) {
    const noteList = document.getElementById('note-list');
    const noteItem = document.querySelector(`.note-item[data-id="${noteId}"]`);
    if (noteItem) {
        noteList.removeChild(noteItem);
    }
}

function deleteNote(noteId) {
    deleteNoteFromList(noteId);

    // Remove the note from localStorage
    const storedNotes = getFromLocalStorage();
    const updatedNotes = storedNotes.filter(note => note.id !== noteId);
    localStorage.setItem('notes', JSON.stringify(updatedNotes));
}

function updateLocalStorageWithoutDeletedNote(noteId, newContent) {
    // Remove the note from localStorage without updating the list
    const storedNotes = getFromLocalStorage();
    const updatedNotes = storedNotes.map(note => (note.id === noteId ? { ...note, content: newContent } : note));
    localStorage.setItem('notes', JSON.stringify(updatedNotes));
}
