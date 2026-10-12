"use strict";

import Adw from "gi://Adw";
import Gio from "gi://Gio";
import Gtk from "gi://Gtk";

import {
  ExtensionPreferences,
  gettext as _,
} from "resource:///org/gnome/Shell/Extensions/js/extensions/prefs.js";

export default class NextUpExtensionPreferences extends ExtensionPreferences {
  fillPreferencesWindow(window) {
    const settings = this.getSettings();

    const page = new Adw.PreferencesPage();
    const group = new Adw.PreferencesGroup();
    page.add(group);

    const panelRow = new Adw.ActionRow({ title: _("Panel to show indicator in") });
    group.add(panelRow);

    const dropdown = new Gtk.DropDown({
      model: Gtk.StringList.new([_("Left"), _("Center"), _("Right")]),
      valign: Gtk.Align.CENTER,
    });

    settings.bind(
      "which-panel",
      dropdown,
      "selected",
      Gio.SettingsBindFlags.DEFAULT
    );

    panelRow.add_suffix(dropdown);
    panelRow.activatable_widget = dropdown;

    const textRow = new Adw.ActionRow({
      title: _("Show current event in indicator text"),
    });
    group.add(textRow);

    const textDropdown = new Gtk.DropDown({
      model: Gtk.StringList.new([_("Don't show (old)"), _("Show"), _("Custom")]),
      valign: Gtk.Align.CENTER,
    });

    settings.bind(
      "text-format",
      textDropdown,
      "selected",
      Gio.SettingsBindFlags.DEFAULT
    );

    textRow.add_suffix(textDropdown);
    textRow.activatable_widget = textDropdown;

    const allDayRow = new Adw.SwitchRow({
      title: _("Show all-day events"),
      subtitle: _("Include events without a specific time"),
    });
    group.add(allDayRow);

    settings.bind(
      "show-all-day-events",
      allDayRow,
      "active",
      Gio.SettingsBindFlags.DEFAULT
    );

    const customGroup = new Adw.PreferencesGroup({
      title: _("Custom format"),
      description: _(
        "Placeholders: {current}, {ends_in}, {next}, {next_time}, {starts_in}"
      ),
    });
    page.add(customGroup);

    for (const [key, title] of [
      ["custom-format-current-next", _("During an event, with one up next")],
      ["custom-format-current", _("During the last event of the day")],
      ["custom-format-next", _("Before the next event")],
      ["custom-format-none", _("No more events today")],
    ]) {
      const row = new Adw.EntryRow({ title, show_apply_button: true });
      customGroup.add(row);
      settings.bind(key, row, "text", Gio.SettingsBindFlags.DEFAULT);
    }

    const updateCustomGroupVisibility = () => {
      customGroup.visible = settings.get_int("text-format") === 2;
    };
    settings.connect("changed::text-format", updateCustomGroupVisibility);
    updateCustomGroupVisibility();

    window.add(page);
  }
}
