import app from "ags/gtk4/app"
import scss from "./style.scss"
import { createBinding, For, This } from "ags"
import Bar from "./widget/Bar"

app.start({
  css: scss,
  main(...args: Array<string>) {
    const monitors = createBinding(app, "monitors")

    console.log("\n")
    console.log(monitors.name)
    console.log("\n")

    return (
      <For each={monitors}>
        {(monitor) => {
          console.log(monitor.get_display())
          return (
            <This this={app}>
              <Bar gdkmonitor={monitor} />
            </This>
          )
        }}
      </For>
    )
  },
})
