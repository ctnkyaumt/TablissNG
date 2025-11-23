import React, { useState, useEffect } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { UiContext } from "../../contexts/ui";
import { exportStore, importStore, resetStore } from "../../db/action";
import { useKeyPress } from "../../hooks";
import { Icon } from "@iconify/react";
import Logo from "../shared/Logo";
import Background from "./Background";
import Persist from "./Persist";
import "./Settings.sass";
import System from "./System";
import Widgets from "./Widgets";
import { db } from "../../db/state";
import { useKey } from "../../lib/db/react";
import { useTheme } from "../../hooks";

const Settings: React.FC = () => {
  const { toggleSettings } = React.useContext(UiContext);
  const [settingsIconPosition] = useKey(db, "settingsIconPosition");
  const [autoHideSettings] = useKey(db, "autoHideSettings");
  const { isDark } = useTheme();
  const intl = useIntl();
  const [isHovered, setIsHovered] = useState(true);

  const settingsOnRight =
    settingsIconPosition === "bottomRight" ||
    settingsIconPosition === "topRight";

  useEffect(() => {
    setIsHovered(true);
  }, [toggleSettings]);

  const handleReset = () => {
    if (
      confirm(
        intl.formatMessage({
          id: "settings.reset.confirm",
          defaultMessage: "Are you sure you want to delete all of your TablissNG settings? This cannot be undone.",
          description: "Confirmation message when resetting settings"
        })
      )
    )
      resetStore();
  };

  const handleExport = () => {
    const json = exportStore();
    const url = URL.createObjectURL(
      new Blob([json], { type: "application/json" }),
    );

    const a = document.createElement("a");
    document.body.appendChild(a);
    a.style.display = "none";
    a.href = url;
    a.download = "tablissng.json";
    a.download = "tablissng.json";
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  const handleImport = () => {
    const input = document.createElement("input");
    document.body.appendChild(input);
    input.style.display = "none";
    input.type = "file";
    input.addEventListener("change", function () {
      if (this.files) {
        const file = this.files[0];
        const reader = new FileReader();
        reader.addEventListener("load", (event) => {
          if (event.target && event.target.result) {
            try {
              const state = JSON.parse(event.target.result as string);
              importStore(state);
            } catch (error) {
              alert(
                `Invalid import file: ${
                  error instanceof Error ? error.message : "Unknown error"
                }`,
              );
            }
          }
        });
        reader.readAsText(file);
      }
      document.body.removeChild(input);
    });
    input.click();
  };

  useKeyPress(toggleSettings, ["Escape"]);

  return (
    <div className="Settings">
      <a onClick={toggleSettings} className="fullscreen" />

      {autoHideSettings && (
        <div
          className="settings-hover-area"
          style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            width: '330px',
            left: settingsOnRight ? 'auto' : 0,
            right: settingsOnRight ? 0 : 'auto',
            borderRadius: settingsOnRight ? "1rem 0 0 1rem" : "0 1rem 1rem 0",
            background: isDark ? 'rgba(45, 45, 45, 0.25)' : 'rgba(0, 0, 0, 0.25)',
            transition: 'background 0.3s ease'
          }}
          onMouseEnter={() => setIsHovered(true)}
        />
      )}

      <div
        className="plane"
        style={{
          left: settingsOnRight ? "auto" : 0,
          right: settingsOnRight ? 0 : "auto",
          borderRadius: settingsOnRight ? "1rem 0 0 1rem" : "0 1rem 1rem 0",
          opacity: !autoHideSettings || isHovered ? 1 : 0,
          visibility: !autoHideSettings || isHovered ? "visible" : "hidden",
          transition: "opacity 0.3s ease, visibility 0.3s ease"
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Logo />
        <Background />
        <Widgets />
        <System />
        <p style={{ marginTop: "1.25rem", marginBottom: "2rem" }}>
          <a onClick={handleImport}>
            <FormattedMessage
              id="settings.import"
              defaultMessage="Import"
              description="Import title"
            />
          </a>
          ,{" "}
          <a onClick={handleExport}>
            <FormattedMessage
              id="settings.export"
              defaultMessage="export"
              description="Export title"
            />
          </a>{" "}
          <FormattedMessage
            id="settings.or"
            defaultMessage="or"
            description="your settings title"
          />{" "}
          <a onClick={handleReset}>
            <FormattedMessage
              id="settings.reset"
              defaultMessage="reset"
              description="Reset title"
            />
          </a>{" "}
          <FormattedMessage
            id="settings.description"
            defaultMessage="your settings"
            description="your settings title"
          />
        </p>
        <Persist />
        <FormattedMessage
          id="settings.translationCredits"
          description="Give yourself some credit :)"
          defaultMessage=" "
          tagName="p"
        />
        <div
          style={{
            textAlign: "center",
            marginTop: "2rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.5rem",
          }}
        >
          <span
            style={{
              background: isDark ? "#2d2d2d" : "#f0f0f0",
              padding: "0.3rem 0.8rem",
              borderRadius: "1rem",
              fontSize: "0.9rem",
              color: isDark ? "#e0e0e0" : "#666",
              fontWeight: 500,
              display: "inline-flex",
              alignItems: "center",
              gap: "0.3rem",
            }}
          >
            <Icon icon="feather:tag" style={{ fontSize: "0.9em" }} />
            TablissNG v{VERSION} {DEV ? "DEV " : ""}
          </span>
        </div>
      </div>
    </div>
  );
};

export default React.memo(Settings);
