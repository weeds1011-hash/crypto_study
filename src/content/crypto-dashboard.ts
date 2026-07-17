export type CryptoExample = {
  name: string;
  ticker?: string;
  role: string;
};

export type CryptoSubCategory = {
  name: string;
  plainExplanation: string;
  examples: CryptoExample[];
  watchPoints: string[];
};

export type CryptoCategory = {
  id: string;
  majorCategory: string;
  beginnerDefinition: string;
  whatItDoes: string;
  subCategories: CryptoSubCategory[];
  moneyFlowRole: string;
  commonMisunderstanding: string;
};

export type EconomicRelationship = {
  id: string;
  title: string;
  simpleQuestion: string;
  plainExplanation: string;
  whenRising: string;
  whenFalling: string;
  cryptoConnection: string;
  caution: string;
};

export type ClassificationRule = {
  title: string;
  simpleDefinition: string;
  beginnerExample: string;
  whyItMatters: string;
};

export type LearningStep = {
  title: string;
  description: string;
};

export const cryptoCategories: CryptoCategory[] = [
  {
    id: "store-of-value-payment",
    majorCategory: "가치저장·결제형 코인",
    beginnerDefinition: "네트워크 자체의 기본 돈처럼 쓰이거나, 가치 저장 수단이라는 이야기를 중심으로 이해되는 암호화폐입니다.",
    whatItDoes: "송금, 결제, 장기 보관, 기준 자산 역할을 설명할 때 먼저 등장합니다.",
    moneyFlowRole: "시장에 새 돈이 들어올 때 가장 먼저 기준점으로 비교되는 영역입니다. 위험을 줄이려는 흐름에서는 알트코인보다 이쪽으로 돈이 모일 수 있습니다.",
    commonMisunderstanding: "결제형이라고 해서 항상 일상 결제에 널리 쓰인다는 뜻은 아닙니다. 실제 사용처와 시장에서의 상징적 역할을 나누어 봐야 합니다.",
    subCategories: [
      {
        name: "디지털 가치저장",
        plainExplanation: "공급량, 보안성, 검열 저항성을 이유로 디지털 금처럼 설명되는 유형입니다.",
        examples: [{ name: "Bitcoin", ticker: "BTC", role: "가장 대표적인 가치저장형 네이티브 코인" }],
        watchPoints: ["공급량 규칙", "채굴과 보안 비용", "시장 전체 기준 자산 역할"],
      },
      {
        name: "송금·결제 네트워크",
        plainExplanation: "빠른 이동과 낮은 비용을 강조하지만, 실제 채택 정도는 프로젝트마다 크게 다릅니다.",
        examples: [
          { name: "XRP Ledger", ticker: "XRP", role: "송금 네트워크 사례" },
          { name: "Litecoin", ticker: "LTC", role: "초기 결제형 코인 사례" },
        ],
        watchPoints: ["실제 사용량", "중앙화 논쟁", "규제와 파트너십 의존도"],
      },
    ],
  },
  {
    id: "layer-1",
    majorCategory: "Layer 1 스마트 계약 플랫폼",
    beginnerDefinition: "앱과 토큰이 올라가는 기본 블록체인입니다. 운영체제나 도시의 도로망처럼 생각하면 쉽습니다.",
    whatItDoes: "DeFi, NFT, 게임, 토큰 발행, 스마트 계약 실행의 기반이 됩니다.",
    moneyFlowRole: "생태계 활동이 늘면 네이티브 코인, 앱 토큰, 수수료 수요가 함께 관찰됩니다.",
    commonMisunderstanding: "체인이 유명하다고 그 위의 모든 앱이 안전하거나 성공한다는 뜻은 아닙니다.",
    subCategories: [
      {
        name: "범용 스마트 계약 체인",
        plainExplanation: "다양한 앱을 실행하는 가장 넓은 의미의 블록체인 플랫폼입니다.",
        examples: [
          { name: "Ethereum", ticker: "ETH", role: "스마트 계약 생태계의 대표 플랫폼" },
          { name: "Solana", ticker: "SOL", role: "빠른 처리와 낮은 수수료를 강조하는 플랫폼" },
        ],
        watchPoints: ["수수료", "활성 주소", "앱 생태계", "검증자 구조"],
      },
      {
        name: "대체 Layer 1",
        plainExplanation: "성능, 거버넌스, 개발 방식에서 다른 선택을 한 기반 체인입니다.",
        examples: [
          { name: "Cardano", ticker: "ADA", role: "연구 중심 개발 방식을 강조하는 체인" },
          { name: "Avalanche", ticker: "AVAX", role: "서브넷 구조를 강조하는 체인" },
        ],
        watchPoints: ["개발자 활동", "앱 수요", "브릿지 의존도"],
      },
    ],
  },
  {
    id: "layer-2",
    majorCategory: "Layer 2·확장 네트워크",
    beginnerDefinition: "기본 체인 위에서 거래를 더 빠르고 싸게 처리하려는 보조 네트워크입니다.",
    whatItDoes: "Ethereum 같은 Layer 1의 혼잡과 수수료 문제를 줄이는 역할을 합니다.",
    moneyFlowRole: "사용자가 앱을 더 자주 쓰기 시작하면 Layer 2 거래량과 수수료, 브릿지 이동이 함께 늘 수 있습니다.",
    commonMisunderstanding: "Layer 2가 Layer 1을 대체한다기보다, 보통 Layer 1의 보안과 생태계를 활용해 확장합니다.",
    subCategories: [
      {
        name: "롤업",
        plainExplanation: "여러 거래를 묶어서 Layer 1에 요약 제출하는 확장 방식입니다.",
        examples: [
          { name: "Arbitrum", ticker: "ARB", role: "Optimistic Rollup 사례" },
          { name: "Optimism", ticker: "OP", role: "Optimistic Rollup 사례" },
        ],
        watchPoints: ["브릿지 안전성", "중앙화된 운영 단계", "거래량과 수수료"],
      },
      {
        name: "확장 생태계",
        plainExplanation: "여러 확장 구조와 앱 생태계를 함께 제공하는 네트워크입니다.",
        examples: [{ name: "Polygon", ticker: "POL", role: "Ethereum 확장 생태계 사례" }],
        watchPoints: ["기술 구조 차이", "파트너십", "실제 온체인 사용"],
      },
    ],
  },
  {
    id: "stablecoins",
    majorCategory: "스테이블코인",
    beginnerDefinition: "달러 같은 법정화폐 가치에 가깝게 움직이도록 설계된 토큰입니다.",
    whatItDoes: "거래소 대기 자금, DeFi 담보, 해외 송금, 온체인 달러 역할을 합니다.",
    moneyFlowRole: "스테이블코인 공급은 암호화폐 시장 안에 머무는 대기 자금의 크기를 볼 때 자주 사용됩니다.",
    commonMisunderstanding: "스테이블코인 공급 증가가 곧바로 매수세라는 뜻은 아닙니다. 대기, 결제, DeFi 담보 등 여러 이유가 있습니다.",
    subCategories: [
      {
        name: "법정화폐 담보형",
        plainExplanation: "발행사가 달러나 현금성 자산을 보유하고 토큰을 발행하는 방식입니다.",
        examples: [
          { name: "Tether", ticker: "USDT", role: "가장 큰 달러 연동 스테이블코인 중 하나" },
          { name: "USD Coin", ticker: "USDC", role: "규제와 준비금 공개를 강조하는 사례" },
        ],
        watchPoints: ["준비금 구성", "발행사 신뢰", "규제 변화"],
      },
      {
        name: "암호화폐 담보형",
        plainExplanation: "암호화폐를 담보로 맡기고 달러에 가까운 토큰을 발행하는 방식입니다.",
        examples: [{ name: "Maker/Sky", ticker: "DAI/USDS", role: "온체인 담보 기반 스테이블코인 사례" }],
        watchPoints: ["담보 비율", "청산 위험", "담보 자산 종류"],
      },
    ],
  },
  {
    id: "defi",
    majorCategory: "DeFi 금융 프로토콜",
    beginnerDefinition: "은행이나 증권사 같은 중개기관 없이 스마트 계약으로 금융 기능을 제공하는 앱입니다.",
    whatItDoes: "교환, 대출, 예치, 담보, 파생상품 같은 금융 기능을 온체인에서 실행합니다.",
    moneyFlowRole: "TVL은 돈이 DeFi 안에 얼마나 머무는지 보는 대표 지표입니다. 다만 가격 변동 때문에 TVL도 같이 움직일 수 있습니다.",
    commonMisunderstanding: "TVL이 늘었다고 항상 건강한 성장이라는 뜻은 아닙니다. 토큰 가격 상승, 인센티브, 중복 예치가 섞일 수 있습니다.",
    subCategories: [
      {
        name: "탈중앙화 거래소",
        plainExplanation: "주문장이나 유동성 풀을 이용해 토큰을 교환하는 앱입니다.",
        examples: [
          { name: "Uniswap", ticker: "UNI", role: "자동화된 유동성 풀 거래소 사례" },
          { name: "Curve", ticker: "CRV", role: "스테이블코인 교환에 강점을 둔 사례" },
        ],
        watchPoints: ["유동성", "거래량", "스마트 계약 위험"],
      },
      {
        name: "대출 프로토콜",
        plainExplanation: "담보를 맡기고 빌리거나, 자산을 예치해 이자를 받는 구조입니다.",
        examples: [{ name: "Aave", ticker: "AAVE", role: "온체인 대출 프로토콜 사례" }],
        watchPoints: ["담보 품질", "청산", "이자율 급등"],
      },
    ],
  },
  {
    id: "infrastructure",
    majorCategory: "인프라·오라클·브릿지",
    beginnerDefinition: "블록체인 앱이 외부 데이터, 다른 체인, 개발 도구와 연결되도록 돕는 기반 서비스입니다.",
    whatItDoes: "가격 데이터 제공, 체인 간 이동, 인덱싱, 메시징 같은 보이지 않는 연결 기능을 담당합니다.",
    moneyFlowRole: "생태계가 커질수록 인프라 의존도도 커집니다. 반대로 인프라 사고는 여러 앱의 위험으로 번질 수 있습니다.",
    commonMisunderstanding: "인프라 토큰이 있다고 해서 서비스 사용량이 항상 토큰 가치로 직접 연결되는 것은 아닙니다.",
    subCategories: [
      {
        name: "오라클",
        plainExplanation: "블록체인 밖의 가격이나 데이터를 스마트 계약 안으로 가져오는 역할입니다.",
        examples: [{ name: "Chainlink", ticker: "LINK", role: "대표적인 오라클 네트워크" }],
        watchPoints: ["데이터 품질", "의존 앱 수", "오라클 장애 위험"],
      },
      {
        name: "브릿지·메시징",
        plainExplanation: "자산이나 정보를 여러 체인 사이에서 이동시키는 연결 장치입니다.",
        examples: [{ name: "LayerZero", ticker: "ZRO", role: "체인 간 메시징 사례" }],
        watchPoints: ["해킹 이력", "검증 구조", "락업 자산 규모"],
      },
    ],
  },
  {
    id: "exchange-tokens",
    majorCategory: "거래소·플랫폼 토큰",
    beginnerDefinition: "거래소나 특정 플랫폼의 수수료, 혜택, 생태계 참여와 연결된 토큰입니다.",
    whatItDoes: "수수료 할인, 런치패드 참여, 체인 수수료, 플랫폼 거버넌스 등에 쓰일 수 있습니다.",
    moneyFlowRole: "거래량이 늘거나 거래소 생태계가 강해질 때 관심을 받지만, 플랫폼 리스크에도 크게 노출됩니다.",
    commonMisunderstanding: "거래소가 크다고 토큰이 항상 안전한 것은 아닙니다. 발행 구조와 규제, 준비금 신뢰를 함께 봐야 합니다.",
    subCategories: [
      {
        name: "중앙화 거래소 토큰",
        plainExplanation: "특정 중앙화 거래소의 혜택과 연결된 토큰입니다.",
        examples: [{ name: "BNB", ticker: "BNB", role: "거래소와 체인 생태계가 결합된 사례" }],
        watchPoints: ["거래소 규제", "토큰 소각 정책", "중앙화 위험"],
      },
      {
        name: "프로토콜 거버넌스 토큰",
        plainExplanation: "탈중앙화 앱의 의사결정이나 인센티브와 연결된 토큰입니다.",
        examples: [{ name: "Uniswap", ticker: "UNI", role: "DEX 거버넌스 토큰 사례" }],
        watchPoints: ["실제 권한", "수익 배분 여부", "투표 참여율"],
      },
    ],
  },
  {
    id: "culture-and-specialized",
    majorCategory: "문화·특수 목적 토큰",
    beginnerDefinition: "커뮤니티, 디지털 소유권, 프라이버시, 실물자산 연결처럼 특정 목적을 앞세우는 암호화폐입니다.",
    whatItDoes: "문화적 관심, 특정 기능, 새로운 자산 표현 방식을 실험합니다.",
    moneyFlowRole: "시장 심리가 강할 때 빠르게 돈이 몰릴 수 있지만, 반대로 유동성이 빨리 빠질 수도 있습니다.",
    commonMisunderstanding: "유명하거나 재미있다고 해서 구조적 수요가 있다는 뜻은 아닙니다.",
    subCategories: [
      {
        name: "NFT·게임 토큰",
        plainExplanation: "디지털 아이템, 게임 경제, 창작자 경제와 연결됩니다.",
        examples: [
          { name: "Immutable", ticker: "IMX", role: "게임 인프라와 NFT 사례" },
          { name: "Axie Infinity", ticker: "AXS", role: "게임 토큰 사례" },
        ],
        watchPoints: ["실사용자", "게임 지속성", "토큰 보상 구조"],
      },
      {
        name: "밈코인",
        plainExplanation: "기술보다 커뮤니티와 문화적 확산이 중심인 토큰입니다.",
        examples: [
          { name: "Dogecoin", ticker: "DOGE", role: "대표적인 밈코인" },
          { name: "Shiba Inu", ticker: "SHIB", role: "커뮤니티 기반 밈토큰 사례" },
        ],
        watchPoints: ["유동성", "집중 보유", "과열된 홍보"],
      },
      {
        name: "프라이버시·RWA",
        plainExplanation: "거래 프라이버시 또는 국채, 부동산 같은 실물자산의 토큰화를 다룹니다.",
        examples: [
          { name: "Monero", ticker: "XMR", role: "프라이버시 코인 사례" },
          { name: "Ondo", ticker: "ONDO", role: "실물자산 토큰화 사례" },
        ],
        watchPoints: ["규제", "담보 검증", "실제 권리 구조"],
      },
    ],
  },
];

