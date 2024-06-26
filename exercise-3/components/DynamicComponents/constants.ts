
/*
    simply defining the components to load (in order) for the portal I used a simular approach
    to dynamically load blocks.
 */

export const COMPONENTS = [
    {
        component: defineAsyncComponent(() => import('~/components/AnimatedLogo/index.vue'))
    },
    {
        component: defineAsyncComponent(() => import('~/components/Result/index.vue'))
    },
    {
        component: defineAsyncComponent(() => import('~/components/Form/index.vue'))
    },
]