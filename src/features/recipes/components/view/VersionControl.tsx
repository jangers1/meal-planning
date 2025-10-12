import { Box, Select } from "@mui/joy";
import HistoryIcon from '@mui/icons-material/History';
import {useState} from "react";

interface VersionControlProps {
    currentVersion: string;
    versions: string[];
    onVersionChange: (version: string) => void;
}

function VersionControl({ currentVersion, versions, onVersionChange }: VersionControlProps) {
    // const [version, setVersion] = useState(currentVersion);

    return (
        <>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 1
                }}
            >
                <div>
                    <HistoryIcon />
                </div>
                <Select
                    color="primary"
                    value={currentVersion}
                >

                </Select>
            </Box>
        </>
    )
}

export default VersionControl;