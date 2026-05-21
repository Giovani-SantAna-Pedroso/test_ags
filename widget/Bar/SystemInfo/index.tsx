import SectionBar from "../SectionBar"
import GLib from "gi://GLib?version=2.0"
import { Gtk } from "ags/gtk4"
import { createPoll } from "ags/time"
import { createBinding } from "ags"

export default function SystemInfo({ format = "%H:%M" }) {
  const time = createPoll("", 1000, () => {
    return GLib.DateTime.new_now_local().format(format)!
  })

  return (
    <SectionBar>
      {/* Processor */}

      {/* Clock */}
      <menubutton class={"clock"}>
        <label label={time} />
        <popover>
          <Gtk.Calendar />
        </popover>
      </menubutton>
    </SectionBar>
  )
}
