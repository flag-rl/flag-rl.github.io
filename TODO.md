# paper.mdx 수정 TODO

페이지 상단을 "challenge → method insight → 핵심 결과"가 한눈에 보이는 두괄식 구조로 재배치하는 작업.
편집은 VSCode에서 직접 수행. 5번(global vs local IS 애니메이션)은 별도 작업으로 보류 — Claude Cowork에서 이어서 진행.

---

## 최종 목표 구조 (Before → After)

**Before (현재):**

```
TL;DR
└─ "From Global to Local Importance Sampling" 섹션
   ├─ Prior methods / IS 한계 설명 (텍스트)
   ├─ Our key insight 설명 (텍스트)
   ├─ ColorBox: "Local IS turns global target matching into local target matching"
   └─ Multi-goal Environment 그림 (didactic)
Method (Q1/Q2/Q3 QCards)
Experimental Results
└─ Q1
   ├─ Q1.1 with CrossQ → Figure 3   ← 핵심 결과가 여기 묻혀 있음
   ├─ Q1.2
   └─ Learning Curves
...
```

**After (목표):**

```
TL;DR (3줄 요약 — challenge + insight + benefit 다 포함)
└─ Multi-goal Environment 그림 (didactic, TL;DR 직후)
└─ Q1.1 with CrossQ → Figure 3 (핵심 결과, didactic 직후)
Method (Q1/Q2/Q3 QCards)
Experimental Results (현재 구조 유지)
```

상단을 본 사람이 _"무슨 문제 풀었고, 핵심 결과가 뭐다"_ 를 스크롤 한두 번에 파악 가능하게 만드는 게 목표.

---

## 작업 1. TL;DR 재작성 (3줄 요약으로 합치기)

**대상 위치:** `src/paper.mdx` 의 `<HighlightedSection>` (현재 L106–L114)

**합칠 내용:**

- 현재 TL;DR 본문 (L108–L112)
- "From Global to Local Importance Sampling" 도입부 텍스트 (L116–L129) — Prior methods 설명 + Our key insight
- ColorBox "Local IS turns global target matching into local target matching" (L131–L158) — 표 내용의 핵심만 흡수

**3줄 요약에 반드시 들어가야 할 메시지:**

1. **Challenge (문제):** 기존 diffusion/flow policy들은 global IS로 MaxEnt target을 매칭하는데, high-dim action space에서는 proposal–target overlap이 작아서 sparse supervision으로 학습이 사실상 실패함.
2. **Insight (방법):** FLAG는 latent $z$로 proposal/target을 같은 local region에 가두는 **Local IS** 로 이 문제를 푼다. (global → local 전환)
3. **Benefit (결론적으로 뭐가 좋은데):** _다음 포인트들을 명시할 것_
   - **훨씬 적은 importance sample 수로도 더 좋은 성능** (e.g. N=2 샘플로도 수렴)
   - **best-of-P heuristic 없이도** SOTA 수준의 성능. (대조점: 기존 global IS 방법들은 high-dim에서 best-of-P 없이는 의미있는 policy를 학습조차 못 함)
   - **critic learning 방식에 비종속** — CrossQ 유무에 관계없이 잘 동작
   - (선택) BPTT 없이 supervised distillation으로 학습

**작업 절차:**

1. `<HighlightedSection>` 내부 TL;DR 본문을 위 3줄 요약으로 교체.
2. L116–L158의 "From Global to Local Importance Sampling" 섹션 헤더 + 도입 텍스트 + ColorBox **전체 제거** (3줄 요약에 흡수됨).
3. L160의 bridge sentence ("We first illustrate this effect in a controlled multi-goal task...") 도 함께 제거 (자연스럽게 작업 2로 연결됨).

**남기는 표현 톤:**

- 정량 수치는 검증된 것만 사용 (N=2까지 robust한 건 본문에 이미 있는 사실).
- "without best-of-P", "agnostic to critic learning method" 같은 차별점은 명확히 적되 자랑조는 피함.

---

### 작성 지침: Introduction의 대비 용어로 compact하게

`src/assets/FLAG_Neurips.pdf` Introduction이 이미 핵심 대비 구도를 명확한 용어쌍으로 정립해놓음.
TL;DR 작성 시 **이 대비쌍을 그대로 keyword처럼 박아넣어** 짧고 힘있게 전달할 것.
풀어 설명하는 산문체보다, 대비 keyword를 전면에 내세우는 방식이 두괄식 페이지의 목적에 맞음.

**Paper Intro에서 가져올 핵심 대비쌍:**

