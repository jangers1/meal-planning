import React, {useCallback, useMemo, useState} from 'react';
import type {Descendant} from 'slate';
import {createEditor} from 'slate';
import {Editable, Slate, withReact} from 'slate-react';
import {withHistory} from 'slate-history';
import {Box, Sheet} from '@mui/joy';
import {Toolbar} from '../components/richtext/Toolbar.tsx';
import {Element} from '../components/richtext/Element.tsx';
import {Leaf} from '../components/richtext/Leaf.tsx';
import {HOTKEYS, indentListItem, isListItemActive, toggleMark, unindentListItem} from '../components/richtext/utils.ts';
import type {CustomText, RenderElementProps, RenderLeafProps} from '../types/richtext.types.ts';

const RichTextField: React.FC = () => {
    const editor = useMemo(() => withHistory(withReact(createEditor())), []);
    const [value, setValue] = useState<Descendant[]>([{type: 'paragraph', children: [{text: ''}]}]);

    const renderElement = useCallback((props: RenderElementProps) => <Element {...props} />, []);
    const renderLeaf = useCallback((props: RenderLeafProps) => <Leaf {...props} />, []);

    const handleKeyDown = (event: React.KeyboardEvent) => {
        // Handle hotkeys for formatting
        const hotkey = (event.ctrlKey || event.metaKey) && HOTKEYS[event.key as keyof typeof HOTKEYS];
        if (hotkey) {
            event.preventDefault();
            toggleMark(editor, hotkey as keyof CustomText);
            return;
        }

        // Handle Tab for list indentation
        if (event.key === 'Tab') {
            if (isListItemActive(editor)) {
                event.preventDefault();
                if (event.shiftKey) {
                    unindentListItem(editor);
                } else {
                    indentListItem(editor);
                }
            }
        }
    };

    return (
        <Sheet variant="outlined" sx={{borderRadius: 'md', display: 'flex', flexDirection: 'column', maxHeight: '90%'}}>
            <Slate editor={editor} initialValue={value} onValueChange={setValue}>
                <Toolbar/>
                <Box sx={{flex: 1, overflowY: 'auto', p: 2}}>
                    <Editable
                        renderElement={renderElement}
                        renderLeaf={renderLeaf}
                        placeholder="Type recipe here. Any formatting will save."
                        spellCheck
                        autoFocus
                        style={{flex: 1, outline: 'none', width: '100%'}}
                        onKeyDown={handleKeyDown}
                    />
                </Box>
            </Slate>
        </Sheet>
    );
};

export default RichTextField;
