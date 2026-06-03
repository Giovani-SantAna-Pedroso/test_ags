import { Gdk } from "ags/gtk4"
import Hyprland from "gi://AstalHyprland"
import { createBinding, createComputed, For } from "ags"
import SectionBar from "../SectionBar"
import { exec } from "ags/process"

export default function WorkspaceHypr({
  gdkmonitor,
}: {
  gdkmonitor: Gdk.Monitor
}) {
  const hyprland = Hyprland.get_default()
  const focusedWorkspace = createBinding(hyprland, "focusedWorkspace")
  const workspaces = createBinding(hyprland, "workspaces")

  const btns = createComputed(() => {
    const x = workspaces()
    x.sort((a, b) => parseInt(a.name) - parseInt(b.name))
    return x
  })

  // exec(["hyprctl", "dispatch", `workspace ${workspace.name}`])
  return (
    <SectionBar>
      <For each={btns}>
        {(workspace) => {
          const btnClass = createComputed(
            () =>
              "btn-ws " +
              (workspace.name == focusedWorkspace().name
                ? "active"
                : "inactive"),
          )

          return (
            <box>
              {workspace.monitor.name.toString() ==
                gdkmonitor.get_connector() && (
                <button
                  onClicked={() =>
                    exec([
                      "hyprctl",
                      "eval",
                      `hl.dispatch(hl.dsp.focus({ workspace = "${workspace.name}" }))`,
                    ])
                  }
                  class={btnClass}
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
