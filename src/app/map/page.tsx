const groups = [
  ["디지털 자산", "BTC, ETH처럼 네트워크 가치나 희소성을 중심으로 보는 자산"],
  ["스마트 계약 플랫폼", "앱과 토큰이 올라가는 Layer 1, Layer 2"],
  ["스테이블코인", "달러 등 법정화폐 가치에 맞추려는 현금성 토큰"],
  ["유틸리티 토큰", "서비스 사용권, 수수료, 보상 구조에 쓰이는 토큰"],
  ["거버넌스 토큰", "프로토콜 의사결정에 참여하는 토큰"],
  ["RWA", "채권, 부동산, 금 같은 현실 자산을 토큰화하는 영역"],
  ["오라클", "현실 세계 데이터를 블록체인에 전달하는 인프라"],
  ["AI·DePIN", "컴퓨팅, 데이터, 물리 인프라를 토큰 경제와 연결하는 영역"],
];

export default function MapPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-10">
      <p className="text-xs font-black uppercase text-forest">Crypto Map</p>
      <h2 className="mt-2 text-4xl font-black text-ink">암호화폐 분류 지도</h2>
      <p className="mt-4 max-w-3xl leading-7 text-muted">
        하나의 프로젝트가 여러 분류에 걸칠 수 있으므로, 목적과 가치 발생 방식을 함께 봅니다.
      </p>
      <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {groups.map(([title, description]) => (
          <article key={title} className="rounded-lg border border-line bg-panel p-5">
            <h3 className="text-xl font-black text-ink">{title}</h3>
            <p className="mt-3 text-sm leading-6 text-muted">{description}</p>
          </article>
        ))}
      </div>
    </main>
  );
}
