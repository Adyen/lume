import { computed, PropType } from '@vue/composition-api';
import { Alluvial } from '@/types/alluvial';

export const withData = () => ({
    data: {
        type: Object as PropType<Alluvial>,
        default: () => ({})
    }
});

export function allAlluvialProps(alluvial: Alluvial, defaultAlluvial: Alluvial) {
    const alluvialProps = computed<Alluvial>(() => ({
        ...defaultAlluvial,
        ...alluvial,
    }));
    return { alluvialProps };
}