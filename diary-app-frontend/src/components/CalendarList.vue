<template>
  <div>
    <FullCalendar ref="calendar" :options="calendarOptions" />
  </div>
</template>

<script>
import apiClient from "../services/api.js";
import FullCalendar from "@fullcalendar/vue3";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction"; // 📌 날짜 클릭 이벤트를 사용하려면 필요!

export default {
  components: {
    FullCalendar,
  },
  data() {
    return {
      calendarOptions: {
        plugins: [dayGridPlugin, interactionPlugin], // 📌 FullCalendar 플러그인 추가
        initialView: "dayGridMonth",
        timeZone: "local", // ✅ FullCalendar가 로컬(KST) 시간 기준으로 표시하도록 설정
        displayEventTime: false, // ✅ 시간 표시를 제거하여 날짜 오류 방지
        events: [],
        eventClick: this.handleEventClick, // 일정 클릭 이벤트
        dateClick: this.handleDateClick, // 📌 날짜 클릭 이벤트
      },
    };
  },
  created() {
    this.fetchDiaries();
  },
  methods: {
    formatDate(created_at) {
      if (!created_at) return null;

      let date;

      // ✅ `created_at`이 UNIX timestamp(초 단위)일 경우 처리
      if (!isNaN(created_at) && typeof created_at !== "string") {
        date = new Date(Number(created_at) * 1000);
      } else {
        date = new Date(created_at);
      }

      // ✅ `UTC → KST` 변환
      date.setMinutes(date.getMinutes() + date.getTimezoneOffset());

      return date.toISOString().split("T")[0]; // "YYYY-MM-DD" 반환
    },
    fetchDiaries() {
      apiClient
        .get("/diary")
        .then((response) => {
          if (!response.data || !Array.isArray(response.data.data)) return;

          const events = response.data.data.map(entry => ({
            id: entry.id, // 상세페이지 이동을 위해 ID 포함
            title: entry.title,
            start: this.formatDate(entry.created_at), // ✅ KST로 변환된 날짜 사용
            Prototype: entry.Prototype,
          }));

          this.calendarOptions = {
            ...this.calendarOptions,
            events: events,
            timeZone: "local", // ✅ FullCalendar가 UTC 대신 KST 기준으로 표시
            displayEventTime: false, // ✅ 시간 표시 비활성화
          };
          
          this.$nextTick(() => {
            if (this.$refs.calendar) {
              this.$refs.calendar.getApi().refetchEvents();
            }
          });
        })
        .catch(error => console.error("Error fetching diaries:", error.message));
    },
    // ✅ 일정 클릭 시 상세 페이지로 이동
    handleEventClick(info) {
      console.log("Clicked event:", info.event);
      const eventId = info.event.id;
      if (eventId) {
        this.$router.push(`/edit/${eventId}`);
      }
    },
    // ✅ 날짜 클릭 시 동작
    handleDateClick(info) {
      alert(`📅 선택한 날짜: ${info.dateStr}`);
      console.log("Clicked Date Info:", info);
      
      // 선택한 날짜로 다이어리 작성 페이지 이동
      this.$router.push(`/create?date=${info.dateStr}`);
    },
  }
};
</script>