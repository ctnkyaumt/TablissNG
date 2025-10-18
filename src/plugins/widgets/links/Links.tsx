import React, { FC, useMemo, useEffect } from "react";

import { useKeyPress, useToggle } from "../../../hooks";
import { Icon } from "@iconify/react";
import Display from "./Display";
import { Props, defaultData, defaultCache } from "./types";
import "./Links.sass";

const Links: FC<Props> = ({ data = defaultData, setData, cache = defaultCache }) => {
  const [visible, toggleVisible] = useToggle();

  // Ensure all links have unique IDs to prevent React key errors
  useEffect(() => {
    const linksWithIds = data.links.map((link, index) => {
      if (!link.id || data.links.filter(l => l.id === link.id).length > 1) {
        return {
          ...link,
          id: Date.now().toString(36) + Math.random().toString(36).slice(2) + index
        };
      }
      return link;
    });

    // Only update if we actually changed something
    if (JSON.stringify(linksWithIds) !== JSON.stringify(data.links)) {
      setData({ ...data, links: linksWithIds });
    }
  }, [data.links, setData]);

  const handleLinkClick = (id: string) => {
    const updatedLinks = [...data.links];
    const originalIndex = updatedLinks.findIndex(link => link.id === id);
    
    if (originalIndex !== -1) {
      updatedLinks[originalIndex] = {
        ...updatedLinks[originalIndex],
        lastUsed: Date.now()
      };
      setData({ ...data, links: updatedLinks });
    }
  };

  const sortedLinks = useMemo(() => {
    if (data.sortBy === 'none') return data.links;
    
    return [...data.links].sort((a, b) => {
      switch (data.sortBy) {
        case 'name':
          return (a.name || '').localeCompare(b.name || '');
        case 'icon':
          return (a.icon || '').localeCompare(b.icon || '');
        case 'lastUsed':
          const bTime = b.lastUsed || 0;
          const aTime = a.lastUsed || 0;
          return bTime - aTime; // Most recent first
        default:
          return 0;
      }
    });
  }, [data.links, data.sortBy]);

  useKeyPress(
    ({ key }) => {
      const index = Number(key) - 1;
      if (sortedLinks[index]) {
        data.linkOpenStyle
          ? window.open(sortedLinks[index].url, "_blank")
          : window.location.assign(sortedLinks[index].url);
      }
    },
    ["1", "2", "3", "4", "5", "6", "7", "8", "9"],
  );

  return (
    <div
      className="Links"
      style={{
        gridTemplateColumns:
          data.visible || visible ? "1fr ".repeat(data.columns) : "1fr",
        textAlign: data.columns > 1 ? "left" : "inherit",
      }}
    >
      {data.visible || visible ? (
        sortedLinks.map((link, index) => (
          <Display
            key={link.id}
            number={index + 1}
            linkOpenStyle={data.linkOpenStyle}
            linksNumbered={data.linksNumbered}
            customWidth={data.customWidth}
            customHeight={data.customHeight}
            showUnderlineOnHover={data.showUnderlineOnHover}
            cache={cache}
            onLinkClick={() => handleLinkClick(link.id)}
            {...link}
          />
        ))
      ) : (
        <a onClick={toggleVisible} title="Show quick links">
          <Icon icon="fe:insert-link" />
        </a>
      )}
    </div>
  );
};

export default Links;
