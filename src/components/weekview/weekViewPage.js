import React from 'react'
import './weekView.css';

import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import "firebase/database";
import "firebase/auth";
import {
    FirebaseAuthConsumer
} from "@react-firebase/auth";

import TaskComponent from '../task/taskComponent';
import TaskDataService from '../../services/task.service';

const daysNames = ['Sunday', 'Monday','Tuesday','Wednesday','Thursday','Friday','Saturday']

export default class WeekView extends React.Component {
    constructor(props) {
        super(props);

        this.userID = props.user.uid
        this.onDataChange = this.onDataChange.bind(this);

        this.state = {
            user: "",
            displayName: "",
            tasks: {},
            taskKeys: {}
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
        let uobj = items.val()
        if (uobj === null) {
            TaskDataService.make_user_obj(this.props.user, "")
        } else {
            this.setState({displayName: uobj["displayName"]})
            let all_tasks = {}
            let all_tasks_keys = {}
            for (let i = 0; i < 7; i++) {
                all_tasks_keys[i] = uobj['user_week'][i]['tasks']
                if (all_tasks_keys[i]) {
                    all_tasks[i] = all_tasks_keys[i].map(tsk => 
                        {if (uobj.hasOwnProperty('all_tasks')) return uobj['all_tasks'][tsk] })
                }else{
                    all_tasks[i] = []
                }
            }
            this.setState({ tasks: all_tasks, taskKeys: all_tasks_keys })
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
                                <p className={"greeting"}>Hi {this.state.displayName.split(" ")[0]}</p>
                                <h1 className={"date-mark"}>Here's a look at your week</h1>
                            </Grid>
                            <Divider light={true} style={{ width: '100%',marginBottom: 15, marginTop: 15 }} />
                            <Grid item lg={12}className={'text-stack'} style={{flexGrow:1}} >
                            
                                {Object.keys(this.state.tasks).map((day_id, index) => {
                                    return (
                                        <Accordion key={`accordion-${index}`}>
                                            <AccordionSummary
                                                key={`accordion-sum-${index}`}
                                                expandIcon={<ExpandMoreIcon />}
                                                aria-controls={`panel${index}a-content`} 
                                                id="panel1a-header"
                                            >
                                                {daysNames[day_id]}
                                            </AccordionSummary>
                                            <AccordionDetails key={`accordion-det-${index}`}>
                                            <Grid item lg={12} className={'text-stack'} style={{width:'100%'}}>
                                                {this.state.tasks[day_id].map((task, idx) => {
                                                    
                                                    if (task) {
                                                        return <TaskComponent key={"task-" + +day_id + '_'+idx} user={user.uid} task={task} taskKey={this.state.taskKeys[day_id][idx]} open={this.props.open}
                                                            setName={this.props.setName} setRep={this.props.setRep} setDays={this.props.setDays}
                                                            setTime={this.props.setTime} setEdit={this.props.setEdit} setEditTaskID={this.props.setEditTaskID} />
                                                    }

                                                })}
                                                 </Grid>
                                            </AccordionDetails>
                                        </Accordion>
                                    )

                                })}
                            </Grid>



                           

                        </Grid>
                    );
                }}
            </FirebaseAuthConsumer>
        )
    }

}
