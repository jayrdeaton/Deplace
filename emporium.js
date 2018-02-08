let Emporium = require('emporium');

let emporium = new Emporium('Deplace');

emporium.pretty();

let Schema = emporium.Schema;

let ShortcutSchema = new Schema('Shortcut', {
  createdAt: { type: Date, default: new Date },
  name: String,
  dir: String
});

ShortcutSchema.hide(['_id']);

emporium.add(ShortcutSchema);

let DirectorySchema = new Schema('Directory', {
  shortcut: String,
  path: String,
  commands: { type: Array, default: [] }
});

module.exports = emporium;
