import { Astal } from "ags/gtk4"
import Gdk from "gi://Gdk?version=4.0"
import { onCleanup } from "gnim"
import WorkspaceHypr from "./WorkspaceHypr"
import SystemInfo from "./SystemInfo"

export default function Bar({ gdkmonitor }: { gdkmonitor: Gdk.Monitor }) {
  let win: Astal.Window
  const { BOTTOM, LEFT, RIGHT } = Astal.WindowAnchor

  onCleanup(() => {
    win.destroy()
    // unsubscribe()
  })
  return (
    <window
      visible
      name={`bar-${gdkmonitor.connector}`}
      anchor={BOTTOM | LEFT | RIGHT}
      exclusivity={Astal.Exclusivity.EXCLUSIVE}
      gdkmonitor={gdkmonitor}
      class={"bar"}
    >
      <centerbox>
        <box $type="start">
          <WorkspaceHypr gdkmonitor={gdkmonitor} />
        </box>
        <box $type="center">
          <label label={`bar-center`} />
        </box>
        <box $type="end">
          <SystemInfo />
        </box>
      </centerbox>
    </window>
  )
}
