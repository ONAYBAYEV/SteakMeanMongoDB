async function fetchStudents() {
    try {
        const response = await fetch('/students');
        if (response.ok) {
            const students = await response.json();
            const studentList = document.getElementById('studentList');

            // Clear the table before adding new data
            studentList.innerHTML = '';

            students.forEach(student => {
                const row = document.createElement('tr');
                const nameCell = document.createElement('td');
                nameCell.textContent = student.name;
                const surnameCell = document.createElement('td');
                surnameCell.textContent = student.surname;
                const facultyCell = document.createElement('td');
                facultyCell.textContent = student.faculty;

                const deleteButtonCell = document.createElement('td');
                const deleteButton = document.createElement('button');
                deleteButton.className = 'btn btn-danger sm';
                deleteButton.textContent = 'Delete';
                deleteButton.addEventListener('click', () => {
                    deleteStudent(student._id);
                });
                deleteButtonCell.appendChild(deleteButton);

                const editButtonCell = document.createElement('td');
                const editButton = document.createElement('button');
                editButton.className = 'btn btn-primary sm';
                editButton.textContent = 'Edit';
                editButton.addEventListener('click', () => {
                    editStudent(student._id, student.name, student.surname);
                });
                editButtonCell.appendChild(editButton);

                row.appendChild(nameCell);
                row.appendChild(surnameCell);
                row.appendChild(facultyCell);
                row.appendChild(deleteButtonCell);
                row.appendChild(editButtonCell);
                studentList.appendChild(row);
            });
        } else {
            console.error('Error fetching students');
        }
    } catch (error) {
        console.error('Error sending request:', error);
    }
}

async function createStudent(event) {
    event.preventDefault();

    const name = document.getElementById('nameInput').value;
    const surname = document.getElementById('surnameInput').value;
    const faculty = document.getElementById('facultyInput').value;
    try {
        const response = await fetch('/students', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name,
                surname,
                faculty
            }),
        });

        if (response.ok) {
            console.log('Student created successfully');
            document.getElementById('nameInput').value = '';
            document.getElementById('surnameInput').value = '';
            document.getElementById('facultyInput').value = '';
            await fetchStudents();
        } else {
            console.error('Error creating student');
        }
    } catch (error) {
        console.error('Error sending request:', error);
    }
}

async function deleteStudent(studentId) {
    try {
        const response = await fetch(`/students/${studentId}`, {
            method: 'DELETE',
        });

        if (response.ok) {
            console.log('Student deleted successfully');
            await fetchStudents();
        } else {
            console.error('Error deleting student');
        }
    } catch (error) {
        console.error('Error sending request:', error);
    }
}

async function editStudent(studentId, currentName, currentSurname,currentFaculty) {
    const newName = prompt('Enter new name:', currentName);
    const newSurname = prompt('Enter new surname:', currentSurname);
    const newFaculty = prompt('Enter new faculty:', currentFaculty);
    if (newName && newSurname && newFaculty ) {
        try {
            const response = await fetch(`/students/${studentId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: newName,
                    surname: newSurname,
                    faculty:newFaculty,
                }),
            });

            if (response.ok) {
                console.log('Student updated successfully');
                await fetchStudents();
            } else {
                console.error('Error updating student');
            }
        } catch (error) {
            console.error('Error sending request:', error);
        }
    }
}

document.getElementById('createStudentForm').addEventListener('submit', createStudent);

window.addEventListener('load', fetchStudents);