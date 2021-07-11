import React, { useState } from 'react'
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import { withStyles } from '@material-ui/core/styles';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import RadioButtonUncheckedOutlinedIcon from '@material-ui/icons/RadioButtonUncheckedOutlined';
import Divider from '@material-ui/core/Divider';

import './taskComponent.css'

import {ContextMenu, MenuItem, ContextMenuTrigger} from "react-contextmenu";


//Props:
//Task Object
//Check Function
export default class TaskComponent extends React.Component {
    constructor(props) {
        super(props);
        this.t = props.task;
        this.id = props.taskId
        this.rec = props.task.repeat
        this.col = props.task.repeat ? '#a9e3f3' : '#f3c1a9'
        
        this.state={
            complete: false
        }
    }

    ColouredCheckbox = withStyles({
        root: {
            color: this.col,
            '&$checked': {
                color: this.col,
            },
        },
        checked: {},
    })((props) => <Checkbox color="default" {...props} />);

    checkTask=(e)=>{
        let element = e.target
        this.setState({complete: element.checked})
        element.classList.toggle("strikethrough");
    }

    returnDTString = (days, time)=>{
        let dayNames = ['Sun','M','T','W','Th','F','Sat']
        let daystring = ""
        for(let i=0;i<days.length;i++){
            if(i!==0){
            daystring = daystring + `/${dayNames[i]}`
            }else{
                daystring = daystring + `${dayNames[i]}`
            }
        }
        return time === undefined ? daystring :  daystring + " " + this.tConvert(time)
    }

    tConvert (time) {
        // Check correct time format and split into components
        time = time.toString ().match (/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];
      
        if (time.length > 1) { // If time format correct
          time = time.slice (1);  // Remove full string match value
          time[5] = +time[0] < 12 ? 'AM' : 'PM'; // Set AM/PM
          time[0] = +time[0] % 12 || 12; // Adjust hours
        }
        return time.join (''); // return adjusted time or original string
      }

    editTask = ()=>{
        this.props.setName(this.t.name)
        this.props.setRep(this.t.repeat)
        //props.setDays() //DO THIS
        this.props.setTime(this.t.time)
        this.props.setEdit(true)
        this.props.open(true) 
      }
      handleClick = (e, data) => {
		alert(`Clicked on menu ${data.item}`);
	};
    render(){

    
    return (
        <>
            <ContextMenuTrigger id="same_unique_identifier">
                <Paper elevation={3} className={this.rec ? "task-paper reccuring" : "task-paper one-time"}>
                    <Grid
                        className={"task-grid"}
                        container
                        direction="row"
                        justifyContent="flex-start"
                        alignItems="flex-start"
                    >
                        <Grid item className={"task-checkbox"} >
                            <FormControlLabel
                                control={<this.ColouredCheckbox onChange={this.editTask} checked={this.complete} icon={<RadioButtonUncheckedOutlinedIcon fontSize="medium" />} checkedIcon={<CheckCircleIcon fontSize="medium" />} name="checkedH" />}
                            />
                        </Grid>
                        <Grid item sm={6} className={"task-name"} >
                            <p className={this.complete ? "strikethrough" : undefined} style={{ margin: 0 }}>{this.t.name}</p>
                        </Grid>
                        <Grid item sm={5} className={"task-days"} ><p className={this.complete ? "strikethrough" : undefined} style={{ margin: 0 }}>{this.returnDTString(this.t.days,this.t.time)}</p></Grid>


                    </Grid>
                </Paper>
            </ContextMenuTrigger>
            <ContextMenu id="same_unique_identifier">
                <MenuItem data={{ foo: 'bar' }} onClick={this.editTask}>
                    Edit Task
                </MenuItem>
                <Divider className={'context-menu-divider'}/>
                <MenuItem data={{ foo: 'bar' }} onClick={e=>console.log("hi")}>
                    Delete Task
                </MenuItem>
                
                

            </ContextMenu>
        </>
    )
    }
}