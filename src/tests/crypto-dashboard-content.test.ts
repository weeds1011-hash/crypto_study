import { describe, expect, it } from "vitest";
import { classificationRules, cryptoCategories, economicRelationships, learningFlow } from "@/content/crypto-dashboard";

describe("rebuilt crypto category dashboard content", () => {
  it("covers beginner crypto categories with subcategories and examples", () => {
    expect(cryptoCategories.length).toBeGreaterThanOrEqual(8);

    for (const category of cryptoCategories) {
      expect(category.majorCategory).toBeTruthy();
      expect(category.beginnerDefinition).toBeTruthy();
      expect(category.whatItDoes).toBeTruthy();
      expect(category.moneyFlowRole).toBeTruthy();
      expect(category.commonMisunderstanding).toBeTruthy();
      expect(category.subCategories.length).toBeGreaterThan(0);

      for (const subCategory of category.subCategories) {
        expect(subCategory.plainExplanation).toBeTruthy();
        expect(subCategory.examples.length).toBeGreaterThan(0);
        expect(subCategory.watchPoints.length).toBeGreaterThan(0);
      }
    }
  });

  it("explains the classifications beginners need before reading market data", () => {
    const text = classificationRules.map((rule) => rule.title).join(" ");

    expect(text).toContain("코인 vs 토큰");
    expect(text).toContain("블록체인 vs 프로토콜");
    expect(text).toContain("Layer 1 vs Layer 2");
    expect(text).toContain("스테이블코인 vs 변동성 자산");
    expect(text).toContain("중앙화 거래소 vs 탈중앙화 거래소");
    expect(text).toContain("수탁 지갑 vs 셀프 커스터디");
  });

  it("connects crypto to money, rates, liquidity, inflation, regulation, and onchain activity", () => {
    const text = economicRelationships.map((item) => `${item.title} ${item.cryptoConnection}`).join(" ");

    expect(text).toContain("금리");
    expect(text).toContain("달러 유동성");
    expect(text).toContain("물가");
    expect(text).toContain("규제");
    expect(text).toContain("온체인");
    expect(economicRelationships.every((item) => item.caution.length > 0)).toBe(true);
  });

  it("keeps the learning sequence from money to crypto market interpretation", () => {
    expect(learningFlow.map((step) => step.title)).toEqual(["돈", "금리", "달러 유동성", "암호화폐 분류", "자금 이동", "주의와 한계"]);
  });

  it("does not include direct buy, sell, or price prediction advice", () => {
    const allText = JSON.stringify({ cryptoCategories, classificationRules, economicRelationships, learningFlow });

    expect(allText).not.toMatch(/매수하세요|매도하세요|가격이 오른다|가격이 내린다|수익 보장/);
  });
});
