"use client";

import { useEffect, useState } from "react";
import { deleteAlertRule, listAlertRules, saveAlertRule, type AlertRule } from "@/features/alerts/alert-storage";

export function AlertRulesPanel() {
  const [rules, setRules] = useState<AlertRule[]>([]);
  const [targetId, setTargetId] = useState("btc");

  useEffect(() => {
    setRules(listAlertRules(window.localStorage));
  }, []);

  function createRule() {
    const rule: AlertRule = {
      id: crypto.randomUUID(),
      targetType: "coin",
      targetId,
      condition: "change_up",
      threshold: 5,
      period: "24h",
      enabled: true,
    };
    setRules(saveAlertRule(window.localStorage, rule));
  }

  return (
    <section className="rounded-lg border border-line bg-panel p-5 shadow-sm">
      <p className="text-xs font-black uppercase text-forest">Alert Rules</p>
      <h2 className="mt-2 text-3xl font-black text-ink">알림 준비 구조</h2>
      <p className="mt-3 text-sm leading-6 text-muted">실제 푸시 발송은 아직 구현하지 않았습니다. 조건 규칙만 이 브라우저에 저장합니다.</p>
      <div className="mt-4 flex flex-wrap gap-2">
        <select value={targetId} onChange={(event) => setTargetId(event.target.value)} className="rounded-md border border-line bg-paper px-3 py-2 text-sm font-bold text-ink">
          <option value="btc">BTC</option>
          <option value="eth">ETH</option>
          <option value="sol">SOL</option>
          <option value="defi_tvl">DeFi TVL</option>
        </select>
        <button type="button" onClick={createRule} className="rounded-md bg-ink px-4 py-2 text-sm font-black text-white">
          24시간 5% 상승 규칙 만들기
        </button>
      </div>
      <div className="mt-5 grid gap-2">
        {rules.length === 0 ? (
          <p className="rounded-md bg-paper p-4 text-sm text-muted">저장된 알림 규칙이 없습니다.</p>
        ) : (
          rules.map((rule) => (
            <div key={rule.id} className="flex items-center justify-between gap-3 rounded-md border border-line bg-paper p-3">
              <span className="text-sm font-black text-ink">
                {rule.targetId} · {rule.condition} · {rule.period} · {rule.enabled ? "켜짐" : "꺼짐"}
              </span>
              <button type="button" onClick={() => setRules(deleteAlertRule(window.localStorage, rule.id))} className="rounded-md border border-line bg-panel px-3 py-2 text-sm font-black text-danger">
                삭제
              </button>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
