import { Gdk } from "ags/gtk4"
import Hyprland from "gi://AstalHyprland"
import { createBinding } from "ags"
import SectionBar from "../SectionBar"

export default function WorkspaceHypr({
  gdkmonitor,
}: {
  gdkmonitor: Gdk.Monitor
}) {
  const hyprland = Hyprland.get_default()
  console.log(hyprland.focused_monitor.name)
  const focusedWorkspace = createBinding(hyprland, "focusedWorkspace")
  console.log(Hyprland.Workspace.dummy(0 + 2, null).name)

  for (const x of hyprland.monitors) {
    // console.log("monitor", x.name)
  }

  for (const x of hyprland.workspaces) {
    for (const y of x.get_clients()) {
      // console.log(
      // "\ntitle ",
      // y.title,
      // "\ntitle init",
      // y.initial_title,
      // "\nclasse init",
      // y.initialClass,
      //   "\nclasse",
      //   y.class,
      // )
      // console.log()
    }
    // console.log("workspaces", x.name, x.get_monitor().name)
  }
  return (
    <SectionBar>
      <label label={"hypr work 󰈹   "} />
    </SectionBar>
  )
}
