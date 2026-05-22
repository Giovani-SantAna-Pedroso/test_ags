import { Gdk } from "ags/gtk4"
import Hyprland from "gi://AstalHyprland"
import { createBinding, For } from "ags"
import SectionBar from "../SectionBar"

export default function WorkspaceHypr({
  gdkmonitor,
}: {
  gdkmonitor: Gdk.Monitor
}) {
  const hyprland = Hyprland.get_default()
  // console.log(hyprland.focused_monitor.name)
  const focusedWorkspace = createBinding(hyprland, "focusedWorkspace")
  const workspaces = createBinding(hyprland, "workspaces")
  // console.log(Hyprland.Workspace.dummy(0 + 2, null).name)

  for (const x of hyprland.workspaces) {
    console.log("nome", x.name, "monitor", x.monitor.name)
  }

  return (
    <SectionBar>
      <For each={workspaces}>
        {(workspace) => {
          return (
            <box>
              {workspace.monitor.name.toString() ==
                gdkmonitor.get_connector() && <button>{workspace.name}</button>}
            </box>
          )
        }}
      </For>
    </SectionBar>
  )
}
