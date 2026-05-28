# Global EM 실패 → Local EM 성공 애니메이션 (PPT 제작용 todo)

paper.mdx의 TL;DR과 didactic experiment 사이에 들어갈 **Global IS vs Local IS 대조 애니메이션** 설계 문서.
PPT로 그리고 GIF로 export 예정.

---

## 합의된 설계 결정 (2026-05-28)

| 항목 | 결정 |
|---|---|
| 메시지 구조 | **순차 스토리** — Global EM 먼저 → 왜 실패 → Local EM이 어떻게 해결 |
| 환경 | **1D action space toy** (x축: action $a$, y축: Q(a)) |
| 분량 | **5–8 슬라이드 유동적** (짧은 GIF 타겟이지만 컷 수에 얽매이지 않음) |
| 수식 노출 | **최소화** — f, q_k, μ*_k 같은 표기 없이 화살표·색·도형으로만 |
| 시각 컨벤션 | **`src/assets/localized_EM_algorithm.png` (Figma Figure 1 Ver. 6) 그대로 따름** |

---

## 시각 언어 (전체 슬라이드 공통) — Figma `localized_EM_algorithm.png` 컨벤션

| 요소 | 표현 |
|---|---|
| 배경 | 흰색, teal 라운드 박스 frame |
| **Q colormap** | H(노랑) → 오렌지 → 마젠타 → 보라 → L(짙은 남색). plasma 계열 |
| **Sample 점** | 작은 원. **색 = 그 위치의 Q 값** (위 colormap). 크기는 균일. |
| 정책 곡선 — **Before** | Q colormap 그라데이션으로 칠해진 매끈한 곡선 (broad / under-peaked) |
| 정책 곡선 — **After** | 검정 곡선. 명확히 sharp + multi-modal |
| **Global proposal** | 회색(zinc) broad bell. 반투명 fill. 전체 action space에 퍼져있음 |
| **Local Gaussian (anchor)** | teal (#0F766E). **옅은 teal = before / 진한 teal = after** |
| Anchor 중심 표시 | 세로 점선 (회색) |
| **이동 화살표** | 검정. anchor 중심이 weighted target 쪽으로 향함 |
| Zoom-in inset | 점선 박스로 둘러쌈 (Figma의 "Local Target Matching" inset처럼) |
| Legend (왼쪽 사이드) | "Samples · Before/After · Q colormap" — Figma 그대로 |

**핵심 시각 메타포 (변경됨):**

- 원래 plan은 "점 크기 = weight"였으나, Figma 컨벤션에 따라 **"점 색 = Q 값"** 으로 통일.
- Weight collapse 시각화는 **"useful한 색(노랑/오렌지) 점이 거의 없고 대부분 어두운 보라/남색"** 으로 자연스럽게 표현됨.
- 즉 _색 분포 자체가 IS supervision의 quality_ 를 드러냄.

**옵션:** weight collapse를 더 강조하고 싶다면 **"점 위에 작은 weight bar"** 를 얹어도 됨 (점 색이 어두우면 bar 길이도 짧음). 단 Figma 원본엔 없으므로 추가하면 컨벤션 일탈.

---

## 슬라이드 골격 (잠정 — 컷 수 유동적)

### Slide 1 — Setup: Q landscape 등장

- **화면 구성**
  - 1D 가로 축에 **multi-modal Q(a) 곡선** (예: 봉우리 2개 — 큰 peak + 작은 peak).
  - 곡선은 **Q colormap 그라데이션**으로 칠해짐 (Figma "Before" 곡선과 동일 스타일). Peak 부근 노랑/오렌지, 골짜기 부근 보라/남색.
- **애니메이션**: 곡선 fade-in.
- **caption**: _"We want to find actions where Q is high."_

### Slide 2 — Global proposal 깔기

- **화면 구성**
  - Slide 1 위에 **회색 broad Gaussian bell** (반투명 fill) — global proposal $\pi(a\mid s)$.
  - Action space 거의 전체에 펼쳐짐.
- **애니메이션 (entrance)**: 회색 bell fade-in → 그 안에서 점 N=8개가 흩뿌려짐 (random scatter).
  - 점의 **색은 그 위치의 Q 값** 에 자동 결정 (Q colormap). 대부분이 어두운 보라/남색 영역에 떨어짐.
- **caption**: _"Prior: one broad proposal over the entire action space."_

### Slide 3 — Weight collapse 시각화

- **화면 구성**
  - Slide 2의 점 분포 강조. **노랑/오렌지(=informative weight) 점은 1~2개뿐**, 나머지는 어두운 보라/남색.
  - 가중평균 위치에 마젠타/오렌지 점 하나 (잘못된 위치 — high-Q peak에서 빗나감).
- **애니메이션**:
  1. 어두운 점들이 살짝 흐려지거나 작아지는 emphasis (= "weight ≈ 0").
  2. 가중평균 점이 fade-in — 위치가 high-Q peak이 아닌 어정쩡한 곳.
- **강조 텍스트** (회색 사이드 작은 라벨): _"weight collapse · sparse supervision"_
- **caption**: _"Most samples land where Q is low — weights collapse, target drifts."_

### Slide 4 (선택) — 전환: "What if the proposal stays near promising actions?"

- **화면 구성**
  - 회색 bell + 점들 fade-out, Q 곡선만 남음.
  - 짧은 질문 텍스트 한 줄.
- **컷 수 줄이려면 생략 가능** — Slide 3 → Slide 5로 바로 넘어가도 OK.

### Slide 5 — Local Gaussians 등장 (Latent-Augmented anchors)

- **화면 구성**
  - 같은 Q 곡선 위에 **여러 개의 작은 teal Gaussian** (예: 3~4개). Figma 메인 그림의 4 anchor 구도와 동일.
  - 각 anchor 중심에 **세로 점선** (회색).
  - 처음엔 모두 **옅은 teal** (= before, anchor 초기 위치는 무작위/넓게 분포).
  - 회색 broad bell은 옅게 남겨두거나 fade-out (선택 — Figma에는 남아있음).
- **애니메이션**: anchor가 하나씩 pop-in → 옅은 teal Gaussian이 펼쳐짐 → 세로 점선이 떨어짐.
- **caption**: _"FLAG: a small local Gaussian around each latent-generated anchor."_

### Slide 6 — Local 샘플링 + balanced weights (Figma inset 차용)

- **화면 구성**
  - 한 anchor를 zoom-in. **점선 박스** 로 둘러쌈 = Figma "Local Target Matching" inset과 동일 모티프.
  - 그 local Gaussian 내부에서 **N개 점이 좁게** 흩뿌려짐.
  - 점들이 모두 **비슷한 색**(같은 mode 안에 있으므로 Q 값이 비슷) — 보라~마젠타 비슷한 톤. 한 점이 좀 더 밝은 마젠타/오렌지.
  - 이 점들의 weighted average 위치에 **target 점** 표시.
- **애니메이션**:
  1. zoom-in 박스 등장.
  2. local 영역 안에서 점 N개 entrance.
  3. target 점 fade-in — local Gaussian 중심에서 **약간 옆**(higher-Q 방향)에 위치.
- **강조 텍스트** (teal 작은 라벨): _"informative weights · dense local supervision"_

### Slide 7 — M-step: anchor가 target으로 이동 (옅은 teal → 진한 teal)

- **화면 구성**
  - zoom-in 풀고 전체 view 복귀. 모든 anchor의 local Gaussian이 동시에 적용.
  - 각 anchor에 **검정 화살표** 가 짧게 그어짐 (anchor 중심 → target 방향).
  - Gaussian 색이 **옅은 teal → 진한 teal** 로 transform (Figma의 before/after Gaussian 컨벤션 그대로).
  - 모든 anchor가 각자 자기 mode의 high-Q 영역 위에 안착.
- **애니메이션**:
  1. 화살표 그어짐.
  2. Local Gaussian이 motion path 따라 이동 (PPT "Motion Paths" 기능).
  3. 동시에 옅은 teal → 진한 teal로 색 transform.
- **caption**: _"Each anchor moves toward its locally improved target."_

### Slide 8 (선택, 마무리) — Before/After 정책 곡선 회수

- **화면 구성**
  - Figma 메인 그림의 핵심 메시지 회수: **컬러풀한 곡선(Before, broad)** 위에 **검정 곡선(After, sharp multi-modal)** 이 morph-in.
  - 4 anchor의 진한 teal Gaussian이 검정 곡선의 peak들과 정렬됨.
- **애니메이션**: 컬러풀 곡선이 검정 곡선으로 morph (Morph transition 한 컷이면 충분).
- **마지막 한 줄 (큰 글씨)**: _"Local IS = scalable target matching."_ (또는 paper.mdx TL;DR과 동일 문구로 회수)
- **선택 사유**: 이 컷이 들어가면 _"그래서 정책이 어떻게 변했는데?"_ 가 한 호흡에 마무리됨. GIF 길이 제약상 빼도 됨.

---

## 컷 수 옵션

| 옵션 | 컷 | 빠진 슬라이드 | 권장 시나리오 |
|---|---|---|---|
| **압축** | 5컷 | Slide 4, 8 생략 | 페이지 임베드용 짧은 GIF |
| **표준** | 6~7컷 | Slide 4 또는 8 중 하나 생략 | 일반 |
| **풀** | 8컷 | 다 포함 | 발표 슬라이드용으로도 활용 |

---

## PPT 제작 시 권장 사항

- **슬라이드 비율**: 16:9 (가로형). paper.mdx에서 `<Wide>` 컴포넌트로 감싸기 좋음.
- **PPT 애니메이션 트랜지션**: **Morph** transition 적극 활용. 같은 도형(점·Gaussian)이 위치/크기만 변하는 컷이 많아서 Morph 한 번이면 부드럽게 연결됨.
- **GIF export 시**: 슬라이드당 1.5~2초 가량 dwell, transition 0.5~0.7초 권장. 총 길이 ≤ 15초가 페이지 임베드에 적합.
- **폰트**: 페이지 본문과 동일한 sans-serif (Inter 계열). 캡션은 작게 (12~14pt 환산).
- **여백**: 슬라이드 가장자리 충분히 — 페이지에 임베드되면 양옆 잘릴 수 있음.

---

## Figma 컨벤션 (확정)

레퍼런스: `src/assets/localized_EM_algorithm.png` (= Figma "Figure 1 Ver. 6", paper.mdx Q2 method card에 이미 사용 중)

- [x] **색상 팔레트** — Q colormap(plasma) + teal(#0F766E) + 회색(zinc) + 검정. 위 "시각 언어" 표 참조.
- [x] **Anchor/Local Gaussian 표현** — teal Gaussian + 세로 점선 anchor 중심. Before(옅은 teal) / After(진한 teal).
- [x] **Sample 점 표현** — 작은 원, 색 = Q 값. 크기 균일.
- [x] **이동 화살표** — 검정, anchor 중심 → target.
- [x] **Zoom-in inset** — 점선 박스 (Figma "Local Target Matching" 모티프). Slide 6에 차용.
- [x] **Before/After 정책 곡선** — 컬러풀 → 검정 morph (Figma 메인 곡선 컨벤션). Slide 8 (선택)에 차용.
- [x] **Legend** — 왼쪽 사이드에 "Samples · Before/After · Q colormap" 배치 가능 (Figma 그대로).

→ 모든 디자인 요소가 Figma `localized_EM_algorithm.png` 와 일관됨. 슬라이드 사이의 시각 일관성이 보장되며, paper.mdx 본문(Q2 method card)과도 시각이 통일됨.

---

## Section 4.3에서 가져온 핵심 요소 (체크리스트)

애니메이션이 이 요소들을 모두 시각적으로 드러내는지 검증:

- [x] **Energy function** $f_{\hat s,k}(a) = Q^{\pi_k}(s,a) - \alpha \log \tilde\pi_{\theta_k}(a\mid s)$ — Slide 1의 Q(a) 곡선이 이 역할 (단순화)
- [x] **E-step**: $q_k(a\mid\hat s) \propto \hat\pi(a\mid\hat s;\theta_k)\exp(f/\lambda)$ — Slide 3 / 6의 weight 크기로 표현
- [x] **M-step (Moment matching)**: $\theta_{k+1} = \arg\min \|T_\theta(s,z) - \mu^*_k(\hat s)\|^2$ — Slide 7의 motion path
- [x] **Self-normalized IS approx**: $\mu^*_k \approx \sum \bar w_i a_i$ — Slide 3 / 6의 ⭐ 위치
- [x] **Local Gaussian**: $\hat\pi(a\mid s,z) = \mathcal{N}(T_\theta(s,z), \Sigma)$ — Slide 5의 좁은 teal Gaussian
- [x] **Latent-conditioned multi-anchor** — Slide 5의 anchor 3개

---

## 다음 단계

1. **(사용자)** Figma 이미지를 워크스페이스로 복사 or 구성 설명 → 위 "Figma 의존 항목" 채우기.
2. **(같이 검토)** Slide 1~7 골격이 메시지 의도와 맞는지 한 번 더 확인. 컷 수 조정 (5컷 압축 / 7컷 유지).
3. **(사용자)** PPT 제작 — 위 시각 언어/슬라이드 골격대로 그리기. Morph transition 활용.
4. **(사용자)** GIF export → `src/assets/`에 추가.
5. **(같이)** paper.mdx의 TL;DR 직후, didactic 직전 위치에 GIF 임베드 (Video 또는 `<img>` 형태).
