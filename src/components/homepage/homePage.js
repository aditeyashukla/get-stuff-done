import React from 'react'
import './homePage.css';

import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';

import "firebase/auth";
import {
    FirebaseAuthConsumer
} from "@react-firebase/auth";
import TaskComponent from '../task/taskComponent';

export default function HomePage() {
    let today = new Date()
    const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
    const dayToday = (num) => {
        switch (num) {
            case 1: return "Monday";
            case 2: return "Tuesday";
            case 3: return "Wednesday";
            case 4: return "Thursday";
            case 5: return "Friday";
            case 6: return "Saturday";
            case 7: return "Sunday";
            default: return ""
        }
    }
    const superscript = (date) => {
        if (date === 1) {
            return "st"
        } else if (date === 2) {
            return "nd"
        } else if (date === 3) {
            return "rd"
        } else if (date >= 4) {
            return "th"
        } else {
            return ""
        }
    }
    return (
        <FirebaseAuthConsumer>
            {({ isSignedIn, user, providerId }) => {
                return (
                    <Grid
                        className={'home-head'}
                        container 
                        direction="row"
                        justifyContent="flex-start"
                        alignItems="flex-start"
                    >
                        <Grid item className={'text-stack home-text-head'} sm={12}>
                            <p className={"greeting"}>Hi {user.displayName.split(" ")[0]}</p>
                            <h1 className={"date-mark"}>It's {dayToday(today.getDay())}, {String(today.getDate()).padStart(2, '0')}<sup>{superscript(today.getDate())}</sup>  {monthNames[today.getMonth()]}</h1>
                            <p className={"motivation"}>Have a nice day or something idk</p>
                        </Grid>
                        <Divider light={true} style={{width:'100%'}}/>
                        
                        <Grid item sm={12} className={'text-stack'}>
                            <TaskComponent/>
                            
                        </Grid>

                    </Grid>
                );
            }}
        </FirebaseAuthConsumer>
    )
}
