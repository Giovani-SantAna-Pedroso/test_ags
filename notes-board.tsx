// notes-board.tsx
// Widget de quadro de post-its para o AGS Shell (Astal + GTK4)
// Aparece automaticamente quando a workspace ativa está vazia

import { App, Astal, Gtk, Gdk } from "astal/gtk4";
import { Variable, bind } from "astal";
import Hyprland from "gi://AstalHyprland";
import {
  notes,
  addNote,
  updateNote,
  deleteNote,
  formatDate,
  type Note,
  type NoteColor,
  type Priority,
} from "./notes-service";

// ── Mapeamento de cores ──────────────────────────────────────────────────────

const COLOR_CSS: Record<NoteColor, string> = {
  yellow: "note-yellow",
  blue:   "note-blue",
  pink:   "note-pink",
  green:  "note-green",
  purple: "note-purple",
  orange: "note-orange",
};

const PRIO_LABELS: Record<Priority, string> = {
  high: "● alta",
  med:  "● média",
  low:  "● baixa",
};

const PRIO_CSS: Record<Priority, string> = {
  high: "prio-high",
  med:  "prio-med",
  low:  "prio-low",
};

// ── Diálogo de criar/editar nota ─────────────────────────────────────────────

function NoteDialog(opts: {
  note?: Note;
  onSave: (data: Omit<Note, "id" | "createdAt">) => void;
  onDelete?: () => void;
  onCancel: () => void;
}) {
  const title  = Variable(opts.note?.title    ?? "");
  const body   = Variable(opts.note?.body     ?? "");
  const color  = Variable<NoteColor>(opts.note?.color    ?? "yellow");
  const prio   = Variable<Priority>(opts.note?.priority ?? "low");

  const colorOptions: NoteColor[] = ["yellow", "blue", "pink", "green", "purple", "orange"];
  const prioOptions: Priority[]   = ["low", "med", "high"];
  const prioEmoji: Record<Priority, string> = { low: "🟢", med: "🟡", high: "🔴" };
  const colorEmoji: Record<NoteColor, string> = {
    yellow: "🟡", blue: "🔵", pink: "🩷", green: "🟢", purple: "🟣", orange: "🟠",
  };

  return (
    <box vertical cssClasses={["note-dialog"]} spacing={10}>
      <label
        label={opts.note ? "editar nota" : "nova nota"}
        cssClasses={["dialog-title"]}
        xalign={0}
      />

      {/* Campo título */}
      <entry
        text={bind(title)}
        placeholderText="título..."
        maxLength={60}
        onChanged={(self) => title.set(self.text)}
        cssClasses={["note-input"]}
      />

      {/* Campo conteúdo */}
      <scrolledwindow cssClasses={["note-scroll"]} vexpand={true}>
        <textview
          cssClasses={["note-textarea"]}
          wrapMode={Gtk.WrapMode.WORD_CHAR}
          onChanged={(self) => {
            const buf = self.buffer;
            body.set(buf.get_text(buf.get_start_iter(), buf.get_end_iter(), false));
          }}
          setup={(self) => {
            if (opts.note?.body) self.buffer.set_text(opts.note.body, -1);
          }}
        />
      </scrolledwindow>

      {/* Seletor de cor */}
      <box spacing={6}>
        {colorOptions.map((c) => (
          <button
            cssClasses={bind(color).as((cv) =>
              ["color-btn", COLOR_CSS[c], cv === c ? "selected" : ""].filter(Boolean)
            )}
            label={colorEmoji[c]}
            onClicked={() => color.set(c)}
            tooltipText={c}
          />
        ))}
      </box>

      {/* Seletor de prioridade */}
      <box spacing={6}>
        {prioOptions.map((p) => (
          <button
            cssClasses={bind(prio).as((pv) =>
              ["prio-btn", PRIO_CSS[p], pv === p ? "selected" : ""].filter(Boolean)
            )}
            label={`${prioEmoji[p]} ${PRIO_LABELS[p]}`}
            onClicked={() => prio.set(p)}
          />
        ))}
      </box>

      {/* Botões de ação */}
      <box spacing={8} halign={Gtk.Align.END}>
        {opts.onDelete && (
          <button
            cssClasses={["btn-delete"]}
            label="apagar"
            onClicked={() => opts.onDelete!()}
          />
        )}
        <button
          cssClasses={["btn-cancel"]}
          label="cancelar"
          onClicked={() => opts.onCancel()}
        />
        <button
          cssClasses={["btn-save"]}
          label="salvar"
          onClicked={() => {
            opts.onSave({
              title:    title.get().trim() || "sem título",
              body:     body.get().trim(),
              color:    color.get(),
              priority: prio.get(),
            });
          }}
        />
      </box>
    </box>
  );
}

// ── Card de nota individual ──────────────────────────────────────────────────

