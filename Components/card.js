import { View, TextInput, TouchableHighlight, Clipboard} from 'react-native'
import React, { Component } from "react"
import EStyleSheet from 'react-native-extended-stylesheet'
import GS from './globalStyle'
import Icon from 'react-native-vector-icons/MaterialIcons';
import { vh,vw } from 'react-native-expo-viewport-units';
//TODO change to @react-native-community/clipboard
class Card extends Component {
    constructor(props) {
        super(props)
        this.state = {
            canEdit: false,
            text: this.props.children,
            title: this.props.title
        }
    }
    toggleEdit = () => {
        if(this.state.canEdit){
            this.props.updateItem(this.state.text,this.props.index,this.props.category,this.state.title)
        }
        this.setState({
            canEdit: !this.state.canEdit
        })
    }
    handleTitle = (text) => {
        this.setState({
            title: text
        })
    }
    handleText = (text) => {
        this.setState({
            text:text
        })
    }
    copy = () => {
        Clipboard.setString(this.props.children);
        this.props.showToast("Copied!")
    }
    //=======================================================//
    render() {
        let darkMode = this.props.darkMode
        return (
            <View 
                style={[
                    styles.container,
                    darkMode ? {...GS.dmL1} : {}
                ]}
            >
                <View style={[
                    styles.textContainer,
                    this.state.canEdit && darkMode ? {...GS.textdark} : {}
                    ]}>
                    <View 
                        style={[
                            styles.titleWrapper,
                            this.state.title.length === 0 ? { display: "none" } : {},
                            this.state.canEdit ? { display: "flex", ...GS.wmL3 } : {},
                        ]}
                    >
                        <TextInput
                            style={[
                                styles.title,
                                darkMode ? { ...GS.textwhite } : {},
                                this.state.canEdit && darkMode ? { ...GS.textdark } : {}
                            ]}
                            spellCheck={false}
                            placeholder={this.state.canEdit ? "Press to edit the title" : ""}
                            placeholderTextColor="white"
                            editable={this.state.canEdit}
                            onChangeText={text => this.handleTitle(text)}
                        >
                            {this.state.title}
                        </TextInput>
                    </View>


                    <TouchableHighlight
                        style={{flex:1}}
                        onLongPress={this.copy}
                        underlayColor="rgba(50, 205, 50, 0.1)"
                    >
                        <TextInput
                            style={[
                                styles.textInput,
                                this.state.canEdit ? styles.canEdit : {},
                                darkMode ? { ...GS.textwhite } : {},
                                this.state.canEdit && darkMode ? {...GS.textdark} : {},
                                this.state.title.length !== 0 ? styles.morePadding : {}
                            ]}
                            textAlignVertical={this.state.title.length === 0 ? "center":"top"}
                            placeholder="Edit me to add text!"
                            onChangeText={text => this.handleText(text)}
                            placeholderTextColor="gray"
                            multiline={true}
                            editable={this.state.canEdit}
                        >
                            {this.state.text}
                        </TextInput>
                    </TouchableHighlight>
                </View>

                <View style={styles.leftButtons}>
                    <TouchableHighlight 
                        style={[styles.button, { backgroundColor: "#F87060" }]} 
                        onPress={() => this.props.removeItem(this.props.index,this.props.category)}
                        underlayColor="lightgray"
                    >
                        <Icon 
                            name="delete" 
                            size={styles.leftButtons.height / 2.5}
                            color="white"
                        >

                        </Icon>
                    </TouchableHighlight>
                    <TouchableHighlight 
                        style={[styles.button, { backgroundColor: "#11BBBB" }]}
                        onPress={this.toggleEdit}
                        underlayColor="lightgray"
                    >
                        <Icon 
                            name={this.state.canEdit ? "save" : "create"} 
                            size={styles.leftButtons.height/2.5}
                            color="white"
                        >

                        </Icon>
                    </TouchableHighlight>
                </View>
            </View>
        )
    }
}
const styles = EStyleSheet.create({
    morePadding:{
        paddingTop:"0rem"
    },
    titleWrapper:{
        height:"1.2rem",
    },    
    textContainer:{
        flex:1,
        borderRadius: "0.6rem",
        overflow:"hidden",
        flexDirection:"column"
    },
    title:{
        flexDirection:"row",
        textAlign:"center",
        fontSize:"1.1rem",
        textAlignVertical: 'bottom',
        padding:0,
        marginRight:"-4rem",
        color:"black",
    },
    canEdit:{
        backgroundColor:"#dbdbdb",
        display:"flex"
    },
    button:{
        width:"100%",
        flex:1,
        justifyContent:"center",
        alignItems:"center"
    },
    container:{
        ...GS.container,
        ...GS.fillX,
        ...GS.row,
        ...GS.boxshadow,
        ...GS.wmL2,
        margin:"0.4rem"
    },
    leftButtons: {
        width: "3.8rem",
        height: "3.85rem",
        flexDirection:"column",
        borderRadius: "0.6rem",
        marginLeft: "0.5rem",
        overflow:"hidden",

    },
    textInput: {
        ...GS.wmL2,
        padding: "0.5rem",
        alignItems: "flex-start",
        backgroundColor:"transparent",
        color: "black",
        flex:1,
    }
})
export default Card