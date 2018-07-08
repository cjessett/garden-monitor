import {
  infoColor,
} from "assets/jss/material-dashboard-react.jsx";

const sidebarStyle = theme => ({
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
});

export default sidebarStyle;
