# SCEMO NETFLIX - 현재 상영작 웹사이트

The Movie Database (TMDB) API를 사용하여 현재 상영 중인 영화를 보여주는 넷플릭스 스타일의 웹사이트입니다.

## 기능

- 현재 상영 중인 영화 목록 표시
- 영화 포스터와 제목, 평점 표시
- 반응형 디자인 (모바일, 태블릿, 데스크톱 지원)
- 넷플릭스 스타일의 모던한 UI
- 영화 카드 호버 효과

## 사용 방법

1. `index.html` 파일을 웹 브라우저로 엽니다.
2. 자동으로 현재 상영 중인 영화들이 로드됩니다.
3. 영화 카드를 클릭하면 영화 상세 정보를 볼 수 있습니다.

## 파일 구조

```
scemo-netflix/
├── index.html      # 메인 HTML 파일
├── style.css       # 스타일시트
├── script.js       # JavaScript 로직
└── README.md       # 프로젝트 설명
```

## API 정보

- API: The Movie Database (TMDB)
- Endpoint: https://api.themoviedb.org/3/movie/now_playing
- 언어: 한국어 (ko-KR)

## 기술 스택

- HTML5
- CSS3
- JavaScript (ES6+)
- TMDB API

## 주요 기능 설명

### 반응형 디자인
- 데스크톱: 영화 카드 그리드 레이아웃
- 태블릿: 적응형 그리드
- 모바일: 2열 그리드 레이아웃

### 스타일 특징
- 넷플릭스 브랜드 컬러 (#e50914)
- 다크 테마
- 부드러운 호버 애니메이션
- 카드 확대 효과

## 브라우저 지원

- Chrome (최신 버전)
- Firefox (최신 버전)
- Safari (최신 버전)
- Edge (최신 버전)
