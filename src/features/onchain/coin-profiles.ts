export interface CoinProfile {
  symbol: "btc" | "eth" | "sol";
  name: string;
  chainId: string;
  oneLine: string;
  problem: string;
  valueStructure: string;
  tokenRole: string;
  supplyStructure: string;
  networkActivity: string;
  marketPosition: string;
  competitors: string[];
  risks: string[];
  relatedLessons: string[];
}

export const coinProfiles: CoinProfile[] = [
  {
    symbol: "btc",
    name: "Bitcoin",
    chainId: "bitcoin",
    oneLine: "비트코인은 희소성과 검열 저항성을 중심으로 이해하는 디지털 가치 저장 네트워크입니다.",
    problem: "중앙 기관 없이 누구나 검증할 수 있는 가치 이전과 보관 문제를 다룹니다.",
    valueStructure: "제한된 공급량, 채굴 보안, 전 세계 노드의 검증 가능성에서 가치 논리가 만들어집니다.",
    tokenRole: "BTC는 네트워크의 기본 자산이며 가치 저장, 결제, 담보로 사용될 수 있습니다.",
    supplyStructure: "최대 공급량은 2,100만 BTC로 설계되어 있으며 반감기로 신규 발행 속도가 줄어듭니다.",
    networkActivity: "거래 수와 수수료는 네트워크 사용과 혼잡의 단서지만 사용자 수로 단정할 수 없습니다.",
    marketPosition: "비트코인은 암호화폐 시장의 기준 자산 역할을 하며 도미넌스 변화로 자금 집중도를 살펴볼 수 있습니다.",
    competitors: ["금", "현금성 자산", "다른 가치 저장형 디지털 자산"],
    risks: ["규제 변화", "채굴 집중", "수수료 급등", "보관 실수"],
    relatedLessons: ["bitcoin-ethereum", "money-flow"],
  },
  {
    symbol: "eth",
    name: "Ethereum",
    chainId: "ethereum",
    oneLine: "이더리움은 스마트 계약과 앱 생태계를 실행하는 범용 블록체인 네트워크입니다.",
    problem: "중앙 서버 없이 금융 앱과 디지털 소유권 프로그램을 실행하는 문제를 다룹니다.",
    valueStructure: "앱 사용, 수수료, 스테이킹 보안, 생태계 네트워크 효과가 가치 논리의 핵심입니다.",
    tokenRole: "ETH는 수수료 지불, 스테이킹, 담보, DeFi 활동의 기본 자산으로 쓰입니다.",
    supplyStructure: "발행과 소각 구조가 함께 작동하며 네트워크 사용량에 따라 공급 압력이 달라질 수 있습니다.",
    networkActivity: "수수료와 TVL은 생태계 활동을 보는 단서지만 가격 상승을 보장하지 않습니다.",
    marketPosition: "이더리움은 DeFi와 스마트 계약 생태계의 중심축으로 자주 비교됩니다.",
    competitors: ["Solana", "Layer 2 네트워크", "다른 스마트 계약 체인"],
    risks: ["확장성 경쟁", "스마트 계약 사고", "규제", "수수료 변동"],
    relatedLessons: ["bitcoin-ethereum", "tvl", "onchain-risk"],
  },
  {
    symbol: "sol",
    name: "Solana",
    chainId: "solana",
    oneLine: "솔라나는 빠른 처리와 낮은 수수료를 강조하는 고성능 스마트 계약 체인입니다.",
    problem: "많은 거래를 낮은 비용으로 처리하는 사용자 경험 문제를 다룹니다.",
    valueStructure: "빠른 처리량, 낮은 수수료, 앱 생태계 활동, 검증자 네트워크가 가치 논리를 만듭니다.",
    tokenRole: "SOL은 수수료 지불, 스테이킹, 네트워크 보안 참여에 사용됩니다.",
    supplyStructure: "스테이킹 보상과 유통량 변화가 있어 공급 일정을 함께 확인해야 합니다.",
    networkActivity: "거래 수가 많아도 체인 구조상 단순히 경제 활동이 더 크다고 볼 수는 없습니다.",
    marketPosition: "솔라나는 빠른 앱 경험을 원하는 DeFi, 결제, 소비자 앱 영역에서 주목받습니다.",
    competitors: ["Ethereum", "Layer 2 네트워크", "Aptos", "Sui"],
    risks: ["네트워크 안정성", "검증자 집중", "생태계 경쟁", "토큰 공급 압력"],
    relatedLessons: ["tvl", "tokenomics", "onchain-risk"],
  },
];

export function profileBySymbol(symbol: string) {
  return coinProfiles.find((profile) => profile.symbol === symbol.toLowerCase());
}
