import EStyleSheet from 'react-native-extended-stylesheet';
import {
    Dimensions,
    Platform,
    StatusBar
} from 'react-native';

const entireScreenWidth = Dimensions.get('window').width;
const X_WIDTH = 375;
const X_HEIGHT = 812;
const XSMAX_WIDTH = 414;
const XSMAX_HEIGHT = 896;
const {
    height,
    width
} = Dimensions.get('window');
const isIPhoneX = () => Platform.OS === 'ios' && !Platform.isPad && !Platform.isTVOS ?
    width === X_WIDTH && height === X_HEIGHT || width === XSMAX_WIDTH && height === XSMAX_HEIGHT :
    false;
const barHeight = Platform.select({
    ios: isIPhoneX() ? 44 : 20,
    android: StatusBar.currentHeight,
    default: 0
})
EStyleSheet.build({
    $rem: entireScreenWidth / 30
});

export default EStyleSheet.create({
    body: {
        flex: 1,
        paddingTop: barHeight,
        alignItems: 'center',
        flexDirection: "column",
    },
    "flex": {
        display: "flex"
    },
    "column": {
        display: "flex",
        flexDirection: "column"
    },
    "row": {
        display: "flex",
        flexWrap: "wrap",
        flexDirection: "row"
    },
    "centerX": {
        justifyContent: "center"
    },
    "centerY": {
        alignItems: "center"
    },
    "toleft": {
        justifyContent: "flex-start"
    },
    "toright": {
        justifyContent: "flex-end"
    },
    "totop": {
        alignItems: "flex-start"
    },
    "tobottom": {
        alignContent: "flex-end"
    },
    "alignallcenter *": {
        alignItems: "center"
    },
    "spacebetween": {
        justifyContent: "space-between"
    },
    "spacearound": {
        justifyContent: "space-around"
    },
    "button": {
        borderWidth: 0,
        padding: "0.5rem 1rem",
        margin: "0.2rem",
        borderRadius: "0.7rem",
        fontSize: "1.1rem",
        fontWeight: "bold",
        justifyContent: "center",
    },
    "input": {
        margin: "0.5rem",
        borderRadius: "0.2rem",
        padding: "0.5rem",
        borderWidth: 0,
    },
    "fillX": {
        display: "flex",
        flex: 1
    },
    "smallRound": {
        borderRadius: "0.5rem"
    },
    "rounded": {
        borderRadius: "20rem"
    },
    "dmL1": {
        backgroundColor: "#0C1B31"
    },
    "dmL2": {
        backgroundColor: "rgb(42, 41, 51)"
    },
    "dmL3": {
        backgroundColor: "#102442"
    },
    "dmL4": {
        backgroundColor: "#464646"
    },
    "dmL5":{
        backgroundColor:"#15315c"
    },
    "wmL1": {
        backgroundColor: "white"
    },
    "wmL2": {
        backgroundColor: "rgb(238, 238, 238)"
    },
    "wmL3": {
        backgroundColor: "#c0c0c0"
    },
    "wmL4": {
        backgroundColor: "#939393"
    },
    "smalltext": {
        fontSize: "0.7rem",
        lineHeight: "1.2rem"
    },
    "normaltext": {
        fontSize: "1rem",
        lineHeight: "1.5rem"
    },
    "mediumtext": {
        fontSize: "1.3rem",
        lineHeight: "1.8rem"
    },
    "bigtext": {
        fontSize: "1.8rem",
        lineHeight: "2rem"
    },
    "title": {
        textAlign: "center",
        fontSize: "3rem",
        margin: "1rem",
        width: "100%"
    },
    "margin1": {
        margin: "1rem"
    },
    "margin2": {
        margin: "2rem"
    },
    "margin05": {
        margin: "0.5rem"
    },
    "marginbottom1": {
        marginBottom: "1rem"
    },
    "marginbottom2": {
        marginBottom: "2rem"
    },
    "marginbottom4": {
        marginBottom: "5rem"
    },
    "marginbottom6": {
        marginBottom: "6rem"
    },
    "margintop1": {
        marginTop: "1rem"
    },
    "margintop2": {
        marginTop: "2rem"
    },
    "margintop4": {
        marginTop: "5rem"
    },
    "margintop6": {
        marginTop: "6rem"
    },
    "padding1": {
        padding: "1rem"
    },
    "padding05": {
        padding: "0.5rem"
    },
    "div90": {
        width: "95%",
        lineHeight: "1.5rem",
        padding: "1rem",
        borderRadius: "0.5rem",
        margin: "1rem"
    },
    "container": {
        lineHeight: "1.5rem",
        padding: "0.5rem",
        borderRadius: "0.8rem",
        margin: "0.5rem"
    },
    "containerborder": {
        borderWidth: "2rem",
        borderColor: "#d8d8d8"
    },
    "red": {
        backgroundColor: "#f54242",
        color: "white"
    },
    "yellow": {
        backgroundColor: "#f1bb4e",
        color: "rgb(20, 20, 20)"
    },
    "green": {
        backgroundColor: "#32cd32",
        color: "white"
    },
    "purple": {
        backgroundColor: "#9a4ef1",
        color: "white"
    },
    "darkBlue": {
        backgroundColor: "#2d304e",
        color: "white"
    },
    "cyan": {
        backgroundColor: "#4e9af1",
        color: "white"
    },
    "darkTeal": {
        backgroundColor: "#187b69",
        color: "white"
    },
    "gray": {
        backgroundColor: "#d8d8d8",
        color: "rgb(20, 20, 20)"
    },
    "textwhite": {
        color: "white"
    },
    "textred": {
        color: "#f54242"
    },
    "textgreen": {
        color: "#32cd32"
    },
    "textdarkTeal": {
        color: "#187b69"
    },
    "textdark": {
        color: "rgb(20, 20, 20)"
    },
    "textgray": {
        color: "#a8a8a8"
    },
    "miny2": {
        minHeight: "2rem"
    },
    "miny4": {
        minHeight: "4rem"
    },
    "miny6": {
        minHeight: "6rem"
    },
    "boxshadow": {
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.32,
        shadowRadius: 5.46,

        elevation: 6,
    },
    "bold": {
        fontWeight: "bold"
    },
    "footerwrapper": {
        display: "flex",
        flex: 1,
        width: "100%",
        marginTop: "3rem",
        alignItems: "flex-end"
    },
    "footer": {
        minHeight: "4rem",
        width: "100%",
        display: "flex",
        alignItems: "center"
    },
    "navbar": {
        minHeight: "2rem",
        display: "flex",
        alignItems: "center",
        width: "100%",
        padding: "0.5rem",
    },
    "linebreak": {
        margin: "1rem",
        marginLeft: "0.5rem",
        marginRight: "0.5rem",
        backgroundColor: "#d8d8d8",
        height: "0.15rem",
        display: "flex",
        justifyContent: "center"
    },
    "linebreaktext": {
        backgroundColor: "#d8d8d8",
        color: "rgb(93, 93, 93)",
        padding: "0.7rem",
        fontSize: "0.8rem",
        fontWeight: "bold",
        lineHeight: 0,
        marginTop: "0.7rem",
        borderRadius: "0.5rem"
    },
    "containertitle": {
        backgroundColor: "#d8d8d8",
        position: "absolute",
        color: "rgb(93, 93, 93)",
        padding: "0.7rem 0.4rem",
        fontSize: "0.9rem",
        fontWeight: "bold",
        lineHeight: 0,
        marginTop: "1.3rem",
        borderRadius: "0.5rem",
        width: "fit-content"
    },
    "centerself": {
        marginLeft: "auto",
        marginRight: "auto",
    }
})