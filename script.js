document.getElementById('addNoteBtn').addEventListener('click', addNote);

function addNote() {
    const noteContainer = document.createElement('div');
    noteContainer.classList.add('note');
    noteContainer.innerHTML = `
        <input type="text" class="note-title" placeholder="Note Title">
        <div class="items"></div>
        <div class="button-container">
            <button id="add-button" onclick="addItem(this)">+</button>
            <button class="sort-items-btn">SORT</button> 
            <button class="minus-button" onclick="removeItem(this)">-</button>
        </div>
    `;
    document.getElementById('notesContainer').appendChild(noteContainer);
    
    const noteTitle = noteContainer.querySelector('.note-title');
    setupTitleListener(noteTitle);

    return noteContainer;
}


function addItem(button) {
    const itemContainer = document.createElement('div');
    itemContainer.classList.add('note-item');
    itemContainer.innerHTML = `
        <input type="text" class="item-text" placeholder="Item Description">
        <input type="range" min="0" max="100" value="50" step="5" class="item-slider">
    `;

    let itemsContainer;
    if (button) {
    
        itemsContainer = button.closest('.note').querySelector('.items');
    } else {
    
        const notes = document.querySelectorAll('.note');
        itemsContainer = notes[notes.length - 1].querySelector('.items');
    }

    itemsContainer.appendChild(itemContainer);
    
    const itemText = itemContainer.querySelector('.item-text');
    setupItemTextListener(itemText);

    const slider = itemContainer.querySelector('.item-slider');
    slider.style.setProperty("--thumb-color", '#ffff00');

    return itemContainer;
}


function updateSliderThumbColor(slider) {
    const value = slider.value;
    const max = slider.max;


    const percentage = (value / max) * 100;


    let color;
    if (percentage < 10) {
        color = '#ff0000';
    } else if (percentage < 20) {
        color = '#ff3300';
    } else if (percentage < 30) {
        color = '#ff6600';
    } else if (percentage < 40) {
        color = '#ff9900';
    } else if (percentage < 50) {
        color = '#ffcc00';
    } else if (percentage < 60) {
        color = '#ffff00';
    } else if (percentage < 70) {
        color = '#ccff33';
    } else if (percentage < 80) {
        color = '#99ff66';
    } else if (percentage < 90) {
        color = '#66ff99';
    } else {
        color = '#33cc33';
    }


    slider.style.setProperty("--thumb-color", color);
}


document.addEventListener('input', function(e) {
    if (e.target.type === 'range') {
        updateSliderThumbColor(e.target);
    }
});


let timeout;

function handleSliderChange(e) {
    clearTimeout(timeout);
    timeout = setTimeout(() => updateSliderThumbColor(e.target), 100);
}

document.addEventListener('input', function(e) {
    if (e.target.type === 'range') {
        handleSliderChange(e);
    }
});
function setupTitleListener(noteTitle) {
    noteTitle.addEventListener('blur', function() {
        if (this.value.trim() !== '') {
            this.classList.add('note-title-filled');
        } else {
            this.classList.remove('note-title-filled');
        }
    });
}

function setupItemTextListener(itemText) {
    itemText.addEventListener('blur', function() {
        if (this.value.trim() !== '') {
            this.classList.add('filled-item-text');
        } else {
            this.classList.remove('filled-item-text');
        }
    });
}
function removeItem(button) {
    const note = button.closest('.note');
    const items = note.querySelectorAll('.note-item');
    if (items.length > 0) {
        items[items.length - 1].remove();
    }
}

function sortNoteItems(noteContainer) {

    const itemsContainer = noteContainer.querySelector('.items');
    

    const noteItems = Array.from(itemsContainer.querySelectorAll('.note-item'));


    noteItems.sort((a, b) => {
        const sliderA = a.querySelector('.item-slider').value;
        const sliderB = b.querySelector('.item-slider').value;
        return sliderA - sliderB;
    });


    noteItems.forEach(item => itemsContainer.appendChild(item));
}

document.addEventListener('click', function(e) {
    if (e.target.classList.contains('sort-items-btn')) {
        const noteContainer = e.target.closest('.note');
        sortNoteItems(noteContainer);
    }
});

document.getElementById('saveNotesBtn').addEventListener('click', saveNotes);
function saveNotes() {
    const notesData = [];
    document.querySelectorAll('.note').forEach(note => {
        const title = note.querySelector('.note-title').value;
        const items = Array.from(note.querySelectorAll('.note-item')).map(item => {
            return {
                description: item.querySelector('.item-text').value,
                sliderValue: item.querySelector('.item-slider').value
            };
        });
        notesData.push({ title, items });
    });
    localStorage.setItem('notes', JSON.stringify(notesData));
}

function loadNotes() {
    const notesData = JSON.parse(localStorage.getItem('notes'));
    if (notesData) {
        notesData.forEach(noteData => {
            const note = addNote(); 
            note.querySelector('.note-title').value = noteData.title;
            note.querySelector('.note-title').classList.add('note-title-filled');
            noteData.items.forEach(itemData => {
                const item = addItem(note.querySelector('.add-item-btn'));
                item.querySelector('.item-text').value = itemData.description;
                item.querySelector('.item-text').classList.add('filled-item-text');
                item.querySelector('.item-slider').value = itemData.sliderValue;
                updateSliderThumbColor(item.querySelector('.item-slider'));
            });
        });
    }
}

document.addEventListener('DOMContentLoaded', function() {
    loadNotes();
    setInterval(saveNotes, 10 * 60 * 1000);
});
