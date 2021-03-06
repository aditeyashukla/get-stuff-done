//TaskComponent.js
import React, { useState } from 'react'
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import { withStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';

import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import RadioButtonUncheckedOutlinedIcon from '@material-ui/icons/RadioButtonUncheckedOutlined';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';

import TaskDataService from '../../services/task.service';

import './taskComponent.css'

import {
    Menu,
    Item,
    Separator,
    useContextMenu,
    theme
} from "react-contexify";

import "react-contexify/dist/ReactContexify.css";

const MENU_ID = "menu-id";

export default function TaskComponent(props) {
    
    let t = props.task;
    let id = props.taskKey
    let user = props.user
    const [complete, setComplete] = useState(t.complete); //task complete
    let rec = t.repeat; //reccuring
    let col = rec ? '#a9e3f3' : '#99c7b9'

    const { show } = useContextMenu({ id: MENU_ID });

    function handleItemClick({ event, props, triggerEvent, data }) {
        console.log(event, props, triggerEvent, data);
    }

    const ColouredCheckbox = withStyles({
        root: {
            color: col,
            '&$checked': {
                color: col,
            },
        },
        checked: {},
    })((props) => <Checkbox color="default" {...props} />);

    function checkTask(e) {
        let element = e.target
        setComplete(element.checked)
        element.classList.toggle("strikethrough");
        let random = 'random' in t ? t.random : false
        TaskDataService.changeTaskStatus(user,id,element.checked,random)
    }

    function returnDTString(days, time) {
        let dayNames = ['Sun', 'M', 'T', 'W', 'Th', 'F', 'Sat']
        let daystring = ""
        for (let i = 0; i < days.length; i++) {
            if (i !== 0) {
                daystring = daystring + `/${dayNames[days[i]]}`
            } else {
                daystring = daystring + `${dayNames[days[i]]}`
            }
        }
        return time === undefined ? daystring : daystring + " " + tConvert(time)
    }

    function tConvert(time) {
        // Check correct time format and split into components
        time = time.toString().match(/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];

        if (time.length > 1) { // If time format correct
            time = time.slice(1);  // Remove full string match value
            time[5] = +time[0] < 12 ? 'AM' : 'PM'; // Set AM/PM
            time[0] = +time[0] % 12 || 12; // Adjust hours
        }
        return time.join(''); // return adjusted time or original string
    }

    function formatDays(dList) {
        let start = { 0: false, 1: false, 2: false, 3: false, 4: false, 5: false, 6: false }
        for (let i = 0; i < dList.length; i++) {
            start[parseInt(dList[i])] = true
        }
        return start
    }

    function editTask() {
        props.setName(t.name)
        props.setRep(t.repeat)
        props.setEditTaskID(id)
        if(t.random){
            props.setTaskRandom(true)
        }else{
            props.setDays(formatDays(t.days))
            props.setTime(t.time)
        }
        props.setEdit(true)
        props.open(true)
    }

    function deleteTask(){
        let random = 'random' in t ? t.random : false
        TaskDataService.delete(user, id, random)
    }
    return (
        <>
            <div style={{width:'100%'}}onContextMenu={show}>
                <Paper elevation={3} className={rec ? "task-paper reccuring" : "task-paper one-time"}>
                    <Grid
                        className={"task-grid"}
                        container
                        direction="row"
                        justifyContent="flex-start"
                        alignItems="flex-start"
                        // spacing={1}
                    >
                        <Grid item className={"task-checkbox"} >
                            <FormControlLabel
                                control={<ColouredCheckbox onChange={checkTask} checked={complete} icon={<RadioButtonUncheckedOutlinedIcon fontSize="medium" />} checkedIcon={<CheckCircleIcon fontSize="medium" />} name="checkedH" />}
                            />
                        </Grid>
                        <Grid item xs={5} className={"task-name"} >
                            <p className={complete ? "strikethrough" : undefined} style={{ margin: 0 }}>{t.name}</p>
                        </Grid>
                        {!t.random &&
                        <Grid item xs={4} className={"task-days"} ><p className={complete ? "strikethrough" : undefined} style={{ margin: 0 }}>{returnDTString(t.days, t.time)}</p></Grid>
                        }
                        
                        <Grid item xs={1} className={"task-icons"}>
                            <IconButton aria-label="edit" onClick={editTask}><EditIcon /></IconButton>
                            <IconButton aria-label="delete" onClick={deleteTask} ><DeleteIcon /></IconButton>
                        </Grid>
                        

                    </Grid>
                </Paper>
            </div>
            <Menu id={MENU_ID} theme={theme.dark}>
                <Item onClick={editTask}>
                    Edit Task
                </Item>
                <Separator />
                <Item onClick={deleteTask}>
                    Delete Task
                </Item>
            </Menu>
        </>
    )

}