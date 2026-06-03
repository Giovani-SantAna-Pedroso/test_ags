import SectionBar from "../SectionBar"
import app from "ags/gtk4/app"
import { exec } from "ags/process"

export default function MenuBtn({ gdkmonitor }: { gdkmonitor: Gdk.Monitor }) {
  app.connect("request", (app, [cmd], response) => {
    if (cmd === "say") {
      request(gdkmonitor)
      exec([" notify-send ", `dd`])
    }
  })

  return (
    <SectionBar>
      <button
        onClicked={() => exec(["ags", "request", "say"])}
        class="btn-menu"
        iconName="open-menu-symbolic"
      />
    </SectionBar>
  )
}
