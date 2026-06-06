import { NoteProps } from "./Note"
import { readFile, writeFile } from "ags/file"
import GLib from "gi://GLib"
import Gio from "gi://Gio"

let notesMem: NoteProps[] = []

let wasFileLoad = false

const NOTES_FILE_PATH = "./configs/notes.json"

function ensureFileExists(): void {
  const file = Gio.File.new_for_path(NOTES_FILE_PATH)
  if (!file.query_exists(null)) {
    const dir = file.get_parent()
    if (dir) {
      GLib.mkdir_with_parents(dir.get_path()!, 0o755)
    }
    file.replace_contents(
      new TextEncoder().encode("[]"),
      null,
      false,
      Gio.FileCreateFlags.NONE,
      null,
    )
  }
}

export function getNotesFromFile(): NoteProps[] {
  try {
    ensureFileExists()
    const content = readFile(NOTES_FILE_PATH)

    const notes = JSON.parse(content) as (Omit<NoteProps, "deadline"> & {
      deadline: string
    })[]

    return notes.map((note) => ({
      ...note,
      deadline: new Date(note.deadline),
    }))
  } catch (error) {
    console.error("Failed to load notes:", error)
    return []
  }
}

export function getNotes(): NoteProps[] {
  if (!wasFileLoad) {
    notesMem = getNotesFromFile()
    wasFileLoad = true
  }

  return notesMem
}

function saveNotes() {
  writeFile(NOTES_FILE_PATH, JSON.stringify(notesMem, null, 2))
}

export function getNoteInfo(id: string): NoteProps | undefined {
  return getNotes().find((note) => note.id === id)
}

export function addNote(newNote: NoteProps) {
  notesMem.push({
    ...newNote,
    id: `${Date.now()}-${Math.floor(Math.random() * 100000)}`,
  })

  saveNotes()
}

export function deleteNote(id: string) {
  notesMem = notesMem.filter((note) => note.id !== id)

  saveNotes()
}

export function updateNote(updatedNote: NoteProps) {
  notesMem = notesMem.map((note) =>
    note.id === updatedNote.id ? updatedNote : note,
  )

  saveNotes()
}
