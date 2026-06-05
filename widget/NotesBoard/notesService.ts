import Note, { NoteProps } from "./Note"

let notesTmp: NoteProps[] = [
  {
    id: "1",
    title: "Test",
    content:
      "This is a note for testing This is a \nnote for testing This is a note for testing\n This is a note for testing",
    urgency: "low",
    deadline: new Date(Date.now()),
    bgColor: "#fef08a",
  },
  {
    id: "2",
    title: "Test",
    content: "This is a note for testing",
    urgency: "medium",
    deadline: new Date(Date.now()),
    bgColor: "#e9d5ff",
  },
  {
    id: "3",
    title: "Test",
    content: "This is a note for testing",
    urgency: "high",
    deadline: new Date(Date.now()),
    bgColor: "#a5f3fc",
  },
  {
    id: "4",
    title: "Test",
    content: "This is a note for testing",
    urgency: "high",
    deadline: new Date(Date.now()),
    bgColor: "#bbf7d0",
  },
]

export function getNotes(): NoteProps[] {
  return notesTmp
}

export function getNoteInfo(id: string) {
  return getNotes().find((note) => note.id === id)
}

export function addNote(newNote: NoteProps) {
  notesTmp = [...notesTmp, { ...newNote, id: notesTmp.length.toString() }]
}

export function deleteNote(id: string) {
  notesTmp = notesTmp.filter((note) => note.id !== id)
}

export function updateNote(updatedNote: NoteProps) {
  notesTmp = notesTmp.map((note) =>
    note.id === updatedNote.id ? updatedNote : note,
  )
}
