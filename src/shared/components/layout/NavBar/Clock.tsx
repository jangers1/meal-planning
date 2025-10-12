// Taken from Codepen: https://codepen.io/jkantner/pen/oNJMQWj
// Converted to React

import {useEffect, useRef} from 'react';
import './clock.css';

interface HandRefs {
    h?: HTMLDivElement | null;
    m?: HTMLDivElement | null;
    s?: HTMLDivElement | null;
}

function Clock() {
    const clockRef = useRef<HTMLDivElement>(null);
    const handRefs = useRef<HandRefs>({});
    const timeUpdateLoopRef = useRef<number | undefined>(undefined);

    const getTimeAsObject = () => {
        const date = new Date();
        let h = date.getHours();
        const m = date.getMinutes();
        const s = date.getSeconds();
        const ap = h > 11 ? "PM" : "AM";
        // milliseconds since 1/1/1970
        const since1970 = date.getTime() - date.getTimezoneOffset() * 60 * 1000;
        // deal with midnight and 13:00
        if (h === 0) h += 12;
        else if (h > 12) h -= 12;

        return {h, m, s, ap, since1970};
    };

    const getTimeAsString = () => {
        const {h, m, s, ap} = getTimeAsObject();
        // prepend 0 to the minute and second if single digits
        const mStr = m < 10 ? `0${m}` : m;
        const sStr = s < 10 ? `0${s}` : s;

        return `${h}:${mStr}:${sStr} ${ap}`;
    };

    const timeUpdate = (firstTime = false) => {
        if (!firstTime && clockRef.current) {
            const movingClass = "clock--moving";
            // reapply the animation class to keep the animation in sync with JS
            clockRef.current.classList.remove(movingClass);
            void clockRef.current.offsetWidth;
            clockRef.current.classList.add(movingClass);
        }

        // update the `aria-label`
        if (clockRef.current) {
            clockRef.current.setAttribute("aria-label", getTimeAsString());
        }

        // rotate the hands
        const time = getTimeAsObject();
        (['h', 'm', 's'] as const).forEach(hand => {
            const handEl = handRefs.current[hand];

            if (handEl) {
                let angle: number;
                let animateOffset: number;
                const roundDownSec = Math.floor(time.since1970 / 1000) * 1000;

                switch (hand) {
                    case "h":
                        const msIn12Hrs = 60 * 60 * 12 * 1000;
                        angle = roundDownSec % msIn12Hrs / msIn12Hrs;
                        animateOffset = 0.6;
                        break;
                    case "m":
                        const msIn1Hr = 60 * 60 * 1000;
                        angle = roundDownSec % msIn1Hr / msIn1Hr;
                        animateOffset = 0.75;
                        break;
                    case "s":
                        const msIn1Min = 60 * 1000;
                        angle = roundDownSec % msIn1Min / msIn1Min;
                        animateOffset = 0.9;
                        break;
                }

                angle *= 360;

                if (firstTime) {
                    handEl.animate(
                        [
                            {offset: 0, transform: "rotate(0deg) scaleY(0)"},
                            {offset: 0.3, transform: "rotate(0deg) scaleY(0)"},
                            {offset: animateOffset, transform: `rotate(${angle}deg) scaleY(1)`},
                            {offset: 1, transform: `rotate(${angle}deg) scaleY(1)`},
                        ],
                        {
                            duration: 1000,
                            easing: "ease-in-out"
                        }
                    );
                }
                handEl.style.transform = `rotate(${angle}deg)`;
            }
        });

        // loop
        if (timeUpdateLoopRef.current !== undefined) {
            clearTimeout(timeUpdateLoopRef.current);
        }
        timeUpdateLoopRef.current = setTimeout(() => timeUpdate(false), 1000);
    };

    useEffect(() => {
        // Initialize the clock
        timeUpdate(true);

        // Cleanup function
        return () => {
            if (timeUpdateLoopRef.current !== undefined) {
                clearTimeout(timeUpdateLoopRef.current);
            }
        };
    }, []);

    return (
        <div className="clock-container" aria-label="Clock">
            <div className="clock" role="img" ref={clockRef}>
                <div className="clock__tick clock__tick--0"></div>
                <div className="clock__tick clock__tick--3"></div>
                <div className="clock__tick clock__tick--6"></div>
                <div className="clock__tick clock__tick--9"></div>
                <div
                    className="clock__hand clock__hand--hr"
                    data-hand="h"
                    ref={el => {
                        handRefs.current.h = el;
                    }}
                ></div>
                <div
                    className="clock__hand clock__hand--min"
                    data-hand="m"
                    ref={el => {
                        handRefs.current.m = el;
                    }}
                ></div>
                <div
                    className="clock__hand clock__hand--sec"
                    data-hand="s"
                    ref={el => {
                        handRefs.current.s = el;
                    }}
                ></div>
            </div>
        </div>
    );
}

export default Clock;