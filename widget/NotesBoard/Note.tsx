import { Astal, Gtk } from "ags/gtk4"
import { formatDate } from "../../configs"

export type NoteProps = {
  id: string
  title: string
  content: string
  deadline: Date
  urgency: "low" | "medium" | "high"
  bgColor: string
  transparency?: string
  handleEditNote: () => void
}

export default function Note(props: NoteProps) {
  const bgColor = props.bgColor + (props.transparency ?? "AA").toString()
  let bgColorUrgency = "#880000"
  // It didnt end up cool
  // const rangeRotation = 4
  // const rotation = Math.random() * rangeRotation - rangeRotation / 2
  const rotation = 0

  if (props.urgency == "low") {
    bgColorUrgency = "#bbf7d0"
  } else if (props.urgency == "medium") {
    bgColorUrgency = "#fef08a"
  } else {
    bgColorUrgency = "#fca5a5"
  }

  // const bgColor = props.bgColor
  // print(bgColor)
  return (
    <box
      class="note"
      orientation={Gtk.Orientation.VERTICAL}
      hexpand={false}
      css={`
        background-color: ${bgColor};
        transform: rotateZ(${rotation}deg);
      `}
    >
      <centerbox orientation={Gtk.Orientation.VERTICAL}>
        <label
          $type="start"
          halign={Gtk.Align.START}
          class="title"
          label={props.title}
        />
        <label
          $type="center"
          halign={Gtk.Align.START}
          class="content"
          label={props.content}
        />
      </centerbox>
      <box orientation={Gtk.Orientation.VERTICAL}>
        <centerbox
          class="urgency-deadline"
          orientation={Gtk.Orientation.HORIZONTAL}
        >
          <label
            $type="start"
            halign={Gtk.Align.START}
            css={"background-color:" + bgColorUrgency + ";"}
            class="urgency"
            label={props.urgency}
          />
          <label
            $type="end"
            halign={Gtk.Align.END}
            class="deadline"
            label={props.deadline.toLocaleDateString(formatDate)}
          />
        </centerbox>

        <button
          onClicked={() => props.handleEditNote()}
          css={`
            background-color: ${props.bgColor};
          `}
        >
          Edit Note
        </button>
      </box>
    </box>
  )
}
