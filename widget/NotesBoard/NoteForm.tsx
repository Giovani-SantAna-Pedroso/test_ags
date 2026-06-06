import { NoteProps } from "./Note"
import { Gtk } from "ags/gtk4"
import { createComputed, createState, With } from "ags"
import { addNote, updateNote, deleteNote, getNoteInfo } from "./notesService"
import { formatDate, parseDate } from "../../utils"

type NoteFormProps = {
  idNote: string
  closeForm: () => void
  updateNotes: () => void
}

export default function NoteForm(props: NoteFormProps) {
  const noteColors = [
    "#fef08a",
    "#fde68a",
    "#fed7aa",
    "#fecdd3",
    "#fbcfe8",
    "#f5d0fe",
    "#e9d5ff",
    "#bae6fd",
    "#a5f3fc",
    "#bbf7d0",
    "#d9f99d",
    "#86efac",
  ]

  let title = ""
  let content = ""
  let deadline = ""
  let urgency = "low"
  let bgColor = noteColors[0]

  if (props.idNote !== "") {
    const note = getNoteInfo(props.idNote)
    title = note?.title ?? ""
    content = note?.content ?? ""
    deadline = note?.deadline ? formatDate(note.deadline) : ""
    urgency = note?.urgency ?? "low"
    bgColor = note?.bgColor ?? noteColors[0]
  }

  const [newTitle, setNewTitle] = createState(title)
  const [newContent, setNewContent] = createState(content)
  const [newDeadline, setNewDeadline] = createState(deadline)
  const [newUrgency, setNewUrgency] = createState(urgency)
  const [newBgColor, setNewBgColor] = createState(bgColor)
  const [errMsg, setErrMsg] = createState("")

  const [recId, setRecId] = createState(props.idNote) // Just to make reactive

  const [isToDelete, setIsToDelete] = createState(false)

  const options = ["low", "medium", "high"]
  const computedBg = createComputed(() => newBgColor())

  const handleSave = () => {
    // Validation
    const date = parseDate(newDeadline())
    let erros: String[] = []

    if (date.err) {
      erros.push("Invalid date — expected format: yyyy/mm/dd hh:mm")
    }

    if (newTitle().trim() === "") erros.push("Title is required")
    if (newContent().trim() === "") erros.push("Content is required")

    if (erros.length !== 0) {
      setErrMsg(erros.join("\n"))
      return
    }

    const newNote: NoteProps = {
      id: props.idNote,
      title: newTitle(),
      content: newContent(),
      urgency: newUrgency() as "low" | "medium" | "high",
      deadline: date.date,
      bgColor: newBgColor(),
    }
    // console.log(newNote)

    if (props.idNote === "") {
      // console.log("saving")
      addNote(newNote)
    } else {
      // console.log("updating")
      updateNote(newNote)
    }

    props.updateNotes()
    props.closeForm()
  }

  const handleDeleteNote = () => {
    deleteNote(props.idNote)
    props.updateNotes()
    props.closeForm()
  }
  return (
    <box hexpand orientation={Gtk.Orientation.VERTICAL} class="note-form">
      <box class="entry" orientation={Gtk.Orientation.VERTICAL}>
        <label halign={Gtk.Align.START} label="Title" />
        <entry
          hexpand
          placeholderText="Title"
          text={newTitle}
          onNotifyText={({ text }) => setNewTitle(text)}
        />
      </box>

      <box class="entry" orientation={Gtk.Orientation.VERTICAL}>
        <label halign={Gtk.Align.START} label="Deadline" />
        <entry
          hexpand
          placeholderText="AAAA/MM/DD HH:MM"
          text={newDeadline} //
          onNotifyText={({ text }: { text: string }) => setNewDeadline(text)} // ← era setNewTitle
        />
      </box>

      <box class="entry" orientation={Gtk.Orientation.HORIZONTAL}>
        <label halign={Gtk.Align.START} label="Urgency: " />
        <menubutton>
          <label halign={Gtk.Align.START} label={newUrgency} />
          <popover>
            <box spacing={8}>
              {options.map((opt) => (
                <button onClicked={() => setNewUrgency(opt)}>{opt}</button>
              ))}
            </box>
          </popover>
        </menubutton>
      </box>

      <box class="entry" orientation={Gtk.Orientation.HORIZONTAL}>
        <label halign={Gtk.Align.START} label="Note Color: " />
        <menubutton
          css={`
            background-color: #ff00ff;
            color: ${computedBg};
          `}
        >
          <label
            halign={Gtk.Align.START}
            css={`
              color: ${computedBg};
            `}
            label={newBgColor}
          />
          <popover>
            <box spacing={8}>
              {noteColors.map((color) => (
                <button
                  css={`
                    background-color: ${color};
                    color: ${color};
                  `}
                  onClicked={() => setNewBgColor(color)}
                >
                  {color}
                </button>
              ))}
            </box>
          </popover>
        </menubutton>
      </box>

      <box class="entry" orientation={Gtk.Orientation.VERTICAL}>
        <label halign={Gtk.Align.START} label="Content" />
        <scrolledwindow hexpand minContentHeight={100}>
          <With value={newContent}>
            {(value) => (
              <Gtk.TextView
                class="text-view"
                editable={true}
                $={(self) => {
                  self.buffer.set_text(value, -1)
                  self.buffer.connect("changed", () => {
                    const buf = self.buffer
                    setNewContent(
                      buf.get_text(
                        buf.get_start_iter(),
                        buf.get_end_iter(),
                        false,
                      ),
                    )
                  })
                }}
              />
            )}
          </With>
        </scrolledwindow>
      </box>

      <box>
        <button hexpand onClicked={handleSave}>
          <label label={recId() !== "" ? "Update" : "Create"} />
        </button>
      </box>

      <With value={errMsg}>
        {(value) =>
          value && (
            <label
              halign={Gtk.Align.START}
              class="err-msg"
              css=""
              label={value}
            />
          )
        }
      </With>

      {props.idNote !== "" && (
        <box orientation={Gtk.Orientation.VERTICAL}>
          <button
            class="btn-delete-note"
            hexpand
            onClicked={() => setIsToDelete((x) => !x)}
          >
            <label label={"Delete Note"} />
          </button>

          <With value={isToDelete}>
            {(value) =>
              value && (
                <box spacing={8}>
                  <button onClicked={() => setIsToDelete(false)} hexpand>
                    No
                  </button>
                  <button onClicked={handleDeleteNote} hexpand>
                    Yes
                  </button>
                </box>
              )
            }
          </With>
        </box>
      )}
    </box>
  )
}
