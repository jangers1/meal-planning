import {Box, Button, Typography} from '@mui/joy';
import {useEffect, useState} from "react";
import CalenderItem from "./CalenderItem.tsx";
import ButtonedSelector from "../../../../shared/components/ui/ButtonedSelector.tsx";

function Calender() {
    const CURRENT_YEAR = new Date().getFullYear();
    const CURRENT_MONTH = new Date().getMonth() + 1;
    const CURRENT_DAY = new Date().getDate();

    const MONTHS = [
        {id: 1, name: 'January', days: 31},
        {
            id: 2,
            name: 'February',
            days: (CURRENT_YEAR % 4 === 0 && (CURRENT_YEAR % 100 !== 0 || CURRENT_YEAR % 400 === 0)) ? 29 : 28
        },
        {id: 3, name: 'March', days: 31},
        {id: 4, name: 'April', days: 30},
        {id: 5, name: 'May', days: 31},
        {id: 6, name: 'June', days: 30},
        {id: 7, name: 'July', days: 31},
        {id: 8, name: 'August', days: 31},
        {id: 9, name: 'September', days: 30},
        {id: 10, name: 'October', days: 31},
        {id: 11, name: 'November', days: 30},
        {id: 12, name: 'December', days: 31},
    ];

    const [month, setMonth] = useState<number>(CURRENT_MONTH);
    const [year, setYear] = useState<number>(CURRENT_YEAR);
    const [days, setDays] = useState<number>(
        MONTHS.find(m => m.id === CURRENT_MONTH)?.days || 30
    );
    const [startDayOffset, setStartDayOffset] = useState<number>(0);
    const [selectedDate, setSelectedDate] = useState<{ day: number, month: number, year: number } | null>(null);

    const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    useEffect(() => {
        const selectedMonth = MONTHS.find(m => m.id === month);
        if (selectedMonth) {
            if (selectedMonth.id === 2) {
                // February: recalculate for leap year
                const isLeap = year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
                setDays(isLeap ? 29 : 28);
            } else {
                setDays(selectedMonth.days);
            }
        }

        // Calculate which day of the week the 1st falls on
        const firstDay = new Date(year, month - 1, 1);
        let dayOfWeek = firstDay.getDay(); // 0 = Sunday, 1 = Monday, etc.
        // Convert to Monday = 0, Tuesday = 1, ..., Sunday = 6
        dayOfWeek = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
        setStartDayOffset(dayOfWeek);
    }, [month, year]);

    const todayButtonHandler = () => {
        const now = new Date();
        setMonth(now.getMonth() + 1);
        setYear(now.getFullYear());
    }

    const handleDayClick = (day: number) => {
        setSelectedDate({day, month, year});
    }

    const isToday = (day: number) => {
        return day === CURRENT_DAY && month === CURRENT_MONTH && year === CURRENT_YEAR;
    }

    const isSelected = (day: number) => {
        return selectedDate?.day === day && selectedDate?.month === month && selectedDate?.year === year;
    }

    // Show circle on selected day, or on today if no date is selected
    const shouldShowCircle = (day: number) => {
        if (selectedDate) {
            return isSelected(day);
        }
        return isToday(day);
    }

    return (
        <Box>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                    gap: 2,
                }}
            >
                <ButtonedSelector
                    startingValue={month}
                    setterFunc={setMonth}
                    acceptZero={false}
                    stringValues={MONTHS.map(m => ({id: m.id, name: m.name}))}
                />
                <ButtonedSelector
                    startingValue={year}
                    setterFunc={setYear}
                    acceptZero={false}
                />
                <Button
                    size={'sm'}
                    onClick={() => todayButtonHandler()}
                >
                    Today
                </Button>
            </Box>
            <Box
                sx={{
                    display: 'grid',
                    gridTemplateColumns: `repeat(7, 1fr)`,
                    gridTemplateRows: '30px',
                    gridAutoRows: '140px',
                    gap: 1,
                }}
            >
                {DAYS.map((day, idx) => (
                    <Typography key={idx} level={'title-lg'}>{day}</Typography>
                ))}
                {/* Empty cells for offset */}
                {Array.from({length: startDayOffset}, (_, i) => (
                    <Box key={`offset-${i}`}/>
                ))}
                {/* Actual calendar days */}
                {Array.from({length: days}, (_, i) => (
                    <CalenderItem
                        key={i}
                        date={i + 1}
                        isToday={shouldShowCircle(i + 1)}
                        isSelected={false}
                        onClick={() => handleDayClick(i + 1)}
                    />
                ))}
            </Box>
        </Box>
    )
}

export default Calender;