import {Box, Button, Stack} from '@mui/joy';
import {styled} from '@mui/joy/styles';
import {useRef} from 'react';
import AddIcon from '@mui/icons-material/Add';
import FormatIndentIncreaseIcon from '@mui/icons-material/FormatIndentIncrease';
import FormatIndentDecreaseIcon from '@mui/icons-material/FormatIndentDecrease';

const PaperContainer = styled(Box)(() => ({
    fontFamily: '"Patrick Hand", cursive',
    position: 'relative',
    lineHeight: '25px',
    boxSizing: 'content-box',
    width: '425px',
    height: '550px',
    backgroundColor: 'white',
    margin: '0 auto',
    boxShadow: '0px 0px 3px 1px rgba(0, 0, 0, 0.2)',
    transition: 'transform 0.3s, margin 0.3s',

    '&:before': {
        content: '""',
        position: 'absolute',
        height: '100%',
        width: '2px',
        background: 'rgba(255, 0, 0, 0.3)',
        marginLeft: '48px',
        zIndex: 2,
    },

    '@media only screen and (max-width: 600px)': {
        marginTop: '-55px',
        transform: 'scale(0.8)',
        transformOrigin: '50% 50%',
    },

    '@media only screen and (max-width: 450px)': {
        marginTop: '-82.5px',
        transform: 'scale(0.7)',
        transformOrigin: '50% 50%',
    },

    '@media only screen and (max-height: 600px)': {
        marginTop: '-110px',
        transform: 'scale(0.6)',
        transformOrigin: '50% 50%',
    },

    '@media only screen and (max-height: 450px)': {
        marginTop: '-137.5px',
        transform: 'scale(0.5)',
        transformOrigin: '50% 50%',
    },

    '@media only screen and (max-width: 430px)': {
        margin: '0',
        marginLeft: '12px',
        marginTop: '-110px',
        transform: 'scale(0.6)',
        transformOrigin: '0% 50%',
    },

    '@media only screen and (max-height: 375px)': {
        margin: '0',
        marginLeft: '12px',
        marginTop: '-165px',
        transform: 'scale(0.4)',
        transformOrigin: '0% 50%',
    },

    '@media only screen and (max-height: 300px)': {
        margin: '0',
        marginLeft: '12px',
        marginTop: '-192.5px',
        transform: 'scale(0.3)',
        transformOrigin: '0% 50%',
    },
}));

const LinesContainer = styled(Box)({
    top: '50px',
    position: 'relative',
    boxSizing: 'content-box',
    height: 'calc(550px - 50px)',
    paddingRight: '8px',
    paddingLeft: '56px',
    backgroundImage: 'repeating-linear-gradient(white 0px, white 23.5px, steelblue 25px)',
    overflow: 'auto',

    '& ul': {
        margin: 0,
        paddingLeft: '20px',
        fontWeight: 'normal', // Reset font weight for lists
    },

    '& ul ul': {
        paddingLeft: '20px',
        marginTop: '0',
        marginBottom: '0',
    },

    '& li': {
        fontWeight: 'normal',
        fontStyle: 'normal',
    },

    '& ul ul li': {
        fontStyle: 'italic',
    },

    '& strong, & b': {
        fontWeight: 'bold',
    },

    '& .title': {
        fontWeight: 'bold',
        display: 'block',
    },
});

const HolesContainer = styled(Box)({
    position: 'absolute',
    height: '100%',
    width: '48px',
    marginTop: '1px',
    marginBottom: '1px',
    top: 0,
    left: 0,
});

const Hole = styled(Box)<{ holePosition: 'top' | 'middle' | 'bottom' }>(({holePosition}) => ({
    position: 'absolute',
    width: '20px',
    height: '20px',
    borderRadius: '50%',
    backgroundColor: 'gainsboro',
    left: '12.5px',
    boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.2) inset',
    top: holePosition === 'top' ? '50px' : holePosition === 'middle' ? '262.5px' : '475px',
}));

const EditableContent = styled(Box)({
    border: 0,
    outline: 0,
    '&:focus': {
        outline: 'none',
    },
});

interface ListCardProps {
    title?: string;
}

function ListCard({
                      title = 'Todo List',
                  }: ListCardProps) {
    const contentRef = useRef<HTMLDivElement>(null);

    const addListItem = () => {
        if (!contentRef.current) return;

        // Use insertUnorderedList command to toggle/add bullet at cursor position
        document.execCommand('insertUnorderedList', false);
    };

    const increaseIndent = () => {
        document.execCommand('indent', false);
    };

    const decreaseIndent = () => {
        document.execCommand('outdent', false);
    };

    return (
        <Box>
            <Stack direction="row" spacing={1} sx={{mb: 2, justifyContent: 'center'}}>
                <Button
                    startDecorator={<AddIcon/>}
                    onClick={addListItem}
                    size="sm"
                    variant="outlined"
                >
                    Add Bullet
                </Button>
                <Button
                    startDecorator={<FormatIndentDecreaseIcon/>}
                    onClick={decreaseIndent}
                    size="sm"
                    variant="outlined"
                >
                    Decrease Indent
                </Button>
                <Button
                    startDecorator={<FormatIndentIncreaseIcon/>}
                    onClick={increaseIndent}
                    size="sm"
                    variant="outlined"
                >
                    Increase Indent
                </Button>
            </Stack>

            <PaperContainer>
                <LinesContainer>
                    <EditableContent
                        ref={contentRef}
                        contentEditable
                        suppressContentEditableWarning
                    >
                        <span className="title">{title}</span>
                        <ul>
                            <li>Groceries
                                <ul>
                                    <li>3 Tomatoes</li>
                                    <li>1 bunch of cherries</li>
                                    <li>6 onions</li>
                                    <li>3 heads of garlic</li>
                                    <li>1 bag spring mix</li>
                                </ul>
                            </li>
                            <li>Cancel gym membership</li>
                            <li>Clean gutters</li>
                            <li>Take package to the post office</li>
                            <li>Call Avery about Ali's party (afternoon)</li>
                            <li>Sort recycling & put out trash</li>
                        </ul>
                    </EditableContent>
                </LinesContainer>
                <HolesContainer>
                    <Hole holePosition="top"/>
                    <Hole holePosition="middle"/>
                    <Hole holePosition="bottom"/>
                </HolesContainer>
            </PaperContainer>
        </Box>
    );
}

export default ListCard;
