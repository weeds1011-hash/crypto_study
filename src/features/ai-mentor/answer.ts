import type { RetrievedContext } from "./retrieval";
import { formatMetricValue } from "@/lib/formatters/numbers";

export interface MentorAnswer {
  question: string;
  summary: string[];
  evidenceData: string[];
  relatedNews: string[];
  relatedLessons: Array<{ title: string; href: string }>;
  glossary: string[];
  cautions: string[];
}

const blockedAdviceTerms = ["사도", "사야", "매수", "매도", "팔아", "수익", "목표가", "가격 예측", "오를까", "내릴까"];
const educationalIntentTerms = ["뜻", "용어", "개념", "정의", "무슨 말"];

export function buildMentorAnswer(question: string, context: RetrievedContext): MentorAnswer {
  const investmentIntent = isInvestmentIntent(question);
  const evidenceMetrics = context.metrics.filter((metric) => metric.dataStatus === "live" || metric.dataStatus === "mixed");
  const strongestMetric = evidenceMetrics.find((metric) => metric.value != null);
  const firstLesson = context.lessons[0];
  const firstCoin = context.coins[0];

  return {
    question,
    summary: [
      investmentIntent ? "투자 판단이나 가격 예측은 제공하지 않고, 학습 관점의 근거만 정리합니다." : "앱에 연결된 데이터와 학습 콘텐츠 안에서만 답변합니다.",
      strongestMetric
        ? `${strongestMetric.label}은 현재 ${strongestMetric.dataStatus} 상태이며 출처는 ${strongestMetric.sourceId}입니다.`
        : "질문과 직접 연결되는 실시간 근거가 부족해 판단을 제한합니다.",
      context.hasDirectResults && firstLesson ? `먼저 연결해서 볼 수 있는 학습 주제는 "${firstLesson.title}"입니다.` : firstCoin ? `${firstCoin.name}의 구조와 한계를 함께 봐야 합니다.` : "관련 자료 부족: 앱 안에서 직접 연결되는 자료가 적습니다.",
    ],
    evidenceData:
      evidenceMetrics.length > 0
        ? evidenceMetrics.map((metric) => {
            const limitation = metric.dataStatus === "mixed" ? " · 한계: 일부 필드는 실시간이 아니거나 비어 있습니다." : "";
            return `${metric.label}: ${formatMetricValue(metric.value, metric.unit)} · 상태 ${metric.dataStatus} · 관련도 ${context.metricScores[metric.metricId] ?? 0} · 출처 ${metric.sourceId}${limitation}`;
          })
        : ["실시간 근거로 사용할 live 또는 mixed 지표가 없습니다. mock/missing 데이터는 실시간 근거로 사용하지 않습니다."],
    relatedNews:
      context.news.length > 0
        ? context.news.map((item) => `${item.title} · ${item.source} · 관련도 ${context.newsScores[item.id] ?? 0} · 경로: ${item.impactPath.join(" -> ")} · 뉴스와 가격의 인과관계는 단정하지 않습니다.`)
        : ["관련 뉴스가 없거나 뉴스 공급자가 실패했습니다."],
    relatedLessons: context.lessons.map((lesson) => ({ title: lesson.title, href: `/learn/${lesson.slug}` })),
    glossary:
      context.terms.length > 0
        ? context.terms.map((term) => `${term.term}: ${term.oneLineDefinition}`)
        : ["질문에서 바로 연결된 용어가 적습니다. 용어사전에서 추가로 확인할 수 있습니다."],
    cautions: [
      "이 답변은 학습용이며 투자 추천이 아닙니다.",
      "뉴스와 가격 변화를 인과관계로 단정하지 않습니다.",
      "앱에 없는 수치나 사실은 생성하지 않습니다.",
      "데이터가 missing 또는 mixed이면 판단을 보류하거나 낮은 신뢰도로 봅니다.",
    ],
  };
}

export function isInvestmentIntent(question: string) {
  const normalized = question.toLowerCase();
  const educationalIntent = educationalIntentTerms.some((term) => normalized.includes(term));
  if (educationalIntent) return false;
  return blockedAdviceTerms.some((term) => normalized.includes(term));
}

export function answerContainsForbiddenAdvice(answer: MentorAnswer) {
  const text = [...answer.summary, ...answer.evidenceData, ...answer.relatedNews, ...answer.glossary, ...answer.cautions].join(" ");
  return ["매수하세요", "매도하세요", "가격 상승 가능성이 높습니다", "목표가"].some((term) => text.includes(term));
}
