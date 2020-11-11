import { vw } from 'react-native-expo-viewport-units'
import { Text, TouchableHighlight } from 'react-native'
import React, { Component } from "react"
import EStyleSheet from 'react-native-extended-stylesheet'
class CategorySelector extends Component {
    constructor(props) {
        super(props)
        this.state = {
            color:"",
            name:""
        }
    }

    //=======================================================//
    render() {
        let data = this.props.data
        let textColor = {color:data.color.co}
        return (
            <TouchableHighlight 
                style={[
                    styles.selector,
                    {backgroundColor:data.color.bg}
                ]}
                underlayColor="lightgray"
                onPress={() => this.props.selectCategory(data)}
            >
                <Text
                    style={[
                        textColor,
                        styles.selectorText
                    ]}
                >
                    {data.name}
                </Text>
            </TouchableHighlight>
        )
    }

}
const styles = EStyleSheet.create({
    isLast:{
        marginBottom:"0.5rem"
    },
    selectorText:{
        fontSize:"0.7rem",
        textAlign:"center"
    },
    selector:{
        width:vw(11),
        aspectRatio:1,
        borderRadius:"0.5rem",
        margin:vw(2),
        marginTop:0,
        alignItems:"center",
        justifyContent:"center",
        overflow: "hidden"
    }
})

export default CategorySelector