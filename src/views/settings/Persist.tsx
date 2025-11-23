import React from "react";
import { FormattedMessage } from "react-intl";

const Persist: React.FC = () => {
  const [error, setError] = React.useState(false);
  const [persisted, setPersisted] = React.useState(true);
  const [busy, setBusy] = React.useState(false);

  React.useEffect(() => {
    if (navigator.storage) navigator.storage.persisted().then(setPersisted);
  }, []);

  if (BUILD_TARGET !== "web" || persisted) return null;

  const handleClick = async () => {
    setError(false);
    if (!navigator.storage || !("persist" in navigator.storage)) {
      setError(true);
      return;
    }
    try {
      setBusy(true);
      const granted = await navigator.storage.persist();
      if (granted) setPersisted(true);
      else setError(true);
    } catch (_) {
      setError(true);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="Widget" style={{ textAlign: "center" }}>
      <h4><FormattedMessage
          id="settings.persist.title"
          defaultMessage="Persist Settings"
          description="Persist Settings title"
        /></h4>
      <p>
      <FormattedMessage
          id="settings.persist.description"
          defaultMessage="Would you like Tabliss to ask your browser to save your setting
          permanently?"
          description="Persist Settings description"
        />
        
      </p>
      {error ? (
        <p><FormattedMessage
        id="settings.persist.error"
        defaultMessage="Could not persist settings at this time."
        description="Persist Settings error"
      /></p>
      ) : (
        <button className="button button--primary" onClick={handleClick} disabled={busy}>
          <FormattedMessage
          id="settings.persist.button"
          defaultMessage="Persist Settings"
          description="Persist Settings button"
        />
        </button>
      )}
    </div>
  );
};

export default Persist;
