import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import StratesysCarsView from '../views/Stratesys/Cars/HomeView.vue'
import ChatView from '../views/Stratesys/Cars/ChatView.vue'
import CustomVisionShopView from '../views/Stratesys/Cars/CustomVisionShopView.vue'
import DocumentsClassificationView from '../views/Stratesys/Cars/DocumentsClassificationView.vue'
import StratesysDocIntView from '../views/Stratesys/DocIntelligence/HomeView.vue'
import RepsolDocIntView from '../views/Repsol/DocIntelligence/HomeView.vue'
import RepsolCustomVisionView from '../views/Repsol/CustomVision/HomeView.vue'
import SummaryView from '../views/Repsol/CustomVision/SummaryView.vue'
import ClassificationView from '../views/Stratesys/DocIntelligence/ClassificationView.vue'
import ParticularDocView from '../views/Stratesys/DocIntelligence/ParticularDocumentView.vue'
import OnboardingView from '../views/Stratesys/DocIntelligence/OnboardingView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/stratesys-cars',
      name: 'stratesys-cars',
      component: StratesysCarsView,
    },
    {
      path: '/stratesys-cars/chat',
      name: 'chat',
      component: ChatView,
      // props: route => ({ brand: route.query.brand, model:route.query.model  })
      // http://localhost:5173/stratesys-cars/chat?brand=toyota&model=corolla
    },
    {
      path: '/stratesys-cars/shop',
      name: 'shop',
      component: CustomVisionShopView,
    },
    {
      path: '/stratesys-cars/classification',
      name: 'cars-classification',
      component: DocumentsClassificationView,
    },
    {
      path: '/stratesys-docint',
      name: 'stratesys-docint',
      component: StratesysDocIntView,
    },
    {
      path: '/stratesys-docint/classification',
      name: 'classification',
      component: ClassificationView,
    },
    {
      path: '/stratesys-docint/particular',
      name: 'particular',
      component: ParticularDocView,
    },
    {
      path: '/stratesys-docint/onboarding',
      name: 'onboarding',
      component: OnboardingView,
    },
    {
      path: '/repsol-docint',
      name: 'repsol-docint',
      component: RepsolDocIntView,
    },
    {
      path: '/repsol-custom-vision',
      name: 'repsol-custom-vision',
      component: RepsolCustomVisionView,
    },
    {
      path: '/repsol-custom-vision/summary',
      name: 'summary',
      component: SummaryView,
    },
  ],
})

export default router
