import { StatusBar } from 'expo-status-bar';
import React, { Component } from 'react';
import { Dimensions, Text, View, TextInput, TouchableHighlight, Alert } from 'react-native';
import Swiper from 'react-native-swiper'
import AsyncStorage from '@react-native-async-storage/async-storage';
import Category from './Components/category'
import CategorySelector from './Components/categorySelector'
import EStyleSheet from 'react-native-extended-stylesheet';
import { ScrollView } from 'react-native-gesture-handler';
import { vh, vw } from 'react-native-expo-viewport-units';
import GS from './Components/globalStyle'
import colors from './Components/colors'
import Toast from 'react-native-toast-message';
const entireScreenWidth = Dimensions.get('window').width;
import Icon from 'react-native-vector-icons/MaterialIcons';
EStyleSheet.build({ $rem: entireScreenWidth / 30 });
import * as LocalAuthentication from 'expo-local-authentication';

let placeholderNoteText = `Welcome! To add a new note, write some text in the bottom and then press the + button.
\nYou can create new categories, each will have a random color that you can customize.
To select where to add your next note, do a long press on the + button and select the category by pressing it's color. \n
You can toggle dark mode with the black circle button on top and you can display your categories horizontally by clicking the button on the very top left.
\nBy doing a long press on a note you can copy it.`
//TODO invert button for horizontal disposition, add hint on how to add an element to a category, fix category text 
class NoteClass {
	text = ""
	title = ""
	key = 1
	category = " "
	constructor(text,key,category,title){
		this.text = text
		this.key = key
		this.title = title
		this.category = category
	}
}
class CategoryClass {
	constructor(name = " ", color, canDelete = false){
		if(name != " "){
			color = getRandomColor()
		}else{
			color = { bg: "white", co:"#0C1B31"}
		}
		this.name = name
		this.color = color
		this.canDelete = canDelete
		this.notes = []
	}
	addNote(note) {
		this.notes.push(note)
	}
}
let getRandomColor = () =>{
		return colors[Math.floor(Math.random()*colors.length)]
}
export default class App extends Component {
	constructor(props) {
		super(props)
		this.state = {
			data: [],
			verticalView:true,
			newInput: "",
			darkModeOn:false,
			selectorShown: false,
			selectedCategory: " ",
			selectedCategoryColor: { bg: "white", co: "#0C1B31" },
			currentIndex: 0,
			biometricsAvailable: false,
			usesAuthentication:false,
			isAuthenticated:false,
			authPageIsOpen:false,
		} 
		this.swiper = React.createRef()
		this.scroller = React.createRef()
		this.init()
	}
	createCategory = () =>{
		let data = this.state.data
		data.push(new CategoryClass(Date.now(),undefined,true))
		this.setState({
			data: data
		}, this.saveOnStorage)

	}
	init = async () =>{
		let placeHolderNote = new NoteClass(placeholderNoteText,Date.now(),"","This is a title")
		let data = [new CategoryClass()]
		let settings = {
			darkModeOn: false,
			verticalView: true,
		}
		let isSensorAvailable = false
		let usesAuthentication = false
		try{
			data = await AsyncStorage.getItem("data")
			if(data === null){
				data = [new CategoryClass()]
				data[0].notes.push(placeHolderNote)
			}else{
				data = JSON.parse(data)
			}
			settings = await AsyncStorage.getItem("settings")
			if(settings === null){
				settings = {
					darkModeOn: false,
					verticalView: true,
				}
			}else{
				settings = JSON.parse(settings)
			}
			isSensorAvailable = await LocalAuthentication.hasHardwareAsync()
			usesAuthentication = await AsyncStorage.getItem("authentication")
			if(usesAuthentication === null){
				usesAuthentication = false
			}else{
				usesAuthentication = JSON.parse(usesAuthentication)
			}
		}catch(e){
			this.showToast("Error!","error")
		}
		if(data.length === 0) data.push({text:"",key:Date.now()})
		this.setState({
			data: data,
			darkModeOn: settings.darkModeOn,
			verticalView: settings.verticalView,
			biometricsAvailable: isSensorAvailable,
			usesAuthentication: usesAuthentication,
		})
	}
	showToast = (text,type="success") =>{
		Toast.show({
			type:type,
			position:"top",
			text1:text,
			visibilityTime:1000,
			autoHide:true,
			topOffset: GS.body.paddingTop+10
		})
	}
	saveOnStorage = () => {
		try{
			AsyncStorage.setItem("data",JSON.stringify(this.state.data))
		}catch(e){
			this.showToast("Error!", "error")
		}
	}
	handleNewInput = (text) => {
		this.setState({
			newInput: text
		})
	}
	removeItem = (elIndex,categoryName) => {
		let data = this.state.data
		let index = data.findIndex(e => {
			return e.name == categoryName
		})
		let category = data[index].notes
		category.splice(elIndex,1)
		this.setState({
			data: data
		},this.saveOnStorage)
	}
	updateItem = (text,elIndex,categoryName,title) => {
		let data = this.state.data
		let index = data.findIndex(e => {
			return e.name == categoryName
		})
		data[index].notes[elIndex].text = text
		data[index].notes[elIndex].title = title
		this.setState({
			data: data
		}, this.saveOnStorage)
	}
	deleteCategory = (name) => {
		let data = this.state.data
		let index = data.findIndex(e => {
			return e.name == name
		})
		data.splice(index,1)

		if (name === this.state.selectedCategory) {
			this.setState({
				data: data,
				selectedCategory:" ",
				selectedCategoryColor: { bg: "white", co: "#0C1B31"}
			}, this.saveOnStorage)
		} else {
			this.setState({
				data: data
			}, this.saveOnStorage)
		}
		
	}
	saveSettings = () => {
		let settings = {
			darkModeOn: this.state.darkModeOn,
			verticalView: this.state.verticalView,
		}
		try{
			AsyncStorage.setItem("settings", JSON.stringify(settings))
		}catch(e){
			this.showToast("Error!", "error")
		}
	}
	handleViewChange = ()=>{
		this.setState({
			verticalView: !this.state.verticalView
		}, this.saveSettings)
	}
	changeCategorySettings = (editedData) => {
		let data = this.state.data
		if(editedData.name != editedData.originalName &&
			data.findIndex(e=> e.name == editedData.name) != -1){
			Alert.alert("WARNING","There is already a category called: "+editedData.name)
		}
		let index = data.findIndex(e => {
			return e.name == editedData.originalName
		})
		let category = data[index]
		category.name = editedData.name
		category.color = {
			bg: editedData.background,
			co: editedData.color
		}
		if (editedData.originalName == this.state.selectedCategory){
			this.setState({
				data: data,
				selectedCategory: editedData.name,
				selectedCategoryColor: category.color
			}, this.saveOnStorage)
		}else{
			this.setState({
				data: data
			}, this.saveOnStorage)
		}
	}
	toggleDarkMode = () =>{
		this.setState({
			darkModeOn: !this.state.darkModeOn
		}, this.saveSettings)

	}
	selectCategory = (data) =>{
		let index = this.state.data.findIndex(e => {
			return e.name == data.name
		})
		if(index === -1) index = 0
		this.scrollTo(index)
		this.setState({
			selectedCategory:data.name,
			selectedCategoryColor:data.color,
			selectorShown:false,
			currentIndex:index
		})
	}
	scrollTo = (i) => {
		if(this.state.verticalView) return
		if (this.state.currentIndex === 1) {
			this.swiper.current.scrollBy(-1)
		} else {
			this.swiper.current.scrollTo(i + 1)
		}

	};
	selectCategoryByIndex = (i) => {
		let category = this.state.data[i]
		this.setState({
			selectedCategory:category.name,
			selectedCategoryColor:category.color,
			currentIndex:i
		})
	}
	toggleCategorySelector = () => {
		this.setState({
			selectorShown: !this.state.selectorShown
		})
	}
	addItem = () => {
		let data = this.state.data
		let selectedCategory = this.state.selectedCategory
		let index = data.findIndex(e =>{
			return e.name == selectedCategory
		})
		data[index].notes.push(new NoteClass(this.state.newInput, Date.now(), this.state.selectedCategory,""))
		this.setState({
			data: data,
			newInput:""
		}, this.saveOnStorage)
	}
	toggleAuthPage = () => {
		this.setState({
			authPageIsOpen:!this.state.authPageIsOpen
		})
	}
	askFingerprint =async () => {
		let question = this.state.usesAuthentication ? "Remove fingerprint authentication" : "Turn on biometric authentication"
		let result = await LocalAuthentication.authenticateAsync({
				promptMessage: question,
				cancelLabel:"Cancel"
			})
		if(this.state.usesAuthentication){
			if (result.success) AsyncStorage.setItem("authentication", "false")
			this.setState({usesAuthentication:false},this.showToast("Removed fingerprint authentication"))
		}else{
			if (result.success) AsyncStorage.setItem("authentication", "true")
			this.setState({ usesAuthentication: true }, this.showToast("Added fingerprint authentication"))
		}
		this.setState({
			authPageIsOpen:false
		})
	}
	askForFinger = async () => {
		let result = await LocalAuthentication.authenticateAsync()
		if(result.success){
			this.setState({
				isAuthenticated:true
			})
		}
	}
	askForLoginpage = () =>{
		return <View style={styles.authInPage}>
			<Text 
				style={[
					styles.authPageTitle,
					this.state.darkModeOn? {color:"white"} : {}
				]}
			>
				Not authenticated
			</Text>
			<TouchableHighlight onPress={this.askForFinger} underlayColor="transparent">
				<Icon name="fingerprint" size={80} color={this.state.darkModeOn ? "white" : "black"}>

				</Icon>
			</TouchableHighlight>
		</View>
	}
	vertical() {
		if (this.state.usesAuthentication && !this.state.isAuthenticated) return this.askForLoginpage()
		return <View>
			< ScrollView
				ref={this.scroller}
				keyboardShouldPersistTaps={"handled"}
				style={styles.categoryContainer}
				contentContainerStyle={{ alignItems: "center" }}
				showsVerticalScrollIndicator={false}
			>
				{Object.keys(this.state.data).map((e, i, a) => {
					let data = this.state.data[e]
					return <Category
						key={data.name}
						changeCategorySettings={this.changeCategorySettings}
						isLast={a.length === i + 1}
						deleteCategory={this.deleteCategory}
						removeItem={this.removeItem}
						updateItem={this.updateItem}
						darkMode={this.state.darkModeOn}
						data={data}
						showToast={this.showToast}
					>
					</Category>
				})}
			</ScrollView>
		</View>
	}
	horizontal(){
		if (this.state.usesAuthentication && !this.state.isAuthenticated) return this.askForLoginpage()
	return <Swiper
				ref={this.swiper}
				showsPagination={true}
				paginationStyle={[
					styles.pagination
				]}
				dotStyle={this.state.darkModeOn ? {backgroundColor:"white"}:{}}
				onIndexChanged={index => this.selectCategoryByIndex(index)}
				keyboardShouldPersistTaps={"handled"}
			>
				{Object.keys(this.state.data).map((e, i, a) => {
					let data = this.state.data[e]
					return < ScrollView
						keyboardShouldPersistTaps={"handled"}
						key={data.name}
						contentContainerStyle={[
							{ alignItems: "center",paddingBottom:vh(15)},
						]}
						showsVerticalScrollIndicator={false}
					>
						<Category
							key={data.name}
							changeCategorySettings={this.changeCategorySettings}
							isLast={a.length === i + 1}
							deleteCategory={this.deleteCategory}
							removeItem={this.removeItem}
							updateItem={this.updateItem}
							darkMode={this.state.darkModeOn}
							data={data}
							showToast={this.showToast}
						>
						</Category>
					</ScrollView> 
				})}
		</Swiper>
	}

