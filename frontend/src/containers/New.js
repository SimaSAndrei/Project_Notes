import React, { Component } from 'react';

class New extends Component {
    constructor(props) {
        super(props) 
        this.state = {
            active: false,
            classes: "list"
        }

        this.showItems = async () => {
            let on = !this.state.active;
            let cls = on ? "list-active" : "list";
    
            await this.setState({
                active: on,
                classes: cls
            })   
        }

        this.onCreate = async (value) => {
            this.props.onCreate(value);
        }
    }

    render() {
        return (
            <div >
                <span id="new">
                    <input id="newNote" type="button" value="New note" onClick={() => this.onCreate("note")}/>
                    <img id="openNew" 
                        src="https://freesvg.org/storage/img/thumb/book_lying_generic.png"
                        height="35px" width="20px" align={"center"} alt="open" onClick={this.showItems}/>
                </span>  
                <div id="listNew" className={this.state.classes}>
                            <input className="new listItemNew" type="button" value="Note" onClick={() => this.onCreate("note")}/>
                            <input className="new listItemNew" type="button" value="Book" onClick={() => this.onCreate("book")}/>
                            <input className="new listItemNew" type="button" value="Shared" onClick={() => this.onCreate("shared")}/>
                    </div>
            </div>
        )
    }
}

export default New;