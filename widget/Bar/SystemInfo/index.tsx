import SectionBar from "../SectionBar"
import GLib from "gi://GLib?version=2.0"
import { Gtk } from "ags/gtk4"
import { createPoll } from "ags/time"
import AstalBattery from "gi://AstalBattery"
import AstalWp from "gi://AstalWp"
import { createBinding, With } from "ags"
import { exec, createSubprocess } from "ags/process"

type VolumeState = {
  volume: number
  muted: boolean
}

export default function SystemInfo({ format = "%H:%M" }) {
  const time = createPoll("", 1000, () => {
    return GLib.DateTime.new_now_local().format(format)!
  })
  const battery = AstalBattery.get_default()
  const isBatteryPresent = createBinding(battery, "isPresent")
  const batteryIcon = createBinding(battery, "batteryIconName")

  const wp = AstalWp.get_default()
  const speaker = wp?.audio.defaultSpeaker!
  const volumeIcon = createBinding(speaker, "volumeIcon")
  const volume = createBinding(speaker, "volumeIcon")

  const percent = createBinding(
    battery,
    "percentage",
  )((p) => {
    return `${Math.floor(p * 100)}%`
  })

  const CPUUsage = createPoll(
    "0",
    5000,
    `bash -c "top -bn1 | grep 'Cpu(s)' | awk '{printf(\\"%d\\", 100 - $8)}'"`,
  )

  const ramUsage = createPoll(
    "0",
    5000,
    `bash -c "free | awk '/Mem/ {printf(\\"%d\\", $3/$2 * 100)}'"`,
  )

  const Temp = createPoll(
    "0",
    10000,
    `bash -c "sensors | awk '/Tctl/ {printf(\\"%d\\", $2)}'"`,
  )

  return (
    <SectionBar>
      <box>
        <button
          css="cursor: pointer"
          onClicked={(self) => exec(["pavucontrol"])}
        >
          <box>
            <With value={volume}>{(vol) => <label label={vol} />}</With>
            <With value={volumeIcon}>
              {(icon) => <image iconName={icon} />}
            </With>
          </box>
        </button>
      </box>

      {/* Processor and Ram */}
      <box class={"info-container"}>
        <label label={ramUsage.as((v) => v.padStart(4, " "))} />%
        <label label={`󰍜 `} />
      </box>
      <box class="info-container">
        <label label={CPUUsage.as((v) => v.padStart(4, " "))} />
        <label label={`% 󰍛 `} />
      </box>
      {/* Clock */}
      <menubutton class={"clock"}>
        <label label={time} />
        <popover>
          <Gtk.Calendar />
        </popover>
      </menubutton>
      <box visible={isBatteryPresent()}>
        <With value={batteryIcon}>{(icon) => <image iconName={icon} />}</With>
      </box>
    </SectionBar>
  )
}
