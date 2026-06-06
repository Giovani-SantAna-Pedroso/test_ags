import { Astal, Gtk } from "ags/gtk4"
import { createBinding, createComputed, createState, For, With } from "ags"
import Hyprland from "gi://AstalHyprland"
import Note, { NoteProps } from "./Note"
import { getNotes } from "./notesService"
import NoteForm from "./NoteForm"
import { confNotesBoard } from "../../configs/config"

export default function NotesWindow({
  gdkmonitor,
}: {
  gdkmonitor: Gdk.Monitor
}) {
  const hypr = Hyprland.get_default()

  const focusedWorkspace = createBinding(hypr, "focusedWorkspace")
  const visible = createComputed(() => {
    focusedWorkspace().name
    return true
  })

  const [notes, setNotes] = createState(getNotes())
  const [idNoteToEdit, setIdNoteToEdit] = createState("")
  const [isFormOpen, setIsFormOpen] = createState(false)
  const [isToShowNotes, setIsToShowNotes] = createState(true)
  const icontHideNotes = createComputed(() =>
    !isToShowNotes() ? "view-reveal-symbolic" : "view-conceal-symbolic",
  )
  const icontAddNote = createComputed(() =>
    !isFormOpen() ? "list-add" : "window-close-symbolic",
  )
  const hideHideNotesBtn = createComputed(() => {
    return !isFormOpen()
  })

  const handleReloadhNotes = () => {
    setNotes(getNotes())
  }

  const handleEditNote = (id: string) => {
    setIdNoteToEdit(id)
    setIsFormOpen(true)
  }

  const handleToggleForm = () => {
    if (isFormOpen()) {
      // console.log("closing")
      setIsFormOpen(false)
      setIdNoteToEdit("")
    } else {
      setIsFormOpen(true)
    }
  }

  return (
    <window
      $={(self) => {
        self.set_default_size(1, 1)
      }}
      name="notes-board"
      namespace="notes-board"
      gdkmonitor={gdkmonitor}
      anchor={Astal.WindowAnchor.TOP | Astal.WindowAnchor.LEFT}
      exclusivity={Astal.Exclusivity.IGNORE}
      layer={Astal.Layer.BACKGROUND}
      keymode={Astal.Keymode.ON_DEMAND}
      visible={visible}
      class="notes-board"
      cssClasses={["notes-window"]}
    >
      <box orientation={Gtk.Orientation.VERTICAL}>
        <box spacing={8} class="btns-containers">
          <button onClicked={() => handleToggleForm()}>
            <image iconName={icontAddNote} pixelSize={16} />
          </button>
          <button
            visible={hideHideNotesBtn}
            onClicked={() => setIsToShowNotes((y) => !y)}
          >
            <image iconName={icontHideNotes} pixelSize={16} />
          </button>
        </box>
        <With value={isFormOpen}>
          {(value) =>
            value ? (
              <NoteForm
                idNote={idNoteToEdit()}
                updateNotes={() => handleReloadhNotes()}
                closeForm={() => handleToggleForm()}
              />
            ) : (
              <box
                orientation={Gtk.Orientation.VERTICAL}
                visible={isToShowNotes}
              >
                <With value={notes}>
                  {(value) => {
                    const maxCols = confNotesBoard.maxCols
                    const maxRows = confNotesBoard.maxRow
                    const rowSpacing = confNotesBoard.rowSpacing
                    const colSpacing = confNotesBoard.colSpacing

                    return (
                      <Gtk.Grid
                        columnSpacing={colSpacing}
                        rowSpacing={rowSpacing}
                        $={(self) => {
                          value
                            .slice(0, maxCols * maxRows)
                            .forEach((note, i) => {
                              const col = i % maxCols
                              const row = Math.floor(i / maxCols)
                              self.attach(
                                <Note
                                  {...note}
                                  handleEditNote={() => handleEditNote(note.id)}
                                />,
                                col,
                                row,
                                1,
                                1,
                              )
                            })
                        }}
                      />
                    )
                  }}
                </With>
              </box>
            )
          }
        </With>
      </box>
    </window>
  )
}
