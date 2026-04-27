type EmptyStateProps = {
  hasMonthFile: boolean;
};

export function EmptyState({ hasMonthFile }: EmptyStateProps) {
  return (
    <section className="empty-state">
      <h2>No menu for this date</h2>
      <p>
        {hasMonthFile
          ? "This date does not have a menu entry yet. Pick another date from the strip."
          : "The matching month file has not been added yet."}
      </p>
    </section>
  );
}
