import type { MetricDefinition } from "@/server/providers/types";

export const chainDefinitions = [
  { id: "bitcoin", name: "Bitcoin", symbol: "BTC" },
  { id: "ethereum", name: "Ethereum", symbol: "ETH" },
  { id: "solana", name: "Solana", symbol: "SOL" },
];

export const metricDefinitions: MetricDefinition[] = [
  {
    id: "market_cap",
    name: "시가총액",
    description: "유통 중인 코인 가치의 합산 추정치입니다.",
    unit: "B USD",
    caveats: ["공급량 기준과 가격 출처에 따라 달라질 수 있습니다."],
  },
  {
    id: "active_addresses",
    name: "활성 주소",
    description: "특정 기간 동안 거래에 참여한 주소 수입니다.",
    unit: "addresses",
    caveats: ["주소 수는 실제 사용자 수와 다릅니다.", "거래소·봇·지갑 분할이 포함될 수 있습니다."],
  },
  {
    id: "transaction_count",
    name: "거래 수",
    description: "네트워크에 기록된 거래 건수입니다.",
    unit: "tx",
    caveats: ["체인마다 거래 구조가 달라 단순 비교가 어렵습니다."],
  },
  {
    id: "average_fee",
    name: "평균 수수료",
    description: "거래를 처리하기 위해 지불한 평균 비용입니다.",
    unit: "USD",
    caveats: ["수수료 급증은 사용 증가 또는 혼잡을 모두 의미할 수 있습니다."],
  },
  {
    id: "new_addresses",
    name: "신규 주소",
    description: "처음 활동한 주소 수입니다.",
    unit: "addresses",
    caveats: ["신규 주소가 신규 사용자를 뜻한다고 단정할 수 없습니다."],
  },
  {
    id: "exchange_inflow",
    name: "거래소 유입",
    description: "거래소 지갑으로 이동한 자금 추정치입니다.",
    unit: "USD",
    caveats: ["내부 지갑 이동일 수 있어 매도 압력으로 단정하지 않습니다."],
  },
  {
    id: "exchange_outflow",
    name: "거래소 유출",
    description: "거래소 지갑에서 외부로 이동한 자금 추정치입니다.",
    unit: "USD",
    caveats: ["장기 보관 또는 내부 이동일 수 있습니다."],
  },
  {
    id: "stablecoin_supply",
    name: "스테이블코인 공급",
    description: "체인 위에서 발행된 스테이블코인 규모입니다.",
    unit: "B USD",
    caveats: ["공급 증가는 대기 자금의 단서일 뿐 실제 매수세로 단정하지 않습니다."],
  },
  {
    id: "dex_volume",
    name: "DEX 거래량",
    description: "탈중앙 거래소에서 발생한 거래 규모입니다.",
    unit: "B USD",
    caveats: ["인센티브나 워시 트레이딩이 숫자를 왜곡할 수 있습니다."],
  },
  {
    id: "tvl",
    name: "TVL",
    description: "DeFi 프로토콜에 예치된 자산 가치입니다.",
    unit: "B USD",
    caveats: ["자산 가격 상승만으로 TVL이 늘 수 있습니다."],
  },
  {
    id: "bridge_net_inflow",
    name: "브리지 순유입",
    description: "다른 체인에서 들어온 자금과 나간 자금의 차이입니다.",
    unit: "B USD",
    caveats: ["브리지 집계 기준이 공급자마다 다릅니다."],
  },
];

export function metricDefinitionById(metricId: string) {
  return metricDefinitions.find((definition) => definition.id === metricId);
}
