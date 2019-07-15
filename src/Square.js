import React from "react"

class Square extends React.Component {


	render(){

		var green = 255-(this.props.position.height*0.1)+(this.props.position.left*0.1)
		var style = {
			height: this.props.position.height, 
			width: "75px",
			position: "absolute",
			top: this.props.position.top,
			left: this.props.position.left, 
			backgroundColor: "rgb(50, "+green+", 50)",
			border: "1px solid white",
			outlineOffset: "-1px"
		}
		//
		return (<div style={style} id={this.props.position.id} rate={this.props.position.rate}></div>)

	}
}

export default Square