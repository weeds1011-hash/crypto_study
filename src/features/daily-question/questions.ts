import type { Lesson, MetricSnapshot } from "@/types";

export interface DailyQuestion {
  id: string;
  title: string;
  shortAnswer: string;
  relatedMetricIds: string[];
  explanationBlocks: string[];
  counterExample: string;
  caution: string;
  relatedLessonIds: string[];
  quiz: {
    question: string;
    options: string[];
    answerIndex: number;
    explanation: string;
  };
}

interface DailyQuestionTemplate {
  id: string;
  requiredMetricIds: string[];
  title: string;
  shortAnswer: string;
  explanationBlocks: string[];
  counterExample: string;
  caution: string;
  relatedLessonIds: string[];
}

const templates: DailyQuestionTemplate[] = [
  {
    id: "stablecoin-price",
    requiredMetricIds: ["stablecoin_supply"],
    title: "스테이블코인 공급이 늘면 반드시 코인 가격이 오를까?",
    shortAnswer: "아닙니다. 공급 증가는 대기 자금의 단서일 수 있지만 실제 매수로 이어졌는지는 따로 확인해야 합니다.",
    explanationBlocks: ["스테이블코인은 시장 안에서 현금처럼 움직입니다.", "공급량 증가가 거래소 유입, 시장 총액 증가, DeFi 활동과 함께 나타나는지 봐야 합니다."],
    counterExample: "발행량은 늘었지만 거래소 밖에 머물거나 특정 체인 이동만 있었을 수 있습니다.",
    caution: "단일 지표로 가격 방향을 단정하지 않습니다.",
    relatedLessonIds: ["stablecoins"],
  },
  {
    id: "tvl-token-price",
    requiredMetricIds: ["defi_tvl"],
    title: "TVL이 늘면 정말 좋은 신호일까?",
    shortAnswer: "항상 그렇지는 않습니다. 자산 가격 상승만으로 TVL이 늘 수도 있습니다.",
    explanationBlocks: ["TVL은 디파이에 예치된 자산 가치입니다.", "실제 사용 증가인지, 토큰 가격 상승 효과인지 구분해야 합니다."],
    counterExample: "예치 수량은 그대로인데 토큰 가격만 올라 TVL이 커질 수 있습니다.",
    caution: "거래량, 수수료, 사용자 수와 함께 봐야 합니다.",
    relatedLessonIds: ["tvl"],
  },
  {
    id: "dominance-altcoins",
    requiredMetricIds: ["btc_dominance"],
    title: "비트코인 도미넌스가 오르면 알트코인은 반드시 약할까?",
    shortAnswer: "반드시 그렇지는 않습니다. 전체 시장이 동시에 오르거나 내릴 때 도미넌스 해석은 달라집니다.",
    explanationBlocks: ["도미넌스는 전체 시장에서 비트코인의 비중입니다.", "비트코인이 상대적으로 강한지, 알트코인이 약한지, 전체 시장 상황을 함께 봐야 합니다."],
    counterExample: "전체 시장이 상승하면서 비트코인도 알트코인도 함께 오를 수 있습니다.",
    caution: "도미넌스와 전체 시가총액을 함께 확인하세요.",
    relatedLessonIds: ["bitcoin-ethereum"],
  },
];

export function selectDailyQuestion(metrics: MetricSnapshot[], lessons: Lesson[]): DailyQuestion {
  const metricIds = new Set(metrics.filter((metric) => metric.dataStatus !== "missing").map((metric) => metric.metricId));
  const template = templates.find((item) => item.requiredMetricIds.every((id) => metricIds.has(id))) ?? {
    id: "basic-flow",
    requiredMetricIds: [],
    title: "암호화폐 시장을 볼 때 왜 돈의 흐름을 먼저 봐야 할까?",
    shortAnswer: "가격만 보면 이유를 놓치기 쉽기 때문입니다. 유동성, 스테이블코인, 도미넌스, TVL을 함께 보면 시장의 배경을 더 잘 이해할 수 있습니다.",
    explanationBlocks: ["돈의 흐름은 확정된 사실이 아니라 여러 지표를 조합한 추정입니다.", "데이터가 부족하면 판단 보류라고 표시하는 태도가 중요합니다."],
    counterExample: "가격이 올라도 거래량이나 유동성이 약하면 흐름이 오래 지속되지 않을 수 있습니다.",
    caution: "이 질문은 학습용이며 매수·매도 판단으로 사용하지 않습니다.",
    relatedLessonIds: ["what-is-money", "what-is-crypto"],
  };
  const relatedLessons = template.relatedLessonIds.filter((slug) => lessons.some((lesson) => lesson.slug === slug));

  return {
    id: template.id,
    title: template.title,
    shortAnswer: template.shortAnswer,
    relatedMetricIds: template.requiredMetricIds,
    explanationBlocks: template.explanationBlocks,
    counterExample: template.counterExample,
    caution: template.caution,
    relatedLessonIds: relatedLessons,
    quiz: {
      question: "이 질문을 해석할 때 가장 안전한 태도는?",
      options: ["여러 지표와 반대 사례를 함께 본다", "하나의 지표만 믿는다", "가격 방향을 확정한다", "데이터 없음은 0으로 본다"],
      answerIndex: 0,
      explanation: "시장 질문은 여러 지표, 반대 신호, 데이터 부족 상태를 함께 봐야 합니다.",
    },
  };
}