	render() {
		return (
			<View style={[GS.body, this.state.darkModeOn ? styles.dmBg:{...GS.wmL1}]}>
				<StatusBar style={this.state.darkModeOn ? "light" : "dark"} />
				<View style={styles.header}>
					<View style={{flexDirection:"row"}}>
						<TouchableHighlight
							onPress={this.handleViewChange}
							underlayColor="lightgray"
							style={styles.verticalBtn}
						>
							<View style={!this.state.verticalView ? { transform: [{ rotate: "90deg" }] } : {}}>
								<Icon name="view-headline" size={25} color={this.state.darkModeOn ? "white" : "black"}>

								</Icon>
							</View>
						</TouchableHighlight>
						<TouchableHighlight
							underlayColor="lightgray"
							onPress={this.toggleDarkMode}
							style={styles.verticalBtn}
						>
							<Icon 
								name={this.state.darkModeOn ? "brightness-7" : "brightness-2"}
								size={25} 
								color={this.state.darkModeOn ? "white" : "black"}>

							</Icon>
						</TouchableHighlight>
						<TouchableHighlight
							underlayColor="lightgray"
							onPress={this.toggleAuthPage}
							style={styles.verticalBtn}
						>
							<Icon 
								name={this.state.usesAuthentication ? "lock" : "lock-open"}
								size={25}
								color={this.state.darkModeOn ? "white" : "black"}>

							</Icon>
						</TouchableHighlight>
					</View>

					<TouchableHighlight onPress={this.createCategory}
						style={{borderRadius:styles.verticalBtn.borderRadius,paddingRight:5,paddingLeft:5}}
						underlayColor="lightgray"
					>
						<Text style={{
							color: this.state.darkModeOn ? "white" : "black" ,
							fontSize:16,
							textAlign: "right"
						}}>
							New category
						</Text>
					</TouchableHighlight>
				</View>



				{!this.state.authPageIsOpen ? null : 
					<View style={styles.passwordPage}>
						<Text 
							style={[
								styles.authPageTitle,
								this.state.darkModeOn ? {color:"white"} : {color:"black"}
							]}
						>
							{this.state.usesAuthentication ? 
								"Press the X to remove fingerprint authentication" 
							   :"You can lock this app with fingerprint authenticatation"
						}
						</Text>
						<TouchableHighlight onPress={this.askFingerprint} underlayColor="transparent">
							<Icon 
								name={this.state.usesAuthentication ? "clear" : "fingerprint"}
								size={80}
								color={this.state.darkModeOn ? "white" : "black"}
							>

							</Icon>
						</TouchableHighlight>
					</View>
				}

				{this.state.verticalView ? this.vertical(): this.horizontal()}
				<View
					style={[
						styles.selectCategory,
						this.state.selectorShown ? { zIndex: 2 } : { bottom: vh(2), height: 0 },
						this.state.darkModeOn ? { ...GS.dmL3, ...GS.textdark } : {}
					]}
				>
					<ScrollView
						keyboardShouldPersistTaps={"handled"}
						showsVerticalScrollIndicator={false}
						contentContainerStyle={{
							justifyContent: "flex-end",
							alignItems: "center",
							flexDirection: "column",
							paddingTop: vh(1),
						}}>
						{Object.keys(this.state.data).map((e, i, a) => {
							let data = this.state.data[e]
							let toSend = {
								name: data.name,
								color: data.color
							}
							return <CategorySelector
								data={toSend}
								key={data.name}
								isLast={a.length === i + 1}
								canDelete={data.canDelete}
								selectCategory={this.selectCategory}
							>
							</CategorySelector>
						})}
					</ScrollView>
				</View>

				<View 
					style={[
						styles.footer,
						this.state.darkModeOn ? {...GS.dmL3} : {}
					]}
				>
					<TextInput
						style={[
							styles.textInput,
							this.state.darkModeOn ? { ...GS.dmL5 } : {}
						]}
						placeholder="Write text here"
						placeholderTextColor="gray"
						multiline={true}
						onChangeText={text => this.handleNewInput(text)}
						defaultValue={this.state.newInput}
					>

					</TextInput>
					<TouchableHighlight 
						style={[
							styles.leftButtons,
							{
								backgroundColor:this.state.selectedCategoryColor.bg,
							}
						]} 
						underlayColor={"lightgray"}
						onPress={this.addItem}
						onLongPress={this.toggleCategorySelector}
					>
						<Icon name="add" color={this.state.selectedCategoryColor.co} size={vw(8)}>

						</Icon>
					</TouchableHighlight>
				</View>
				<Toast ref={(ref) => Toast.setRef(ref)} />
			</View>
		);
	}
}

