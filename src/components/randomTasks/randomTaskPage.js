import React from 'react'
import '../homepage/homePage.css';

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

export default class RandomTasksPage extends React.Component {
    constructor(props) {
        super(props);

        this.userID = props.user.uid
        this.onDataChange = this.onDataChange.bind(this);

        this.state = {
            user: "",
            displayName: "",
            tasks: [],
            taskKeys: []
        };
        this.today = new Date()
    }

    componentDidMount() {
        TaskDataService.get_random_tasks(this.userID).on("value", this.onDataChange);
    }

    componentWillUnmount() {
        TaskDataService.get_random_tasks(this.userID).off("value", this.onDataChange);
    }

    onDataChange(items) {   
        console.log("data change")
        let tasks = [];
        let uobj = items.val()
        console.log(uobj)
        let day = this.today.getDay().toString()
        //CLEAR WEEK MOVED TO APP
        // TaskDataService.clearPastWeek(this.props.user.uid, day)
        if (uobj === null) {
            this.setState({ tasks: {}, taskKeys: [] })
        } else {
            console.log(uobj)
            // this.setState({displayName: uobj["displayName"]})
            // tasks = uobj['random_tasks']
            console.log("Tasks",uobj)
            if(tasks){
                this.setState({ tasks: uobj, taskKeys: Object.keys(uobj) })
            }
            
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
                            direction="column"
                            justifyContent="flex-start"
                            alignItems="flex-start"
                        >
                            <Grid item className={'text-stack home-text-head'} style={{marginTop: '45px'}} sm={12}>
                                {/* <p className={"greeting"}>Hi {this.state.displayName.split(" ")[0]}</p> */}
                                <h1 className={"date-mark"}>Here are all your random tasks</h1>
                                <p className={"motivation"}>Tasks with no days end up here </p>
                            </Grid>
                            <Divider light={true} style={{ width: '100%' }} />

                            <Grid item lg={12} className={'text-stack'} style={{width:'100%'}}>

                                {Object.keys(this.state.tasks).map((task_k, idx) => {
                                    let task = this.state.tasks[task_k]
                                    if(task){
                                        return <TaskComponent key={"task-" + idx} user={user.uid} task={task} taskKey={task_k} open={this.props.open}
                                        setName={this.props.setName} setRep={this.props.setRep} setDays={this.props.setDays}
                                        setTime={this.props.setTime} setEdit={this.props.setEdit} setEditTaskID={this.props.setEditTaskID} setTaskRandom={this.props.setTaskRandom}/>
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