function NoteCard({ note, onEdit }: { note: Note; onEdit: (n: Note) => void }) {
  return (
    <button
      cssClasses={["note-card", COLOR_CSS[note.color]]}
      onClicked={() => onEdit(note)}
    >
      <box vertical spacing={6}>
        <label
          label={note.title}
          cssClasses={["note-card-title"]}
          xalign={0}
          ellipsize={3 /* PANGO_ELLIPSIZE_END */}
          maxWidthChars={28}
        />
        {note.body && (
          <label
            label={note.body}
            cssClasses={["note-card-body"]}
            xalign={0}
            wrap={true}
            maxWidthChars={28}
            lines={4}
            ellipsize={3}
          />
        )}
        <box>
          <label
            label={PRIO_LABELS[note.priority]}
            cssClasses={["note-card-prio", PRIO_CSS[note.priority]]}
            hexpand={true}
            xalign={0}
          />
          <label
            label={formatDate(note.createdAt)}
            cssClasses={["note-card-time"]}
            xalign={1}
          />
        </box>
      </box>
    </button>
  );
}

// ── Quadro principal ─────────────────────────────────────────────────────────

export function NotesBoard() {
  const editingNote = Variable<Note | null>(null);
  const showDialog  = Variable(false);
  const isAdding    = Variable(false);

  function openAdd() {
    editingNote.set(null);
    isAdding.set(true);
    showDialog.set(true);
  }

  function openEdit(note: Note) {
    editingNote.set(note);
    isAdding.set(false);
    showDialog.set(true);
  }

  function closeDialog() {
    showDialog.set(false);
    editingNote.set(null);
  }

  return (
    <box vertical cssClasses={["notes-board"]} spacing={0}>
      {/* Header */}
      <box cssClasses={["board-header"]} spacing={8}>
        <label
          label="quadro de avisos"
          cssClasses={["board-title"]}
          hexpand={true}
          xalign={0}
        />
        <label
          label={bind(notes).as((ns) => `${ns.length} nota${ns.length !== 1 ? "s" : ""}`)}
          cssClasses={["board-count"]}
        />
      </box>

      {/* Grid de notas */}
      <scrolledwindow vexpand={true} cssClasses={["board-scroll"]}>
        <box
          vertical={false}
          cssClasses={["notes-flow"]}
          setup={(self) => {
            // FlowBox para layout de grade responsivo
            const flow = new Gtk.FlowBox({
              maxChildrenPerLine: 4,
              minChildrenPerLine: 1,
              columnSpacing: 14,
              rowSpacing: 14,
              homogeneous: false,
              selectionMode: Gtk.SelectionMode.NONE,
            });
            flow.add_css_class("notes-grid");
            self.append(flow);

            // Re-renderiza quando as notas mudam
            bind(notes).subscribe((ns) => {
              // Limpa filhos existentes
              let child = flow.get_first_child();
              while (child) {
                const next = child.get_next_sibling();
                flow.remove(child);
                child = next;
              }

              // Adiciona novas notas
              ns.forEach((note) => {
                const card = NoteCard({ note, onEdit: openEdit });
                flow.append(card);
              });
            });
          }}
        />
      </scrolledwindow>

      {/* Botão de adicionar */}
      <box cssClasses={["board-footer"]}>
        <button
          cssClasses={["btn-add"]}
          label="+ nova nota"
          hexpand={false}
          onClicked={openAdd}
        />
      </box>

      {/* Overlay do diálogo */}
      {bind(showDialog).as((visible) =>
        visible ? (
          <box cssClasses={["dialog-overlay"]}>
            <NoteDialog
              note={editingNote.get() ?? undefined}
              onSave={(data) => {
                const editing = editingNote.get();
                if (editing) {
                  updateNote(editing.id, data);
                } else {
                  addNote(data);
                }
                closeDialog();
              }}
              onDelete={
                editingNote.get()
                  ? () => {
                      deleteNote(editingNote.get()!.id);
                      closeDialog();
                    }
                  : undefined
              }
              onCancel={closeDialog}
            />
          </box>
        ) : (
          <box />
        )
      )}
    </box>
  );
}

// ── Janela principal (aparece sobre a workspace vazia) ───────────────────────

export default function NotesWindow() {
  const hypr = Hyprland.get_default();

  // Detecta se a workspace ativa está vazia
  const workspaceEmpty = Variable.derive(
    [bind(hypr, "focusedWorkspace")],
    (ws) => {
      if (!ws) return false;
      return ws.get_clients().length === 0;
    }
  );

  return (
    <window
      name="notes-board"
      namespace="notes-board"
      anchor={
        Astal.WindowAnchor.TOP    |
        Astal.WindowAnchor.LEFT   |
        Astal.WindowAnchor.RIGHT  |
        Astal.WindowAnchor.BOTTOM
      }
      exclusivity={Astal.Exclusivity.IGNORE}
      layer={Astal.Layer.BACKGROUND}
      visible={bind(workspaceEmpty)}
      cssClasses={["notes-window"]}
    >
      <NotesBoard />
    </window>
  );
}
