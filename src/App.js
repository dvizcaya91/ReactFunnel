import React from 'react';
import logo from './logo.svg';
import './App.css';
import Square from "./Square"
import tree2 from "./tree_by_step_fixed.json"

class App extends React.Component {

  //TODO: Cuando se hace click en algún nodo que tiene hermandos, siempre está cojiendo el último hermano.
  constructor(){

    super()
    this.data = tree2
    this.state = {'level':0, 'divs':{}}
    this.level = 0
    this.clickFunction = this.clickFunction.bind(this)
    this.selected = null

  }

  /* Funcion para cuando la data viene anidada 
  getSquaresList(level, ini_list, dict, parent_size, last_x, last_y) {

    var pos_y = last_y
    var rate
    
    for(var event_id in dict){
      
      var event_ = dict[event_id]
      //console.log(event_)
      if (!event_.rate){
        rate = 0.2;
      }
      else{
        rate = event_.rate
      }
      var height = parent_size*rate;

      ini_list.push(<Square position={{height:height, top:pos_y, left:last_x, rate:rate, id:event_id}}/>)

      if(level < 10){      
        ini_list = this.getSquaresList(level+1, ini_list, event_.children, height, last_x+75, pos_y);
      }

      pos_y = pos_y+height

    }

    return ini_list

  }*/

  //Click handler/
  clickFunction(id, level){
      
      console.log(id, level)
      if(this.selected == id){
        this.selected = null
        this.level = 0  
      }
      else{
        this.selected = id
        this.level = level  
      }
      
      console.log(this.selected, this.level)
      this.setState({'change':true})
  }

  //Maneja los cuadros parent, cuando se hace click en algún nodo
  getSquaresListByStepReverse(key, level, ini_list, parent_size){
    
    var rate = 1;
    var height = parent_size;
    
    var parent_key = this.data["step_"+level][key]['parent']
    var siblings_size = 0
    if (parent_key >= 0){
      siblings_size = (this.data["step_"+(level-1)][parent_key]['childrens'].length)-1
    }
    
      
    if(siblings_size > 0){
      var big_size = parent_size*0.9
      var small_size = parent_size*0.1
    }
    else{
      var big_size = parent_size
      var small_size = 0
    }

    var green = 255-(height*0.1)
    var style = {
      height: big_size, 
      width: "75px",
      position: "absolute",
      top: 0,
      left: level*75, 
      backgroundColor: "rgb(50, "+green+", 50)",
      border: "1px solid white",
      outlineOffset: "-1px"
    }

    ini_list.push(<div style={style} id={key} key={key} rate={rate} onClick={ () => this.clickFunction(key, level) }>{key}</div>)

    if(small_size){
      var style = {
        height: small_size, 
        width: "75px",
        position: "absolute",
        top: big_size,
        left: level*75, 
        backgroundColor: "rgb(50, "+green+", 50)",
        border: "1px solid white",
        outlineOffset: "-1px"
      }
      ini_list.push(<div style={style} id={key} key={key} rate={rate} onClick={ () => this.clickFunction(parent_key, level-1) }>+{siblings_size}</div>)
    }
    

    if (this.data["step_"+level][key]['parent'] >= 0){
      this.getSquaresListByStepReverse(this.data["step_"+level][key]['parent'], level-1, ini_list, parent_size)
    }
    return ini_list
  }

  //Maneja todos los nodos hijos de manera anidada
  getSquaresListByStep(keys_arr, level, ini_list, parent_size, last_x, last_y) {

    //console.log("Regular", level, parent_size)
    var pos_y = last_y
    var rate


    for(let i = 0; i < keys_arr.length; i++){
      var key = keys_arr[i]
      
      var event_ = this.data["step_"+level][key]
      
      if (!event_.rate){
        rate = 1;
        console.log("Sin rate")
        console.log(key)
      }
      else{
        rate = event_.rate
      }
      var height = parent_size*rate;
      this.state.divs[key] = {'height':height}

      var green = 255-(height*0.1)+(last_x*0.1)
      var style = {
        height: this.state.divs[key]['height'], 
        width: "75px",
        position: "absolute",
        top: pos_y,
        left: last_x, 
        backgroundColor: "rgb(50, "+green+", 50)",
        border: "1px solid white",
        outlineOffset: "-1px"
      }


      ini_list.push(<div style={style} id={key} key={key} rate={rate} onClick={ () => this.clickFunction(key, level) }>{key}</div>)

      if(level < 100){      
        //console.log(level)
        if(event_.childrens){
          ini_list = this.getSquaresListByStep(event_.childrens, level+1, ini_list, height, last_x+75, pos_y);
        }
      }

      pos_y = pos_y+height

    }
    

    return ini_list

  }

  render() {
    
    var squares = []
    if(this.selected != null){ //Si se hizo click en algún nodo
      squares = this.getSquaresListByStepReverse(this.selected, this.level, squares, 600)
      squares = this.getSquaresListByStep(this.data['step_'+this.level][this.selected]['childrens'], this.level+1, squares, 600, (this.level+1)*75, 0);
    }
    else{ //Si se renderiza por primera vez
      squares = this.getSquaresListByStep(Object.keys(this.data['step_'+this.level]), this.level, squares, 600, 0, 0);
    }
    return (
      <div className="App">
        {squares}
      </div>
    )
  }
}

export default App;
