import React from 'react'
import './homePage.css';

import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';

import "firebase/database";
import "firebase/auth";
import {
    FirebaseAuthConsumer
} from "@react-firebase/auth";

import TaskComponent from '../task/taskComponent';
import TaskDataService from '../../services/task.service';

const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

export default class HomePage extends React.Component {
    constructor(props) {
        super(props);

        this.userID = props.user.uid
        this.onDataChange = this.onDataChange.bind(this);

        this.state = {
            user: "",
            tasks: [],
            taskKeys: []
        };
        this.today = new Date()
    }

    componentDidMount() {
        TaskDataService.get_user_obj(this.userID).on("value", this.onDataChange);
    }

    componentWillUnmount() {
        TaskDataService.get_user_obj(this.userID).off("value", this.onDataChange);
    }

    onDataChange(items) {
        
        let tasks = [];
        let uobj = items.val()
        console.log(uobj)
        let day = this.today.getDay().toString()
        if (uobj === null) {
            TaskDataService.make_user_obj(this.props.user)
        } else {
            let tasks_for_day = uobj['user_week'][day]['tasks']
            if (tasks_for_day) {
                tasks = tasks_for_day.map(tsk => uobj['all_tasks'][tsk])
            }
            this.setState({ tasks: tasks, taskKeys: tasks_for_day })
        }

    }

    dayToday = (num) => {
        switch (num) {
            case 1: return "Monday";
            case 2: return "Tuesday";
            case 3: return "Wednesday";
            case 4: return "Thursday";
            case 5: return "Friday";
            case 6: return "Saturday";
            case 0: return "Sunday";
            default: return ""
        }
    }
    superscript = (date) => {
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

    render() {

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
                                <h1 className={"date-mark"}>It's {this.dayToday(this.today.getDay())}, {String(this.today.getDate()).padStart(2, '0')}<sup>{this.superscript(this.today.getDate())}</sup>  {monthNames[this.today.getMonth()]}</h1>
                                <p className={"motivation"}>Have a nice day or something idk</p>
                            </Grid>
                            <Divider light={true} style={{ width: '100%' }} />

                            <Grid item sm={12} className={'text-stack'}>

                                {this.state.tasks.map((task, idx) => {
                                    if(task){
                                        return <TaskComponent key={"task-" + idx} user={user.uid} task={task} taskKey={this.state.taskKeys[idx]} open={this.props.open}
                                        setName={this.props.setName} setRep={this.props.setRep} setDays={this.props.setDays}
                                        setTime={this.props.setTime} setEdit={this.props.setEdit} setEditTaskID={this.props.setEditTaskID} />
                                    }
                                    
                                })}


                            </Grid>

                        </Grid>
                    );
                }}
            </FirebaseAuthConsumer>
        )
    }

}
