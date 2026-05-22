import AstalMpris from "gi://AstalMpris"
import Gtk from "gi://Gtk?version=4.0"
import Gdk from "gi://Gdk?version=4.0"
import { For, With, createBinding } from "ags"

export default function Mpris() {
  const mpris = AstalMpris.get_default()
  const players = createBinding(mpris, "players")
  const maxSongTitleLenght = 20

  return (
    <box>
      <For each={players}>
        {(player) => {
          console.log(player.title)
          return (
            <box spacing={4}>
              {/* <box overflow={Gtk.Overflow.HIDDEN} css="border-radius: 8px;"> */}
              {/*   <image */}
              {/*     pixelSize={16} */}
              {/*     file={createBinding(player, "coverArt")} */}
              {/*   /> */}
              {/* </box> */}

              <box
                valign={Gtk.Align.CENTER}
                orientation={Gtk.Orientation.HORIZONTAL}
              >
                {/* <label xalign={0} label={createBinding(player, "artist")} /> */}
                {/* <label xalign={0} label={" => "} /> */}
                <label label={createBinding(player, "title")} />
              </box>

              {/* <box hexpand halign={Gtk.Align.END}> */}
              {/*   <button */}
              {/*     onClicked={() => player.previous()} */}
              {/*     visible={createBinding(player, "canGoPrevious")} */}
              {/*   > */}
              {/*     <image iconName="media-seek-backward-symbolic" /> */}
              {/*   </button> */}
              {/*   <button */}
              {/*     onClicked={() => player.play_pause()} */}
              {/*     visible={createBinding(player, "canControl")} */}
              {/*   > */}
              {/*     <box> */}
              {/*       <image */}
              {/*         iconName="media-playback-start-symbolic" */}
              {/*         visible={createBinding( */}
              {/*           player, */}
              {/*           "playbackStatus", */}
              {/*         )((s) => s === AstalMpris.PlaybackStatus.PLAYING)} */}
              {/*       /> */}
              {/*       <image */}
              {/*         iconName="media-playback-pause-symbolic" */}
              {/*         visible={createBinding( */}
              {/*           player, */}
              {/*           "playbackStatus", */}
              {/*         )((s) => s !== AstalMpris.PlaybackStatus.PLAYING)} */}
              {/*       /> */}
              {/*     </box> */}
              {/*   </button> */}
              {/*   <button */}
              {/*     onClicked={() => player.next()} */}
              {/*     visible={createBinding(player, "canGoNext")} */}
              {/*   > */}
              {/*     <image iconName="media-seek-forward-symbolic" /> */}
              {/*   </button> */}
              {/* </box> */}
            </box>
          )
        }}
      </For>
    </box>
  )
}
