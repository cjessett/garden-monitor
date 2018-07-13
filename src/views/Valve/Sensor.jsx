import React from 'react';

import Grid from "@material-ui/core/Grid";
import Typography from '@material-ui/core/Typography';
import AccessTime from "@material-ui/icons/AccessTime";

import GridItem from "components/Grid/GridItem.jsx";
import Card from "components/Card/Card.jsx";
import CardBody from "components/Card/CardBody.jsx";
import CardFooter from "components/Card/CardFooter.jsx";

export default function Sensor({ id, name, moisture, classes }) {
  return (
    <Card>
      <CardBody>
        <Grid container spacing={0} alignItems="center">
          <GridItem xs={6}>
            <h4 className={classes.cardTitle}>{name}</h4>
          </GridItem>
          <GridItem xs={6}>
            <Typography variant="display2">{moisture}</Typography>
          </GridItem>
        </Grid>
      </CardBody>
      <CardFooter chart>
        <span className={classes.stats}>
          <AccessTime /> updated 2 hours ago
        </span>
      </CardFooter>
    </Card>
  )
}
