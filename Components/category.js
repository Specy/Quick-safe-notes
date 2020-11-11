import { vh, vw } from 'react-native-expo-viewport-units'
import {Text, View, TextInput, TouchableHighlight, Clipboard, Alert } from 'react-native'
import Card from './card'
import React, { Component } from "react"
import EStyleSheet from 'react-native-extended-stylesheet'
import GS from './globalStyle'
import Icon from 'react-native-vector-icons/MaterialIcons';
//TODO change to @react-native-community/clipboard
class Category extends Component {
    constructor(props) {
        super(props)
        this.state = {
            canDelete: props.data.canDelete,
            canEdit: false,
            settingsShown: false,
            text: props.data.name,
            editedName: props.data.name,
            editedColor: props.data.color.co,
            editedBackground:props.data.color.bg
        }
    }
    toggleEdit = () => {
        if (this.state.canEdit) {
            this.props.updateItem(this.state.text, this.props.index)
        }
        this.setState({
            canEdit: !this.state.canEdit,
        })
    }
    toggleSettings = () => {
        this.setState({
            settingsShown: !this.state.settingsShown
        })
    }
    handleText = (text) => {
        this.setState({
            text: text
        })
    }
    handleNameChange = (text) => {
        this.setState({
            editedName:text
        })
    }
    handleColorChange = (text) => {
        this.setState({
            editedColor: text
        })
    }
    handleBackgroundChange = (text) => {
        this.setState({
            editedBackground: text
        })
    }
    deleteCategory = () => {
        if(!this.state.canDelete){
            Alert.alert("WARNING", "You cannot delete this category")
            return
        }
        Alert.alert(
            "DELETE",
            "Are you sure you want to delete the category: " + this.state.text+"?",
            [
                {
                    text: 'DELETE CATEGORY',
                    onPress: () => this.props.deleteCategory(this.state.text),
                    style: 'destructive'
                },
                {
                    text: 'CANCEL',
                    onPress: () => {},
                    style:"cancel"
                }
            ]

        )
    }
    saveSettings = () =>{
        let data = {
            originalName: this.state.text,
            name:this.state.editedName,
            color: this.state.editedColor.toLowerCase(),
            background: this.state.editedBackground.toLowerCase()
        }
        this.props.changeCategorySettings(data)
        this.setState({
            settingsShown:false
        })
    }
    copy = () => {
        Clipboard.setString(this.props.children);
    }
    //=======================================================//
    render() {
        let data = this.props.data
        let settingsVisible = this.state.settingsShown
        return (
            <View
                style={[
                    styles.category,
                    { backgroundColor: data.color.bg },
                    this.props.isLast ? styles.isLast : {}
                ]}
            >
                <View style={styles.titleRow}>
                    <Text
                        style={[
                            styles.categoryTitle,
                            { color: data.color.co }
                        ]}
                    >
                        {data.name}
                    </Text>
                    <TouchableHighlight
                        style={{padding:2}}
                        onPress={this.toggleSettings}
                        underlayColor="transparent"
                    >
                        <Icon name="settings" size={25} color={data.color.co}>
                        </Icon>
                    </TouchableHighlight>

                </View>
                <View style={[
                    styles.settingsContainer,
                    settingsVisible ? {display:"flex"} : {display:"none"}
                ]}>
                    <View style={[styles.settingRow,{justifyContent:"flex-start"}]}>
                        <TouchableHighlight
                            onPress={this.deleteCategory}
                            underlayColor="transparent"
                        >
                            <Icon name="delete" size={25} color={"#f54242"}>
                            </Icon>
                        </TouchableHighlight>
                    </View>
                    <View style={styles.settingRow}>
                        <Text style={{ color: data.color.co }}>
                            Name
                        </Text>
                        <TextInput 
                            placeholder="name" 
                            style={styles.input}
                            onChangeText={text => this.handleNameChange(text)}
                            editable={this.state.canDelete}
                        >
                            {this.state.editedName}
                        </TextInput>
                    </View>
                    <View style={styles.settingRow}>
                        <Text style={{ color: data.color.co }}>
                            Text color
                        </Text>
                        <TextInput 
                            placeholder="color" 
                            style={[
                                styles.input
                            ]}
                            onChangeText={text => this.handleColorChange(text)}
                        >
                            {this.state.editedColor}
                        </TextInput>
                    </View>

                    <View style={styles.settingRow}>
                        <Text style={{color: data.color.co}}>
                            Background
                        </Text>
                        <TextInput 
                            placeholder="background" 
                            style={styles.input} 
                            onChangeText={text => this.handleBackgroundChange(text)}
                        >
                            {this.state.editedBackground}
                        </TextInput>
                    </View>
                    <TouchableHighlight style={styles.saveBtn} onPress={this.saveSettings} underlayColor="rgba(50, 205, 50,0.5)">
                        <Text style={{color:"white"}}>
                            Save
                        </Text>
                    </TouchableHighlight>
                </View>
                {data.notes.length === 0 ? 
                    <Text style={
                        {color: data.color.co,marginTop:vh(1)}
                    }>
                        Long press on the + button to select
                    </Text> 
                : null}
                {data.notes.map((e, i) => {
                    return <Card
                        removeItem={this.props.removeItem}
                        updateItem={this.props.updateItem}
                        darkMode={this.props.darkMode}
                        category={this.state.text}
                        title={e.title}
                        key={e.key}
                        index={i}
                        showToast={this.props.showToast}
                    >
                        {e.text}
                    </Card>
                })}
            </View>
        )
    }

}
const styles = EStyleSheet.create({
    titleRow:{
        flexDirection: "row", 
        alignItems:"center",
        justifyContent:"space-between",
        width:"98%"
    },
    saveBtn: {
        ...GS.green,
        width:"40%",
        borderRadius:"5rem",
        marginBottom:"0.2rem",
        marginTop:"1rem",
        padding:"0.2rem",
        alignItems:"center"
    },
    isLast: {
        marginBottom: "12rem"
    },
    settingRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        width: "100%"
    },
    input: {
        width: "50%",
        textAlign:"center",
        ...GS.wmL2,
        borderRadius: "0.5rem",
        padding: "0.2rem",
        margin: "0.3rem"
    },
    settingsContainer: {
        margin:"1rem",
        backgroundColor: "rgba(204, 205, 207, 0.4)",
        borderRadius: "0.4rem",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: "0.8rem",
        width: "90%"
    },
    categoryTitle: {
        textAlign: "center",
        fontSize: "1.5rem",
        maxWidth:"88%"
    },
    category: {
        ...GS.boxshadow,
        minHeight: "6rem",
        width: vw(96.5),
        borderRadius: "1rem",
        margin: "1rem",
        marginBottom: 0,
        padding: "0.5rem",
        alignItems: "center"
    }
})

export default Category