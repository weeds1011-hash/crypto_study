import { AlertRulesPanel } from "@/components/alerts/AlertRulesPanel";
import { WatchlistPanel } from "@/components/watchlist/WatchlistPanel";
import { alertsMetadata } from "./metadata";

export const metadata = alertsMetadata;

export default function AlertsPage() {
  return (
    <main className="mx-auto max-w-5xl space-y-8 px-4 py-10">
      <section>
        <p className="text-xs font-black uppercase text-forest">Personal Layer</p>
        <h1 className="mt-2 text-4xl font-black text-ink">관심 목록과 알림 준비</h1>
        <p className="mt-3 text-sm leading-6 text-muted">
          이 단계에서는 로그인과 실제 푸시 알림 없이 localStorage 기반으로 관심 항목과 알림 규칙만 저장합니다.
        </p>
      </section>
      <WatchlistPanel />
      <AlertRulesPanel />
    </main>
  );
}
