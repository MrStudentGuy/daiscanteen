import { DateStrip } from "@/components/date-strip";
import { EmptyState } from "@/components/empty-state";
import { MenuSection } from "@/components/menu-section";
import { getTodayIsoDate, normalizeRequestedDate } from "@/lib/date-format";
import { getDailyMenu, getDateStripDates } from "@/lib/menu-data";

export default async function Home({
  searchParams
}: {
  searchParams?: Promise<{ date?: string }>;
}) {
  const params = (await searchParams) ?? {};
  const today = getTodayIsoDate();
  const selectedDate = normalizeRequestedDate(params.date, today);
  const [menuResult, stripDates] = await Promise.all([getDailyMenu(selectedDate), getDateStripDates(selectedDate)]);

  return (
    <main className="page-shell">
      <section className="page-header">
        <h1>DAIS Canteen Menu</h1>
      </section>

      <DateStrip selectedDate={selectedDate} today={today} dates={stripDates} />

      {menuResult.menu ? (
        <section className="menu-layout" aria-label="Daily menu sections">
          <MenuSection
            title="Breakfast"
            variant="breakfast"
            items={menuResult.menu.breakfastItems}
            accompaniments={menuResult.menu.breakfastAccompaniments}
            emptyMessage="Breakfast menu not listed for this day."
          />
          <MenuSection
            title="Lunch"
            variant="lunch"
            items={menuResult.menu.lunch}
            emptyMessage="Lunch menu not listed for this day."
          />
          <MenuSection
            title="Snacks"
            variant="list"
            items={menuResult.menu.eveningSnacks}
            emptyMessage="No snacks listed for this day."
          />
        </section>
      ) : (
        <EmptyState hasMonthFile={menuResult.hasMonthFile} />
      )}
    </main>
  );
}
