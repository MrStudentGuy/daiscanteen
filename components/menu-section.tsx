import type { NormalizedLunchField } from "@/types/menu";

type MenuSectionProps =
  | {
      title: string;
      variant: "list";
      items: string[];
      emptyMessage: string;
    }
  | {
      title: string;
      variant: "breakfast";
      items: string[];
      accompaniments: string[];
      emptyMessage: string;
    }
  | {
      title: string;
      variant: "lunch";
      items: NormalizedLunchField[];
      emptyMessage: string;
    };

function splitDisplayParts(value: string): string[] {
  return value
    .split("/")
    .map((part) => part.trim())
    .filter(Boolean);
}

function RenderValue({ value }: { value: string }) {
  const parts = splitDisplayParts(value);

  if (parts.length <= 1) {
    return <>{value}</>;
  }

  return (
    <ul className="menu-section__inline-list">
      {parts.map((part) => (
        <li key={part}>{part}</li>
      ))}
    </ul>
  );
}

export function MenuSection(props: MenuSectionProps) {
  return (
    <section className="menu-section">
      <div className="menu-section__header">
        <h2>{props.title}</h2>
      </div>

      {props.variant === "breakfast" ? (
        props.items.length > 0 || props.accompaniments.length > 0 ? (
          <div className="menu-section__stack">
            {props.items.length > 0 ? (
              <ul className="menu-section__list">
                {props.items.map((item) => (
                  <li key={item}>
                    <RenderValue value={item} />
                  </li>
                ))}
              </ul>
            ) : (
              <p className="menu-section__empty">{props.emptyMessage}</p>
            )}

            <section className="menu-subsection" aria-label="Breakfast accompaniments">
              <h3>Accompaniments</h3>
              {props.accompaniments.length > 0 ? (
                <ul className="menu-section__list menu-section__list--subtle">
                  {props.accompaniments.map((item) => (
                    <li key={item}>
                      <RenderValue value={item} />
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="menu-section__empty">No accompaniments listed.</p>
              )}
            </section>
          </div>
        ) : (
          <p className="menu-section__empty">{props.emptyMessage}</p>
        )
      ) : props.variant === "list" ? (
        props.items.length > 0 ? (
          <ul className="menu-section__list">
            {props.items.map((item) => (
              <li key={item}>
                <RenderValue value={item} />
              </li>
            ))}
          </ul>
        ) : (
          <p className="menu-section__empty">{props.emptyMessage}</p>
        )
      ) : props.items.some((item) => item.value) ? (
        <dl className="menu-section__grid">
          {props.items.map((item) =>
            item.value ? (
              <div key={item.key} className="menu-section__row">
                <dt>{item.label}</dt>
                <dd>
                  <RenderValue value={item.value} />
                </dd>
              </div>
            ) : null
          )}
        </dl>
      ) : (
        <p className="menu-section__empty">{props.emptyMessage}</p>
      )}
    </section>
  );
}