export const classificationRules: ClassificationRule[] = [
  {
    title: "코인 vs 토큰",
    simpleDefinition: "코인은 자기 블록체인의 기본 자산이고, 토큰은 다른 체인 위에서 발행된 자산입니다.",
    beginnerExample: "BTC는 Bitcoin 체인의 코인, UNI는 Ethereum 같은 체인 위에서 발행된 토큰으로 이해할 수 있습니다.",
    whyItMatters: "수수료를 무엇으로 내는지, 보안이 어디에 의존하는지, 발행 규칙이 어디서 정해지는지 달라집니다.",
  },
  {
    title: "블록체인 vs 프로토콜",
    simpleDefinition: "블록체인은 거래가 기록되는 기반 네트워크이고, 프로토콜은 그 위에서 돌아가는 규칙과 앱입니다.",
    beginnerExample: "Ethereum은 블록체인, Aave는 Ethereum 등 여러 체인 위에서 작동하는 대출 프로토콜입니다.",
    whyItMatters: "체인 성장과 앱 성장을 같은 것으로 보면 돈의 흐름을 잘못 읽을 수 있습니다.",
  },
  {
    title: "Layer 1 vs Layer 2",
    simpleDefinition: "Layer 1은 기본 체인이고, Layer 2는 그 위에서 더 빠르고 저렴하게 처리하려는 확장층입니다.",
    beginnerExample: "Ethereum은 Layer 1, Arbitrum과 Optimism은 Ethereum을 확장하는 Layer 2 사례입니다.",
    whyItMatters: "사용자가 어디에서 활동하는지, 수수료와 보안이 어디에 의존하는지 구분할 수 있습니다.",
  },
  {
    title: "스테이블코인 vs 변동성 자산",
    simpleDefinition: "스테이블코인은 달러 가치에 가깝게 설계되고, BTC나 ETH는 시장 가격이 크게 움직일 수 있습니다.",
    beginnerExample: "USDC는 대기 자금이나 결제에 쓰이고, ETH는 네트워크 수수료와 앱 활동의 기본 자산으로 쓰입니다.",
    whyItMatters: "스테이블코인 증가는 시장 안의 대기 자금일 수 있지만, 가격 상승을 보장하지 않습니다.",
  },
  {
    title: "중앙화 거래소 vs 탈중앙화 거래소",
    simpleDefinition: "중앙화 거래소는 회사가 주문과 보관을 관리하고, 탈중앙화 거래소는 스마트 계약으로 교환합니다.",
    beginnerExample: "거래소 앱에 맡기는 방식은 수탁형, Uniswap에서 지갑으로 직접 교환하는 방식은 비수탁형에 가깝습니다.",
    whyItMatters: "보관 위험, 해킹 책임, 규제 영향, 온체인 데이터 해석이 달라집니다.",
  },
  {
    title: "수탁 지갑 vs 셀프 커스터디",
    simpleDefinition: "수탁 지갑은 거래소가 키를 관리하고, 셀프 커스터디는 사용자가 개인키와 시드 문구를 직접 지킵니다.",
    beginnerExample: "거래소 계정 잔고는 수탁형, 개인 지갑의 시드 문구를 직접 보관하면 셀프 커스터디입니다.",
    whyItMatters: "편의성과 책임의 균형이 다릅니다. 시드 문구를 잃으면 복구가 어려울 수 있습니다.",
  },
];

