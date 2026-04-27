"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";

import { formatCalendarDateParts } from "@/lib/date-format";

type DateStripProps = {
  selectedDate: string;
  today: string;
  dates: string[];
};

export function DateStrip({ selectedDate, today, dates }: DateStripProps) {
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const activeRef = useRef<HTMLAnchorElement | null>(null);
  const todayRef = useRef<HTMLAnchorElement | null>(null);
  const [showTodayButton, setShowTodayButton] = useState(false);

  const dateSet = useMemo(() => new Set(dates), [dates]);
  const todayHref = dateSet.has(today) ? `/?date=${today}` : "/";

  useEffect(() => {
    activeRef.current?.scrollIntoView({
      behavior: "auto",
      inline: "center",
      block: "nearest"
    });
  }, [selectedDate]);

  useEffect(() => {
    const container = scrollerRef.current;
    const todayNode = todayRef.current;

    if (!container || !todayNode) {
      setShowTodayButton(false);
      return;
    }

    const updateVisibility = () => {
      const containerRect = container.getBoundingClientRect();
      const todayRect = todayNode.getBoundingClientRect();
      const threshold = 40;
      const isVisible =
        todayRect.left >= containerRect.left + threshold &&
        todayRect.right <= containerRect.right - threshold;

      setShowTodayButton(!isVisible);
    };

    updateVisibility();
    container.addEventListener("scroll", updateVisibility, { passive: true });
    window.addEventListener("resize", updateVisibility);

    return () => {
      container.removeEventListener("scroll", updateVisibility);
      window.removeEventListener("resize", updateVisibility);
    };
  }, [today, dates]);

  return (
    <section className="date-strip-wrap">
      <nav className="date-strip" aria-label="Calendar dates">
        <div ref={scrollerRef} className="date-strip__scroller">
          {dates.map((date) => {
            const parts = formatCalendarDateParts(date);
            const isSelected = date === selectedDate;
            const isToday = date === today;

            return (
              <Link
                key={date}
                ref={(node) => {
                  if (isSelected) {
                    activeRef.current = node;
                  }

                  if (isToday) {
                    todayRef.current = node;
                  }
                }}
                className={`date-pill${isSelected ? " date-pill--selected" : ""}${isToday ? " date-pill--today" : ""}`}
                href={`/?date=${date}`}
                aria-current={isSelected ? "date" : undefined}
              >
                <span className="date-pill__weekday">{parts.weekday}</span>
                <strong className="date-pill__day">{parts.day}</strong>
                <span className="date-pill__month">{parts.month}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      <div className={`date-strip__actions${showTodayButton ? " date-strip__actions--visible" : ""}`}>
        <Link className="date-strip__today-link" href={todayHref}>
          Go to today
        </Link>
      </div>
    </section>
  );
}