const styles = EStyleSheet.create({
	formRow: { 
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		width: "100%", 
		marginTop: "5rem" 
		},
	authInPage:{
		width: vw(100),
		height: vh(110),
		padding: "2rem",
		paddingBottom: "13rem",
		paddingTop: "10rem",
		justifyContent: "space-between",
		alignItems: "center",
		zIndex: 1000,
		backgroundColor: "rgba(163, 163, 163,0.4)",
		position: "absolute"
	},
	passwordPage:{
		width:vw(100),
		height:vh(100),
		padding:"2rem",
		paddingBottom:"13rem",
		paddingTop:"10rem",
		justifyContent:"space-between",
		alignItems:"center",
		zIndex:1000
	},
	authPageTitle:{
		fontSize:"2rem",
		textAlign:"center"
	},	
	formInput: {
		...GS.wmL3,
		padding: "0.5rem",
		alignItems: "flex-start",
		color: "black",
		borderRadius:"0.8rem",
		width:vw(50)
	},
	dmBg:{
		backgroundColor:"#051021"
	},
	verticalBtn:{
		padding:"0.2rem",
		borderRadius:"0.4rem"
	},
	pagination:{
		marginBottom:"3.5rem",
		flex:1,
		flexWrap:"wrap",
		marginRight:"0.2rem",
		marginLeft:"0.2rem"
	},
	increasedMargin:{
		marginRight:"1rem"
	},
	header: {
		width: "95%",
		paddingBottom:"0.5rem",
		margin: "0.5rem",
		marginBottom:0,
		flexDirection:"row",
		alignItems:"center",
		justifyContent:"space-between"
	},
	categoryContainer: {
		flex: 1,
		width: vw(100),
		paddingBottom: "12rem",
	},
	selectCategory:{
		position:"absolute",
		flex:1,
		maxHeight: vh(40),
		width:"4.3rem",

		borderRadius:"1rem",
		overflow:"hidden",
		bottom:"5.3rem",
		right: "0.5rem",
		flexDirection:"column",
		...GS.dmL1
	},
	addBtn: {
		...GS.textwhite,
		fontSize: "3rem",
		fontWeight: "bold"
	},
	leftButtons: {
		width: vw(11),
		aspectRatio: 1,
		borderRadius: "0.7rem",
		justifyContent: "center",
		alignItems: "center",
		marginLeft: "0.5rem",
		height:"4rem"
	},
	textInput: {
		...GS.dmL3,
		...GS.textwhite,
		padding: "0.5rem",
		alignItems: "flex-start",
		borderRadius: "0.7rem",
		flex: 1,
		height: "100%"
	},
	footer: {
		...GS.margin05,
		...GS.dmL1,
		...GS.row,
		flex:1,
		position: "absolute",
		bottom: 0,
		padding: "0.5rem",
		maxHeight:"15rem",
		borderRadius: "1rem",
		alignItems:"flex-end"
	}
});