export const economicRelationships: EconomicRelationship[] = [
  {
    id: "interest-rates",
    title: "금리",
    simpleQuestion: "금리가 오르면 왜 위험자산이 흔들릴까?",
    plainExplanation: "금리는 돈의 가격입니다. 금리가 높아지면 안전한 이자를 받을 수 있는 선택지가 커져서 위험한 자산에 굳이 돈을 넣을 이유가 줄어들 수 있습니다.",
    whenRising: "높은 금리는 대출과 투자 비용을 키워 위험자산 선호를 약하게 만들 수 있습니다.",
    whenFalling: "낮은 금리는 더 높은 수익을 찾는 움직임을 키울 수 있지만, 경기 침체 우려가 함께 있으면 효과가 약해질 수 있습니다.",
    cryptoConnection: "암호화폐는 성장주와 비슷하게 유동성과 위험선호에 민감하게 반응할 때가 많습니다.",
    caution: "금리 하나만으로 암호화폐 방향을 단정하면 안 됩니다. 유동성, 경기, 규제, 내부 수요를 함께 봐야 합니다.",
  },
  {
    id: "dollar-liquidity",
    title: "달러 유동성",
    simpleQuestion: "시장에 돈이 많아지면 암호화폐에는 어떤 의미일까?",
    plainExplanation: "유동성은 시장을 돌아다닐 수 있는 돈의 여유입니다. 여유 자금이 늘면 주식, 암호화폐 같은 위험자산으로 일부가 이동할 수 있습니다.",
    whenRising: "자금 여유가 커지면 위험자산을 살펴보는 참여자가 늘 수 있습니다.",
    whenFalling: "자금이 마르면 현금 선호가 강해지고 변동성이 커질 수 있습니다.",
    cryptoConnection: "스테이블코인 공급, 거래소 잔고, 전체 시가총액은 암호화폐 내부 유동성을 볼 때 함께 확인합니다.",
    caution: "유동성이 많아도 그 돈이 반드시 암호화폐로 들어온다는 뜻은 아닙니다.",
  },
  {
    id: "inflation",
    title: "물가와 인플레이션",
    simpleQuestion: "물가가 오르면 비트코인은 항상 좋은가?",
    plainExplanation: "물가가 오르면 현금 가치가 낮아지는 느낌이 커집니다. 그래서 공급량이 제한된 자산 이야기가 주목받을 수 있습니다.",
    whenRising: "인플레이션 헤지 이야기가 강해질 수 있지만, 동시에 금리 인상 압력도 커질 수 있습니다.",
    whenFalling: "물가 압력이 줄면 금리 부담은 낮아질 수 있지만, 경기 둔화 신호인지도 확인해야 합니다.",
    cryptoConnection: "BTC는 디지털 금이라는 이야기와 연결되지만, 단기 가격은 유동성과 위험선호에도 크게 영향을 받습니다.",
    caution: "인플레이션과 BTC의 관계는 시기마다 다르게 나타납니다. 항상 같은 방향으로 움직인다고 보면 위험합니다.",
  },
  {
    id: "risk-sentiment",
    title: "경기와 위험선호",
    simpleQuestion: "사람들이 위험을 피하면 암호화폐는 왜 약해질까?",
    plainExplanation: "경기가 불안하면 사람들은 현금, 달러, 국채처럼 안전하다고 여겨지는 곳으로 이동하려는 경향이 있습니다.",
    whenRising: "위험선호가 강하면 BTC에서 ETH, 알트코인, DeFi로 돈이 확산되는지 볼 수 있습니다.",
    whenFalling: "위험회피가 강하면 알트코인보다 BTC나 스테이블코인 쪽으로 상대적으로 돈이 머물 수 있습니다.",
    cryptoConnection: "BTC 도미넌스와 전체 시가총액을 함께 보면 돈이 집중되는지 확산되는지 힌트를 얻을 수 있습니다.",
    caution: "도미넌스 상승은 BTC 강세일 수도 있고, 알트코인 약세일 수도 있습니다.",
  },
  {
    id: "regulation",
    title: "규제와 정책",
    simpleQuestion: "정책 뉴스는 왜 가격보다 구조에 더 중요할까?",
    plainExplanation: "규제는 어떤 서비스가 허용되는지, 누가 발행하고 보관할 수 있는지, 어떤 공시가 필요한지를 바꿉니다.",
    whenRising: "규제가 명확해지면 기관 참여가 쉬워질 수 있지만, 일부 프로젝트에는 비용과 제한이 커질 수 있습니다.",
    whenFalling: "불확실성이 커지면 거래소, 스테이블코인, DeFi에서 자금 이동이 조심스러워질 수 있습니다.",
    cryptoConnection: "스테이블코인, 거래소 토큰, 프라이버시 코인, RWA 토큰은 규제 변화와 특히 밀접합니다.",
    caution: "규제 뉴스는 나라별로 의미가 다릅니다. 한 지역의 변화가 전체 시장에 같은 영향을 주지는 않습니다.",
  },
  {
    id: "onchain-activity",
    title: "온체인 활동",
    simpleQuestion: "체인 사용량이 늘면 좋은 신호일까?",
    plainExplanation: "거래 수, 활성 주소, 수수료, TVL은 실제 사용을 보는 단서입니다. 하지만 봇 활동이나 에어드롭 기대가 섞일 수 있습니다.",
    whenRising: "사용 증가일 수 있지만, 이벤트성 활동인지 반복 사용인지 나누어 봐야 합니다.",
    whenFalling: "활동 감소일 수 있지만, 수수료 하락이나 Layer 2 이동 때문에 줄어든 것처럼 보일 수도 있습니다.",
    cryptoConnection: "ETH, SOL, Layer 2, DeFi 프로젝트를 비교할 때 온체인 활동은 핵심 보조 지표입니다.",
    caution: "활성 주소를 실제 사용자 수로 단정하면 안 됩니다. 한 사람이 여러 주소를 쓸 수 있습니다.",
  },
];

export const learningFlow: LearningStep[] = [
  { title: "돈", description: "돈이 왜 생겼고, 저장·교환·계산 단위로 어떤 역할을 하는지 이해합니다." },
  { title: "금리", description: "금리를 돈의 가격으로 보고, 투자 비용과 위험선호가 어떻게 바뀌는지 봅니다." },
  { title: "달러 유동성", description: "세계 시장에서 달러가 많고 적은 흐름이 위험자산에 주는 압력을 확인합니다." },
  { title: "암호화폐 분류", description: "BTC, Layer 1, Layer 2, 스테이블코인, DeFi처럼 역할별로 나눕니다." },
  { title: "자금 이동", description: "시장 전체 → BTC → ETH → 알트코인 → DeFi로 확산되는지, 스테이블코인에 머무는지 봅니다." },
  { title: "주의와 한계", description: "상관관계와 원인을 구분하고, 데이터 부족이나 반대 신호를 항상 함께 확인합니다." },
];
