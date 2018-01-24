// @flow
import { type Change } from 'slate';

import type Options from '../options';
import { unwrapList, splitListItem, decreaseItemDepth } from '../changes';
import { getCurrentItem, getItemDepth } from '../utils';

/**
 * User pressed Enter in an editor
 *
 * Enter in a list item should split the list item
 * Enter in an empty list item should remove it
 * Shift+Enter in a list item should make a new line
 */
function onEnter(
    event: *,
    change: Change,
    editor: *,
    opts: Options
): void | any {
    // Pressing Shift+Enter
    // should split block normally
    if (event.shiftKey) {
        return undefined;
    }

    const { value } = change;
    const currentItem = getCurrentItem(opts, value);

    // Not in a list
    if (!currentItem) {
        return undefined;
    }

    if (currentItem.isEmpty) {
        // Block is empty, we exit the list
        if (getItemDepth(opts, value) > 1) {
            decreaseItemDepth(opts, change);
            return true;
        }
        // Exit list
        unwrapList(opts, change);
        return true;
    }
    // Split list item
    splitListItem(opts, change);
    return true;
}

export default onEnter;