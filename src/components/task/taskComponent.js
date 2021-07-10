import React from 'react'
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import { withStyles } from '@material-ui/core/styles';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import RadioButtonUncheckedOutlinedIcon from '@material-ui/icons/RadioButtonUncheckedOutlined';

import './taskComponent.css'

//Props:
//Task Object
//Check Function
export default function TaskComponent() {
    let rec = true;
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

    return (
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
                        control={<ColouredCheckbox icon={<RadioButtonUncheckedOutlinedIcon fontSize="medium" />} checkedIcon={<CheckCircleIcon fontSize="medium" />} name="checkedH" />}
                    />
                </Grid>
                <Grid item sm={6} className={"task-name"} >
                    AA 102</Grid>
                <Grid item sm={5} className={"task-days"} >M/W/F 9:30AM</Grid>
                
                
            </Grid>
            

        </Paper>
    )

}