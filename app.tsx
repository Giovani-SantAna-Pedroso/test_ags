import app from "ags/gtk4/app"
import scss from "./style.scss"
import { createBinding, For, This } from "ags"
import Bar from "./widget/Bar"
import NotesBoard from "./widget/NotesBoard"

app.start({
  css: scss,
  main(...args: Array<string>) {
    const monitors = createBinding(app, "monitors")

    return (
      <For each={monitors}>
        {(monitor) => {
          return (
            <This this={app}>
              {/* <NotesBoard /> */}
              <Bar gdkmonitor={monitor} />
            </This>
          )
        }}
      </For>
    )
  },
})
