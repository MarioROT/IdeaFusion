import { util } from '@clientio/rappid';
import { TREE_PARENT_GAP, TREE_SIBLING_GAP } from '../../theme';

export default {
    parentGap: TREE_PARENT_GAP,
    siblingGap: TREE_SIBLING_GAP,
    updateVertices: util.noop,
    updateAttributes: (layoutArea, element) => {
        // Normalize sibling rank
        const { siblingRank } = layoutArea;
        element.set({ siblingRank });
    }
};
