import { Gdk } from "ags/gtk4"
import Hyprland from "gi://AstalHyprland"
import { createBinding, For } from "ags"
import SectionBar from "../SectionBar"
import { exec } from "ags/process"

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
  console.log("fee", focusedWorkspace)

  for (const x in hyprland.workspaces) {
    console.log(x)
  }

  for (const x of hyprland.workspaces) {
    // console.log("nome", x.name, "monitor", x.monitor.name)
  }

  return (
    <SectionBar>
      <For each={workspaces}>
        {(workspace) => {
          // TODO: Change the onClicked logic when they (AGS) fix the error on the workspace.focus()
          return (
            <box>
              {workspace.monitor.name.toString() ==
                gdkmonitor.get_connector() && (
                <button
                  onClicked={() =>
                    exec([
                      "hyprctl",
                      "dispatch",
                      `hl.dsp.focus({ workspace = "${workspace.name}" })`,
                    ])
                  }
                  class={
                    "btn-ws " +
                    (workspace.name == focusedWorkspace().name
                      ? "active"
                      : "inactive")
                  }
                >
                  {workspace.name}
                </button>
              )}
            </box>
          )
        }}
      </For>
    </SectionBar>
  )
}
