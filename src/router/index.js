import { createRouter, createWebHistory } from "vue-router";
import HomeView from "@/views/HomeView.vue";
import ChatView from "@/views/ChatView.vue";

const router = createRouter({
	history: createWebHistory(""),
	routes: [
		{
			path: "/",
			name: "home",
			component: HomeView,
		},
		{
			path: "/chat",
			name: "chat",
			component: ChatView,
			// props: route => ({ brand: route.query.brand, model:route.query.model  })
		},
	],
});

export default router;