| 문제 (Prior)                                              | 해법 (Ours)                                                       |
| --------------------------------------------------------- | ----------------------------------------------------------------- |
| **Global IS** (full action space)                         | **Local IS** (latent-conditioned local region)                    |
| Importance weight **collapse / degeneracy**               | Localized sampling region                                         |
| Proposal–target **mismatch** → vanishing support          | Jointly localize proposal & target via latent $z$                 |
| **Sparse supervision**                                    | **Dense supervision** (around each action)                        |
| **Heuristic** post-hoc weight clipping / best-of-P        | **Principled** localization (provably consistent proxy objective) |
| **BPTT through generative steps** (numerically unstable)  | **Supervised distillation** via EM on the z-MDP                   |
| Restricted to **simple Gaussians** (limited expressivity) | **Expressive flow policies** with tractable updates               |

**작성 원칙:**

1. **대비쌍을 평행 구조로 노출** — "X가 아니라 Y" / "X 대신 Y" / "from X to Y" 패턴 적극 활용.
   - 예: _"From **global IS** over the full action space to **local IS** in a latent-conditioned region."_
2. **고유 keyword는 굵게(`**...**`) 처리** — 독자가 스캐닝만 해도 핵심어가 눈에 박히게.
   - 예: **Local IS**, **latent-augmented guidance**, **z-MDP**, **EM-style supervised distillation**, **without BPTT**
3. **Paper 용어와 일관** — 페이지 본문(Method/Q1·Q2·Q3) 에서 쓰이는 용어 그대로 사용. 새 표현 만들어내지 말 것.
   - "Local IS", "z-MDP" (또는 "latent-augmented MDP"), "latent-augmented guidance", "EM-style", "cross-entropy surrogate" 등은 Intro/Method 양쪽에서 동일.
4. **수식/약어 남발 금지** — TL;DR에는 $z$, $N$ 정도까지만. $\hat\rho_{\hat\pi}$ 같은 본격 표기는 Method 섹션 몫.
5. **3줄 안에 challenge·insight·benefit 다 들어가야 함** — 한 줄당 한 메시지가 원칙.
   - L1: Prior global IS의 문제 (sparse, weight collapse, heuristic 의존)
   - L2: Local IS · latent-augmented guidance로의 전환 (insight)
   - L3: 결과적 이득 (적은 샘플, no best-of-P, critic-agnostic, SOTA)

**참고 — Intro Abstract의 응축 표현 (벤치마크):**

> "Our key insight is to mitigate this limitation by **localizing the sampling region**, avoiding the **weight degeneracy** induced by importance sampling over the **entire action space**."

이 정도 밀도/명확도를 TL;DR 목표로 삼을 것.

---

## 작업 2. Didactic 그림을 TL;DR 직후로 배치

**대상 위치:** 작업 1에서 비워진 자리 (구 L116 부근).

**작업 절차:**

1. 현재 L179–L184의 `### Multi-goal Environment (Didactic Experiment)` + `<Figure>` 블록을 TL;DR 바로 다음으로 이동.
2. 헤더는 `### Multi-goal Environment (Didactic Experiment)` 그대로 유지하되, TL;DR 흐름과 자연스럽게 연결되도록 caption을 한 줄 다듬는 것 고려:
   - 현재 caption: _"The multi-goal task isolates the small-sample regime: global-IS baselines fail when $N \le 8$, while FLAG recovers the optimal multi-modal behavior with only $N = 2$ samples."_
   - 그대로 두어도 무방함. TL;DR에서 "N=2로도 가능"을 강조했다면 caption은 그 근거를 시각적으로 보여주는 역할.
3. 기존 위치(L179–L184)는 빈 자리가 됨 — 작업 4와 함께 처리.

**판단 포인트:**

- TL;DR 흡수 vs 별도 섹션 — 현재 안은 **별도 섹션으로 분리** (헤더 유지, TL;DR 바로 아래에 위치). 사용자가 "혹은 TL;DR에 합치기"도 옵션으로 열어둔 상태이므로, 헤더 없이 TL;DR 박스 _안쪽_ 에 그림을 넣는 것도 가능. 시각적 밸런스 보고 결정.

---

## 작업 3. A1 핵심 결과 그림(Figure 3, with CrossQ)을 didactic 직후로 배치

**대상 그림:** Q1.1의 "With CrossQ" 탭에 들어있는 Figure 3

- import: `q1Figure3Thumb` (L87), `q1Figure3Detail` (L88) — 이미 import 되어 있음
- 현재 사용 위치: L437–L444 (`<TabsContent value="q1-scale-with-crossq">` 내부)

**작업 절차:**

