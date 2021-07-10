import React, { useState } from 'react'
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import { withStyles } from '@material-ui/core/styles';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import RadioButtonUncheckedOutlinedIcon from '@material-ui/icons/RadioButtonUncheckedOutlined';

import './taskComponent.css'

import { ContextMenu, MenuItem, ContextMenuTrigger } from "react-contextmenu";
function handleClick(e, data) {
    console.log(data.foo);
}

//Props:
//Task Object
//Check Function
export default function TaskComponent() {
    let [complete, setComplete] = useState(false); //task complete
    let rec = true; //reccuring
    let col = rec ? '#a9e3f3' : '#f3c1a9'

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
    }

    return (
        <>
            <ContextMenuTrigger id="same_unique_identifier">
                <Paper elevation={3} className={rec ? "task-paper reccuring" : "task-paper one-time"}>
                    <Grid
                        className={"task-grid"}
                        container
                        direction="row"
                        justifyContent="flex-start"
                        alignItems="flex-start"
                    >
                        <Grid item className={"task-checkbox"} >
                            <FormControlLabel
                                control={<ColouredCheckbox onChange={checkTask} checked={complete} icon={<RadioButtonUncheckedOutlinedIcon fontSize="medium" />} checkedIcon={<CheckCircleIcon fontSize="medium" />} name="checkedH" />}
                            />
                        </Grid>
                        <Grid item sm={6} className={"task-name"} >
                            <p className={complete ? "strikethrough" : undefined} style={{ margin: 0 }}>AA 102</p>
                        </Grid>
                        <Grid item sm={5} className={"task-days"} ><p className={complete ? "strikethrough" : undefined} style={{ margin: 0 }}>M/W/F 9:30AM</p></Grid>


                    </Grid>
                </Paper>
            </ContextMenuTrigger>
            <ContextMenu id="same_unique_identifier">
                <MenuItem data={{ foo: 'bar' }} onClick={handleClick}>
                    ContextMenu Item 1
                </MenuItem>
                <MenuItem data={{ foo: 'bar' }} onClick={handleClick}>
                    ContextMenu Item 2
                </MenuItem>
                <MenuItem divider />
                <MenuItem data={{ foo: 'bar' }} onClick={handleClick}>
                    ContextMenu Item 3
                </MenuItem>
            </ContextMenu>
        </>
    )

}