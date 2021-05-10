# 구글 Meet를 3D 가상 교실로 만드는 크롬 확장 프로그램

21-1 종합설계 프로젝트

개발 중...

![image](https://user-images.githubusercontent.com/22253556/116207597-044e7a00-a77b-11eb-8570-7557362b62b6.png)

## 기술 스택

- React.js
- React Three Fiber
- React Cannon
- Zustand
- Tailwind
- Socket.io

## 앱 실행 방법

### 사전 설치

- Node.js 14 +
- yarn

### 패키지 설치

프로젝트 디렉터리에서 `yarn install` 커맨드 실행

### 앱 실행

프로젝트 디렉터리에서 `yarn start` 커맨드 실행

## 진행사항

### 완료

- 캐릭터 이동, 감정표현
- 다중 이용자 위치, 애니메이션 동기화
- 칠판에 비디오 송출하기

### 진행중

- Sketchfab의 3D gltf Model 불러오기
  - 모델 검색 화면 (△)
  - 모델 위치, 회전, 크기 조작 (O)
  - 모델 위치, 회전, 크기 사용자간 동기화 (X)
