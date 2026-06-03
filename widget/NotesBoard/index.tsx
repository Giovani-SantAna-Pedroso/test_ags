import { Astal } from "ags/gtk4"
import { createBinding, createComputed, For } from "ags"
import Hyprland from "gi://AstalHyprland"

export default function NotesWindow() {
  const hypr = Hyprland.get_default()

  const focusedWorkspace = createBinding(hypr, "focusedWorkspace")
  const visible = createComputed(() => {
    focusedWorkspace().name
    return true
  })

  return (
    <window
      name="notes-board"
      namespace="notes-board"
      anchor={
        Astal.WindowAnchor.TOP |
        Astal.WindowAnchor.LEFT |
        Astal.WindowAnchor.RIGHT |
        Astal.WindowAnchor.BOTTOM
      }
      exclusivity={Astal.Exclusivity.IGNORE}
      layer={Astal.Layer.BACKGROUND}
      visible={visible}
      cssClasses={["notes-window"]}
    >
      <box>
        <label label="eee" />
      </box>
    </window>
  )
}