1. 작업 2의 didactic 그림 바로 다음 위치에 새로운 섹션 추가. 헤더 예시:
   ```mdx
   ### Main Result: Scaling to High-dimensional Control
   ```
   (혹은 더 짧게 `### Main Result` / `### Highlight Result` 등 취향껏)
2. 그 아래에 `<ResultZoomImage>` 또는 `<Figure>` 로 Figure 3을 표시.
   - `<ResultZoomImage>` 를 그대로 쓰면 클릭시 detail로 확대되는 UX 유지 가능. 단, `id` 는 중복 안 되게 변경 필요 (예: `id="hero-q1-figure3"`).
   - 캡션은 짧게 한 줄. 예시: _"FLAG sustains the highest return at the lowest GPU cost as action dimensionality scales (MuJoCo → DMC Dog → MyoSuite). Detailed comparisons across budgets and critic settings: see Experimental Results below."_
3. 시각적 무게감 확보를 위해 `<Wide>` 로 감싸는 것 고려.

**결정 필요 — 중복 vs 이동:**

- (a) **중복 허용:** 위(상단)에도 Figure 3, 아래 Experimental Results의 Q1.1 with CrossQ 탭에도 그대로. → 스크롤 흐름은 자연스럽지만 같은 그림이 두 번 나옴.
- (b) **완전 이동:** 위로 옮기고, Experimental Results Q1.1의 "With CrossQ" 탭은 비워두거나 _"see top of the page"_ 같은 참조로 대체. → 깔끔하지만 Q1.1 탭 구조가 어색해질 수 있음.
- (c) **상단에는 축약본/요약컷, 하단에는 풀버전:** 가능하다면 가장 깔끔. 단 별도 그림 에셋 필요.

→ 우선 (a)로 진행하고, 빌드 후 시각적으로 보고 (b)/(c)로 조정하는 게 안전.

---

## 작업 4. 잔여 정리

작업 1–3 이후 잔존하는 부분 정리:

1. **빈 자리 정리:** 작업 2에서 didactic 그림을 옮긴 후 L179–L184의 원래 자리는 비워짐 — 해당 블록 완전 삭제.
2. **`## From Global to Local Importance Sampling` 헤더 제거** (작업 1에서 함께 처리되었어야 함 — 누락 여부 더블체크).
3. **bridge sentence 제거** (L160의 "We first illustrate this effect...") — 작업 1에서 함께 처리.
4. **주석 처리된 죽은 코드 정리 (선택):**
   - L162–L177: 주석 처리된 multi-goal/highdim Wide Figure 블록 — 더 이상 안 쓸 거면 삭제.
   - L186–L191: 주석 처리된 high-dim figure 블록 — 동일.
   - L193–L206: 주석 처리된 "How to Make Local IS Framework Work?" ColorBox — 동일.
   - (남겨두면 mdx 파일 가독성만 나빠짐. 아직 결정 못 한 옵션이면 그대로 두기.)
5. **`## Method` 헤더 (L208) 와 그 이후 Q1/Q2/Q3 QCards** — **변경 없음**.
6. **`## Experimental Results` (L402–) 이후** — 작업 3의 결정 (a)/(b)/(c) 에 따라 Q1.1 with CrossQ 탭만 손대고, 나머지는 **변경 없음**.

---

## 검증 단계

수정 후 반드시 수행:

1. `npm run dev` 로 로컬에서 확인 — 페이지 위에서부터 스크롤하며 "challenge → didactic → 핵심 결과 → method → experiment" 흐름이 자연스러운지 눈으로 검증.
2. `npm run build` — 타입체크 + 빌드 통과 확인 (mdx 컴포넌트 깨진 거 없는지).
3. 모바일 뷰포트 (Wide 컴포넌트가 좁은 화면에서 어떻게 보이는지) 확인.

---

## 보류 (작업 5 — Claude Cowork에서 진행 예정)

**Global IS vs Local IS 대조 애니메이션 제작 및 삽입**

- 위치: TL;DR과 didactic experiment 사이.
- 컨셉: full action space에서 reweight하는 global IS의 sparse supervision 문제 → latent z로 영역을 좁힌 local IS의 dense supervision으로 전환되는 과정을 시각화.
- 참고 에셋: `src/assets/localized_EM_algorithm.png` 의 컨셉을 애니메이션화하는 방향.
- 이 애니메이션이 들어가면 작업 1에서 흡수했던 ColorBox 내용이 시각적으로 대체되므로, TL;DR 본문은 더 간결해질 수 있음.

→ 별도 세션에서 진행. 이 TODO 1–4번 작업 완료 후 착수.
