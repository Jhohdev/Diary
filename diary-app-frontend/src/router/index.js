import { createRouter, createWebHistory } from 'vue-router';
import DiaryList from '../components/DiaryList.vue';
import DiaryForm from '../components/DiaryForm.vue';
import EditDiaryForm from '../components/EditDiaryForm.vue';

const routes = [
  { path: '/', component: DiaryList },
  { path: '/create', component: DiaryForm },
  { path: '/edit/:id', component: EditDiaryForm, props: true },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  console.log('Navigating to:', to.path);
  next();
});

export default router;