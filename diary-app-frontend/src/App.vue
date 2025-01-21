<template>
  <div id="app">
   
    <!-- 라우터와 연결된 컴포넌트를 렌더링 -->
    <router-view />
  </div>
</template>

<script>

export default {
  name: 'App',
  data() {
    return {
      diaries: [], // 초기 상태 설정
    };
  },
};
</script>