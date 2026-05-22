import { Astal } from "ags/gtk4"
import Gdk from "gi://Gdk"
import { onCleanup } from "gnim"
import WorkspaceHypr from "./WorkspaceHypr"
import SystemInfo from "./SystemInfo"
import Tray from "./Tray"
import SectionBar from "./SectionBar"
import Mpris from "./Mpris"

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
        <box class="start" $type="start">
          <WorkspaceHypr gdkmonitor={gdkmonitor} />
        </box>
        <box class="center" $type="center">
          <SectionBar>
            <Mpris />
          </SectionBar>
        </box>
        <box class="end" $type="end">
          <Tray />
          <SystemInfo />
        </box>
      </centerbox>
    </window>
  )
}
