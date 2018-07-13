import { infoColor } from "assets/jss/material-dashboard-react.jsx";

const dashboardStyle = {
  stats: {
    color: "#999999",
    display: "inline-flex",
    fontSize: "12px",
    lineHeight: "22px",
    "& svg": {
      top: "4px",
      width: "16px",
      height: "16px",
      position: "relative",
      marginRight: "3px"
    }
  },
  cardTitle: {
    color: "#3C4858",
    marginTop: "0px",
    minHeight: "auto",
    fontWeight: "300",
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    marginBottom: "3px",
    textDecoration: "none",
    "& small": {
      color: "#777",
      fontSize: "65%",
      fontWeight: "400",
      lineHeight: "1"
    }
  },
  colorSwitchBase: {
    '&$colorChecked': {
      color: infoColor,
      '& + $colorBar': {
        backgroundColor: infoColor,
      },
    },
  },
  colorBar: {},
  colorChecked: {},
};

export default dashboardStyle;
