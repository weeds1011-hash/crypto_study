import {
  classificationRules,
  cryptoCategories,
  economicRelationships,
  learningFlow,
  type CryptoCategory,
} from "@/content/crypto-dashboard";

export default function HomePage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-8 md:py-12">
      <section className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <div>
          <p className="inline-flex rounded-md border border-line bg-panel px-3 py-2 text-sm font-black text-forest">
            Crypto Category Dashboard
          </p>
          <h2 className="mt-5 max-w-4xl text-4xl font-black leading-[1.08] text-ink md:text-6xl">
            암호화폐 종류와 돈의 흐름을 한눈에 공부합니다.
          </h2>
          <p className="mt-5 max-w-2xl text-lg font-bold leading-8 text-muted">
            먼저 암호화폐를 역할별로 나누고, 그 다음 금리·달러·유동성·경기와 어떤 관계가 있는지 초보자 기준으로 연결합니다.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#categories" className="rounded-md bg-ink px-5 py-3 font-black text-white focus:outline-none focus:ring-2 focus:ring-marine">
              종류부터 보기
            </a>
            <a href="#economy" className="rounded-md border border-line bg-panel px-5 py-3 font-black text-ink focus:outline-none focus:ring-2 focus:ring-marine">
              경제와 연결 보기
            </a>
          </div>
        </div>

        <aside className="rounded-lg border border-line bg-panel p-5 shadow-calm" aria-label="대시보드 학습 순서">
          <p className="text-xs font-black uppercase text-marine">Study Map</p>
          <h3 className="mt-2 text-2xl font-black text-ink">이 화면에서 배우는 순서</h3>
          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <SummaryCard title="1. 종류" body="코인, 토큰, Layer 1, Layer 2, 스테이블코인, DeFi를 역할별로 나눕니다." />
            <SummaryCard title="2. 구분" body="헷갈리는 개념을 짝으로 비교해 같은 말처럼 보이는 차이를 정리합니다." />
            <SummaryCard title="3. 관계" body="금리와 유동성이 암호화폐 시장 심리에 어떤 압력을 주는지 봅니다." />
          </div>
          <div className="mt-5 rounded-md border border-amberline bg-[#fff8e8] p-4 text-sm font-bold leading-6 text-ink">
            이 대시보드는 학습용입니다. 특정 코인 매수·매도나 가격 예측을 제공하지 않습니다.
          </div>
        </aside>
      </section>

      <section id="categories" className="py-12">
        <SectionHeading
          kicker="Crypto Types"
          title="암호화폐 대분류·소분류 지도"
          body="암호화폐는 가격표로 보면 모두 비슷해 보이지만, 실제로는 하는 일이 다릅니다. 아래 카드는 먼저 큰 역할을 잡고, 그 안에서 소분류와 대표 사례를 구분하도록 만들었습니다."
        />
        <div className="mt-6 grid gap-5 lg:grid-cols-2">
          {cryptoCategories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      </section>

      <section id="classification" className="py-12">
        <SectionHeading
          kicker="Beginner Distinctions"
          title="초보자가 가장 많이 헷갈리는 구분"
          body="같은 암호화폐처럼 보여도 코인과 토큰, 체인과 프로토콜, 중앙화 거래소와 탈중앙화 거래소는 완전히 다른 기준입니다."
        />
        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {classificationRules.map((rule) => (
            <article key={rule.title} className="rounded-lg border border-line bg-panel p-5">
              <h3 className="text-xl font-black text-ink">{rule.title}</h3>
              <p className="mt-3 text-sm font-bold leading-6 text-muted">{rule.simpleDefinition}</p>
              <p className="mt-4 rounded-md bg-paper p-3 text-sm leading-6 text-ink">{rule.beginnerExample}</p>
              <p className="mt-3 text-sm leading-6 text-muted">{rule.whyItMatters}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="economy" className="py-12">
        <SectionHeading
          kicker="Money, Rates, Economy"
          title="암호화폐와 돈·금리·경제의 관계"
          body="암호화폐는 혼자 움직이지 않습니다. 금리, 달러 유동성, 물가, 경기 심리, 규제, 온체인 활동이 서로 다른 압력을 만듭니다."
        />
        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          {economicRelationships.map((item) => (
            <article key={item.id} className="rounded-lg border border-line bg-panel p-5">
              <p className="text-xs font-black uppercase text-forest">{item.title}</p>
              <h3 className="mt-2 text-2xl font-black text-ink">{item.simpleQuestion}</h3>
              <p className="mt-3 text-sm font-bold leading-6 text-muted">{item.plainExplanation}</p>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <InfoBox label="올라갈 때" body={item.whenRising} />
                <InfoBox label="내려갈 때" body={item.whenFalling} />
              </div>
              <InfoBox label="암호화폐와 연결" body={item.cryptoConnection} className="mt-3" />
              <p className="mt-3 rounded-md border border-amberline bg-[#fff8e8] p-3 text-sm font-bold leading-6 text-ink">
                주의: {item.caution}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section id="flow" className="py-12">
        <SectionHeading
          kicker="Learning Flow"
          title="공부 순서: 돈에서 암호화폐 시장 해석까지"
          body="경제 개념을 먼저 잡고, 암호화폐 분류를 붙인 뒤, 마지막에 돈이 어느 영역으로 이동하는지 해석합니다."
        />
        <ol className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {learningFlow.map((step, index) => (
            <li key={step.title} className="rounded-lg border border-line bg-panel p-5">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-ink text-sm font-black text-white">
                {index + 1}
              </span>
              <h3 className="mt-4 text-xl font-black text-ink">{step.title}</h3>
              <p className="mt-2 text-sm leading-6 text-muted">{step.description}</p>
            </li>
          ))}
        </ol>
      </section>
    </main>
  );
}

function SectionHeading({ kicker, title, body }: { kicker: string; title: string; body: string }) {
  return (
    <div className="max-w-4xl">
      <p className="text-xs font-black uppercase text-forest">{kicker}</p>
      <h2 className="mt-2 text-3xl font-black text-ink md:text-4xl">{title}</h2>
      <p className="mt-3 text-base leading-7 text-muted">{body}</p>
    </div>
  );
}

function SummaryCard({ title, body }: { title: string; body: string }) {
  return (
    <article className="rounded-md border border-line bg-paper p-4">
      <h4 className="font-black text-ink">{title}</h4>
      <p className="mt-2 text-sm leading-6 text-muted">{body}</p>
    </article>
  );
}

function CategoryCard({ category }: { category: CryptoCategory }) {
  return (
    <article className="rounded-lg border border-line bg-panel p-5">
      <h3 className="text-2xl font-black text-ink">{category.majorCategory}</h3>
      <p className="mt-3 text-sm font-bold leading-6 text-muted">{category.beginnerDefinition}</p>
      <InfoBox label="무엇을 하나요?" body={category.whatItDoes} className="mt-4" />
      <div className="mt-4 grid gap-3">
        {category.subCategories.map((subCategory) => (
          <div key={subCategory.name} className="rounded-md bg-paper p-4">
            <h4 className="font-black text-ink">{subCategory.name}</h4>
            <p className="mt-2 text-sm leading-6 text-muted">{subCategory.plainExplanation}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {subCategory.examples.map((example) => (
                <span key={`${subCategory.name}-${example.name}`} className="rounded-md border border-line bg-panel px-3 py-2 text-xs font-black text-ink">
                  {example.name}
                  {example.ticker ? ` (${example.ticker})` : ""}: {example.role}
                </span>
              ))}
            </div>
            <ul className="mt-3 grid gap-2 text-sm leading-6 text-muted">
              {subCategory.watchPoints.map((point) => (
                <li key={point}>확인할 점: {point}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <InfoBox label="돈의 흐름에서 역할" body={category.moneyFlowRole} className="mt-4" />
      <p className="mt-3 rounded-md border border-amberline bg-[#fff8e8] p-3 text-sm font-bold leading-6 text-ink">
        흔한 오해: {category.commonMisunderstanding}
      </p>
    </article>
  );
}

function InfoBox({ label, body, className = "" }: { label: string; body: string; className?: string }) {
  return (
    <div className={`rounded-md bg-paper p-3 ${className}`}>
      <p className="text-xs font-black uppercase text-marine">{label}</p>
      <p className="mt-1 text-sm leading-6 text-muted">{body}</p>
    </div>
  );
}
